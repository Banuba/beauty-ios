#version 300 es

#define PSI 0.05

#define teethSharpenIntensity 0.2

precision mediump float;
precision mediump int;
precision lowp sampler2D;
precision lowp sampler3D;
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

 layout(std140) uniform glfx_OCCLUSION_DATA
 {
    vec4 glfx_OCCLUSION_RECT;
    vec4 glfx_SCREEN;
 };

in vec3 maskColor;
in vec4 var_uv_bg_uv;
in vec2 var_uv;

uniform sampler2D glfx_BACKGROUND;

uniform sampler2D tex_makeup;
uniform sampler2D tex_highlight;
uniform sampler2D tex_softlight;

uniform sampler2D tex_composite_makeup;

uniform sampler3D glfx_WLUT1, glfx_WLUT2;

vec3 textureLookup(vec3 originalColor, sampler3D lookupTexture)
{
    return texture(lookupTexture, originalColor.xyz*(63./64.)+0.5/64.).xyz;
}

vec3 whitening(vec3 originalColor, float factor, sampler3D lookup) {
    vec3 color = textureLookup(originalColor, lookup);
    return mix(originalColor, color, factor);
}

vec3 sharpen(vec3 originalColor, float factor) {
    float dx = glfx_SCREEN.z;
    float dy = glfx_SCREEN.w;
    
    vec3 total = 5.0 * originalColor
    - texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w-dy)).xyz
    - texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w-dy)).xyz
    - texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w+dy)).xyz
    - texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w+dy)).xyz;

    vec3 result = mix(originalColor, total, factor);
    return clamp(result, 0.0, 1.0);
}

vec3 softSkin(vec3 originalColor, float factor) {
    vec3 screenColor = originalColor;

    float dx = 4.0 / glfx_SCREEN.x;
    float dy = 4.0 / glfx_SCREEN.y;
    
    vec3 nextColor0 = texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w-dy)).xyz;
    vec3 nextColor1 = texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w-dy)).xyz;
    vec3 nextColor2 = texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w+dy)).xyz;
    vec3 nextColor3 = texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w+dy)).xyz;
    
    float intensity = screenColor.g;
    vec4 nextIntensity = vec4(nextColor0.g, nextColor1.g, nextColor2.g, nextColor3.g);
    

    vec4 lg = nextIntensity - intensity;
    

    vec4 curr = max(0.367 - abs(lg * (0.367*0.6/(1.41*PSI))), 0.);
    
    float summ = 1.0 + curr.x + curr.y + curr.z + curr.w;
    screenColor += (nextColor0 * curr.x + nextColor1 * curr.y + nextColor2 * curr.z + nextColor3 * curr.w);
    screenColor = screenColor * (factor / summ);
    
    screenColor = originalColor*(1.-factor) + screenColor;
    return screenColor;
}

float softlight_blend_1ch(float a, float b)
{
   return ((1.-2.*b)*a+2.*b)*a;
}

vec3 softlight_blend_1ch(vec3 base, vec3 blend) {
    return vec3(softlight_blend_1ch(base.r,blend.r),softlight_blend_1ch(base.g,blend.g),softlight_blend_1ch(base.b,blend.b));
}

vec3 softlight_blend_1ch(vec3 base, vec3 blend, float opacity) {
    return (softlight_blend_1ch(base, blend) * opacity + base * (1.0 - opacity));
}

void main()
{
    vec2 uv = var_uv;
    vec2 bg_uv = var_uv_bg_uv.zw;

    float softlight_alpha = js_softlight.y*maskColor.r;
    float flare_alpha = js_softlight.z;
    
    float skinSoftIntensity = js_skinsoftening_removebags_rotation.x;
    float RemoveBagsIntensity = js_skinsoftening_removebags_rotation.y;
    float rot = js_skinsoftening_removebags_rotation.z;
    
    vec3 res = texture(glfx_BACKGROUND, bg_uv).xyz;
    
    float soft_skin_factor = maskColor.r * skinSoftIntensity;
 
    res = softSkin(res, soft_skin_factor);

    if( maskColor.g > 1./255. )
    {
        float sharp_factor = maskColor.g * teethSharpenIntensity;
        res = sharpen(res, sharp_factor);
        float teeth_factor = maskColor.g;
        res = whitening(res, teeth_factor, glfx_WLUT2);
    }

    if( maskColor.b > 1./255. )
    {
        float e_factor = maskColor.b;
        res = whitening(res, e_factor, glfx_WLUT1);
    }

    if (js_is_apply_makeup.z != 0.5){
        res = res + texture( tex_highlight, uv ).xyz * js_is_apply_makeup.z * flare_alpha;
    }

    if (js_is_apply_makeup.y > 0.5){
        vec4 soft_light_layer = texture( tex_softlight, uv );

        const float soft_cutoff0 = 0.3;
        const float soft_cutoff1 = 0.7;
        float brightness = res.g;
        float light_factor = smoothstep(soft_cutoff0,soft_cutoff1,brightness);
        soft_light_layer.xyz = mix( 
            vec3(dot(soft_light_layer.xyz,vec3(0.299,0.587,0.114))), 
            soft_light_layer.xyz, 
            light_factor );

        vec3 softlight_color = softlight_blend_1ch( res, soft_light_layer.xyz );

        res = mix(res, softlight_color, softlight_alpha*mix(1.,rot,soft_light_layer.w));
    }
    
    if (js_is_apply_makeup.x > 0.5) {
        vec2 uvh = vec2(abs(2.0 * (uv.x - 0.5)),uv.y);

        if (js_makeup_type.x > 0.5) {
            uvh = uv;
        }
        vec4 makeup_color = texture(tex_makeup, uvh);
        res = mix(res, makeup_color.rgb, makeup_color.w);
    }
    
    vec4 composite_makeup = texture(tex_composite_makeup, uv);
    res = res*(1.-composite_makeup.a) + composite_makeup.rgb;
    
    F = vec4(res, 1.);
}
