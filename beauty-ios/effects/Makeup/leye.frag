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

in vec2 var_uv;
in vec2 var_bg_uv;

#ifdef GL_EXT_shader_framebuffer_fetch
layout( location = 0 ) inout vec4 F;
#else
layout( location = 0 ) out vec4 F;
#endif

#if !defined GL_EXT_shader_framebuffer_fetch && !defined GL_ARM_shader_framebuffer_fetch
uniform sampler2D glfx_BACKGROUND;
#endif

uniform sampler2D glfx_L_EYE_MASK;

vec4 rgba2yuva (vec4 rgba)
{
	vec4 yuva = vec4(0.);

	yuva.x = rgba.r * 0.299 + rgba.g * 0.587 + rgba.b * 0.114;
	yuva.y = rgba.r * -0.169 + rgba.g * -0.331 + rgba.b * 0.5 + 0.5;
	yuva.z = rgba.r * 0.5 + rgba.g * -0.419 + rgba.b * -0.081 + 0.5;
	yuva.w = rgba.a;

	return yuva;
}

vec2 rgb_hs( vec3 rgb )
{
	float cmax = max(rgb.r, max(rgb.g, rgb.b));
	float cmin = min(rgb.r, min(rgb.g, rgb.b));
	float delta = cmax - cmin;
	vec2 hs = vec2(0.);
	if( cmax > cmin )
	{
		hs.y = delta/cmax;
		if( rgb.r == cmax )
			hs.x = (rgb.g-rgb.b)/delta;
		else
		{
			if( rgb.g == cmax )
				hs.x = 2.+(rgb.b-rgb.r)/delta;
			else
				hs.x = 4.+(rgb.r-rgb.g)/delta;
		}
		hs.x = fract(hs.x/6.);
	}
	return hs;
}

float rgb_v( vec3 rgb )
{
	return max(rgb.r, max(rgb.g, rgb.b));
}

vec3 hsv_rgb( float h, float s, float v )
{
	return v*mix(vec3(1.),clamp(abs(fract(vec3(1.,2./3.,1./3.)+h)*6.-3.)-1.,0.,1.),s);
}

vec3 blendColor(vec3 base, vec3 blend) {
	float v = rgb_v( base );
	vec2 hs = rgb_hs( blend );
	return hsv_rgb( hs.x, hs.y, v );
}

vec3 blendColor(vec3 base, vec3 blend, float opacity) {
    return (blendColor(base, blend) * opacity + base * (1.0 - opacity));
}

void main()
{
	vec4 c = js_eyes_color;

#if defined GL_EXT_shader_framebuffer_fetch
	vec3 bg = F.xyz;
#elif defined GL_ARM_shader_framebuffer_fetch
	vec3 bg = gl_LastFragColorARM.xyz;
#else
	vec3 bg = texture(glfx_BACKGROUND, var_bg_uv).rgb;
#endif

	float alpha = texture( glfx_L_EYE_MASK, var_uv )[int(glfx_L_EYE_MASK_T[0].w)]*c.w;
	F = vec4(blendColor(bg, js_eyes_color.xyz, alpha * js_eyes_color.w), 1.);
}
