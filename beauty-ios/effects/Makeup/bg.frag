#version 300 es

precision mediump float;
#define GLSLIFY 1

layout( location = 0 ) out vec4 F;

layout(std140) uniform glfx_GLOBAL
{
	highp mat4 glfx_MVP;
	highp mat4 glfx_PROJ;
	highp mat4 glfx_MV;
	highp vec4 glfx_QUAT;

	// retouch
	highp vec4 js_softlight; // y - softlight strength, z - eyeflare strength
  highp vec4 js_skinsoftening_removebags_rotation;
	highp vec4 js_is_apply_makeup; // x - makeup, y - softlight, z - eyeflare
	highp vec4 js_makeup_type;

	// selective makeup
	highp vec4 js_blushes_color;
	highp vec4 js_contour_color;
	highp vec4 js_eyeliner_color;
	highp vec4 js_eyeshadow_color;
	highp vec4 js_lashes_color;
	highp vec4 js_lashes3d_color;
	highp vec4 js_brows_color;
	highp vec4 js_highlighter_color;

	// common variable
	// TODO: but actually has effect only for eyes coloring
	highp vec4 js_is_face_tracked;

	// LUT filter
	highp vec4 js_slider_pos_alpha;

	// background texture
	highp vec4 js_bg_rotation;
	highp vec4 js_bg_scale;
	highp vec4 js_platform_data; //  "0 0 0 0" - Android, "1 0 0 0" - iOS

	// skin
	highp vec4 js_skin_color;

	// eyes coloring
	highp vec4 js_eyes_color;

	// hair coloring (monotone & gradient)
	highp vec4 js_hair_colors[8];
	highp vec4 js_hair_colors_size;
	// hair strands coloring
	highp vec4 js_strand_colors[5];

	// mat & shiny lips color
	highp vec4 js_lips_color;
	// mat lips brightness & contrast
	highp vec4 js_lips_brightness_contrast;
	// lips shine parameters: color saturation, brightness (intensity), saturation (color bleeding),  darkness (more is less)
	highp vec4 js_lips_shine;
	// lips glitter parameters noiseness (width), highlights, grain (pixely)
	highp vec4 js_lips_glitter;

	// the value must declared at the end - this is SDK convention
	// shiny lips nn-specific params

	highp vec4 lips_nn_params; // no `js_` prefix cuz the value is not set by JS but by SDK
};

layout(std140) uniform glfx_BASIS_DATA
{
    highp vec4 unused;
    highp vec4 glfx_SCREEN;
    highp vec4 glfx_BG_MASK_T[2];
    highp vec4 glfx_HAIR_MASK_T[2];
    highp vec4 glfx_LIPS_MASK_T[2];
    highp vec4 glfx_L_EYE_MASK_T[2];
    highp vec4 glfx_R_EYE_MASK_T[2];
    highp vec4 glfx_SKIN_MASK_T[2];
    highp vec4 glfx_OCCLUSION_MASK_T[2];
    highp vec4 glfx_LIPS_SHINE_MASK_T[2];
    highp vec4 glfx_HAIR_STRAND_MASK_T[2];
};

in vec2 var_uv;
in vec2 var_bg_mask_uv;

uniform sampler2D bgTex;
uniform sampler2D glfx_BACKGROUND;
uniform sampler2D glfx_BG_MASK;

vec4 cubic(float v) {
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    float w = 6.0 - x - y - z;
    return vec4(x, y, z, w) * (1.0 / 6.0);
}

vec4 textureBicubic(sampler2D sampler, vec2 texCoords){
    vec2 texSize = vec2(textureSize(sampler, 0));
    vec2 invTexSize = 1.0 / texSize;

    texCoords = texCoords * texSize - 0.5;

    vec2 fxy = fract(texCoords);
    texCoords -= fxy;

    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);

    vec4 c = texCoords.xxyy + vec2(-0.5, +1.5).xyxy;

    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4(xcubic.yw, ycubic.yw) / s;

    offset *= invTexSize.xxyy;

    vec4 sample0 = texture(sampler, offset.xz);
    vec4 sample1 = texture(sampler, offset.yz);
    vec4 sample2 = texture(sampler, offset.xw);
    vec4 sample3 = texture(sampler, offset.yw);

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix(
        mix(sample3, sample2, sx), mix(sample1, sample0, sx)
    , sy);
}

vec2 rgb_hs(vec3 rgb)
{
    float cmax = max(rgb.r, max(rgb.g, rgb.b));
    float cmin = min(rgb.r, min(rgb.g, rgb.b));
    float delta = cmax - cmin;
    vec2 hs = vec2(0.0);

    if (cmax > cmin) {
        hs.y = delta/cmax;
        if (rgb.r == cmax)
            hs.x = (rgb.g - rgb.b) / delta;
        else 
        {
            if (rgb.g == cmax)
                hs.x = 2.0 + (rgb.b - rgb.r) / delta;
            else
                hs.x = 4.0 + (rgb.r - rgb.g) / delta;
        }
        hs.x = fract(hs.x / 6.0);
    }
    
    return hs;
}

float rgb_v(vec3 rgb)
{
    return max(rgb.r, max(rgb.g, rgb.b));
}

vec3 hsv_rgb(float h, float s, float v)
{
    return v * mix(vec3(1.0), clamp(abs(fract(vec3(1.0, 2.0 / 3.0, 1.0 / 3.0) + h) * 6.0 - 3.0) - 1.0, 0.0, 1.0), s);
}

float filtered_bg_simple( sampler2D mask_tex, vec2 uv )
{
	float bg1 = texture( mask_tex, uv ).x;
	if( bg1 > 0.98 || bg1 < 0.02 )
		return bg1;

	vec2 o = 1./vec2(textureSize(mask_tex,0));
	float bg2 = texture( mask_tex, uv + vec2(o.x,0.) ).x;
	float bg3 = texture( mask_tex, uv - vec2(o.x,0.) ).x;
	float bg4 = texture( mask_tex, uv + vec2(0.,o.y) ).x;
	float bg5 = texture( mask_tex, uv - vec2(0.,o.y) ).x;

	return 0.2*(bg1+bg2+bg3+bg4+bg5);
}

vec2 rotate_uv(vec2 uv, float angle)
{
	float aspect_ratio = glfx_SCREEN.y / glfx_SCREEN.x;
	float c = cos(radians(angle));
	float s = sin(radians(angle));

	uv.y *= aspect_ratio;

	uv = vec2(mat3(c, -s, 0., s, c, 0., 0.5, 0.5, 1.0) * vec3(uv - 0.5, 1.));

	uv.y *= 1. / aspect_ratio;
	return uv;
}

vec2 scale_uv(vec2 uv, float scale)
{
	float inv_scale = 1. / scale;
	return vec2(mat3(inv_scale, 0., 0., 0., inv_scale, 0., 0.5, 0.5, 1.0) * vec3(uv - 0.5, 1.));
}

vec3 blendColor(vec3 base, vec3 blend) {
    float v = rgb_v(base);
    vec2 hs = rgb_hs(blend);
    return hsv_rgb(hs.x, hs.y, v);
}

vec3 blendColor(vec3 base, vec3 blend, float opacity) {
    return (blendColor(base, blend) * opacity + base * (1.0 - opacity));
}

void main()
{   
    vec2 uv = rotate_uv(var_uv, js_bg_rotation.x);
	uv = scale_uv(uv, js_bg_scale.x);
	uv.y = 1. - uv.y;

    vec3 bg_color = texture(bgTex, uv).xyz;
    
    const float threshold = 0.2;

    float mask = max((textureBicubic(glfx_BG_MASK,var_bg_mask_uv).x - threshold) / (1.0 - threshold), 0.0);

    F = vec4(bg_color, mask);
}