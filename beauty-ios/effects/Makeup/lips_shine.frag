#version 300 es

#if defined GL_EXT_shader_framebuffer_fetch
#extension GL_EXT_shader_framebuffer_fetch : require
#elif defined GL_ARM_shader_framebuffer_fetch
#extension GL_ARM_shader_framebuffer_fetch : require
#endif

precision mediump float;
#define GLSLIFY 1

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
};

in vec4 var_uv;

#ifdef GL_EXT_shader_framebuffer_fetch
layout( location = 0 ) inout vec4 F;
#else
layout( location = 0 ) out vec4 F;
#endif

uniform sampler2D glfx_BACKGROUND;
uniform sampler2D glfx_LIPS_MASK;
uniform sampler2D glfx_LIPS_SHINE_MASK;
uniform sampler2D noise_tex;

const float eps = 0.0001;

vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs( mod( c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0 ) - 3.0 ) - 1.0, 0.0, 1.0 );
	return c.z * mix( vec3(1.0), rgb, c.y );
}

vec3 rgb2hsv( in vec3 c )
{
    vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix( vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z < c.y) ? 1.0 : 0.0 );
    vec4 q = mix( vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x < c.x) ? 1.0 : 0.0 );
    float d = q.x - min( q.w, q.y );
    return vec3(abs( q.z + (q.w - q.y) / (6.0 * d + eps) ), d / (q.x+eps), q.x );
}

vec3 lipstik( vec3 bg )
{
	float sCoef = js_lips_shine.x;

	vec3 js_color_hsv = rgb2hsv( js_lips_color.rgb );
	vec3 bg_color_hsv = rgb2hsv( bg );

	float color_hsv_s = js_color_hsv.g * sCoef;
	if ( sCoef > 1. ) {
		color_hsv_s = js_color_hsv.g + (1. - js_color_hsv.g) * (sCoef - 1.);
	}

	vec3 color_lipstick = vec3(
		js_color_hsv.r,
		color_hsv_s,
		bg_color_hsv.b);

	return color_lipstick;
}

void main()
{
	float nUVScale = glfx_SCREEN.y/(js_lips_glitter.z*256.);
	vec4 noise = texture(noise_tex,var_uv.zw*nUVScale)*2.-1.;

	vec4 maskColor = texture( glfx_LIPS_MASK, var_uv.zw );
	float maskAlpha = maskColor[int(glfx_LIPS_MASK_T[0].w)];

#if defined GL_EXT_shader_framebuffer_fetch
	vec3 bg = F.xyz;
#elif defined GL_ARM_shader_framebuffer_fetch
	vec3 bg = gl_LastFragColorARM.xyz;
#else
	vec3 bg = texture( glfx_BACKGROUND, var_uv.xy ).xyz;
#endif

	float nCoeff = js_lips_glitter.x*0.0025;
	vec3 bg_noised = texture( glfx_BACKGROUND, var_uv.xy + noise.xy*nCoeff ).xyz;

	// Lipstick
	vec3 color_lipstick = lipstik( bg );
	float nCoeff2 = js_lips_glitter.y*0.02;
	float color_lipstick_b_noised = lipstik( bg_noised ).z + noise.z*nCoeff2;

	float vCoef = js_lips_shine.y;
	float sCoef1 = js_lips_shine.z;
	float bCoef = js_lips_shine.w;
	float a = 20.;
	float b = .75;

	vec3 color_lipstick_b = color_lipstick * vec3(1., 1., bCoef);
	vec3 color = maskAlpha * hsv2rgb( color_lipstick_b ) + (1. - maskAlpha) * bg;

	// Shine
	vec4 shineColor = texture( glfx_LIPS_SHINE_MASK, var_uv.zw );
	float shineAlpha = shineColor[int(glfx_LIPS_MASK_T[0].w)];

	float v_min = lips_nn_params.x;
	float v_max = lips_nn_params.y;

	float x = (color_lipstick_b_noised - v_min) / (v_max - v_min);
	float y = 1. / (1. + exp( -(x - b) * a * (1. + x) ));

	float v1 = color_lipstick_b_noised * (1. - maskAlpha) + color_lipstick_b_noised * maskAlpha * bCoef;
	float v2 = color_lipstick_b_noised + (1. - color_lipstick_b_noised) * vCoef * y;
	float v3 = mix( v1, v2, y );

	vec3 color_shine = vec3(
		color_lipstick.x,
		color_lipstick.y * (1. - sCoef1 * y),
		v3);

	color = mix(color, hsv2rgb( color_shine ), shineAlpha);
	
	F = vec4(mix(bg,color,js_lips_color.w), 1.0);
}
