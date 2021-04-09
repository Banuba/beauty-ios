#version 300 es

#if defined GL_EXT_shader_framebuffer_fetch
#extension GL_EXT_shader_framebuffer_fetch : require
#elif defined GL_ARM_shader_framebuffer_fetch
#extension GL_ARM_shader_framebuffer_fetch : require
#endif

#define mixRate 0.01

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

in vec2 var_uv;
in vec2 var_hairmask_uv;

#ifdef GL_EXT_shader_framebuffer_fetch
layout( location = 0 ) inout vec4 F;
#else
layout( location = 0 ) out vec4 F;
#endif

#if !defined GL_EXT_shader_framebuffer_fetch && !defined GL_ARM_shader_framebuffer_fetch
uniform sampler2D glfx_BACKGROUND;
#endif

uniform sampler2D glfx_HAIR_MASK;

vec3 rgb2yuv(vec3 rgb)
{
    vec3 yuv;
    yuv.x = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
    yuv.y = rgb.r * -0.169 + rgb.g * -0.331 + rgb.b * 0.5 + 0.5;
    yuv.z = rgb.r * 0.5 + rgb.g * -0.419 + rgb.b * -0.081 + 0.5;
    return yuv;
}

vec3 yuv2rgb(vec3 yuv)
{
    float Y = yuv.x;
    vec2 UV = yuv.yz - 0.5;
    return vec3(Y+1.4*UV.y,Y-0.343*UV.x-0.711*UV.y,Y+1.765*UV.x);
}

void main()
{
#if defined GL_EXT_shader_framebuffer_fetch
    vec3 bg = F.xyz;
#elif defined GL_ARM_shader_framebuffer_fetch
    vec3 bg = gl_LastFragColorARM.xyz;
#else
    vec3 bg = texture(glfx_BACKGROUND, var_uv).rgb;
#endif

    vec2 uv = var_hairmask_uv;
    
    float alpha = texture( glfx_HAIR_MASK, var_hairmask_uv )[0];
    float beta = 0.5;

    vec3 pixel1 = rgb2yuv(bg);

    vec3 yuv1 = rgb2yuv(js_hair_colors[0].rgb);

    if(alpha > 0.05)
    {
        pixel1[1] = (1. - alpha)*pixel1[1] + alpha*((beta)*pixel1[1] + (1. - beta)*yuv1[1]);
        pixel1[2] = (1. - alpha)*pixel1[2] + alpha*((beta)*pixel1[2] + (1. - beta)*yuv1[2]);
    }

    F = vec4(mix(bg,yuv2rgb(pixel1),js_hair_colors[0].w), 1.);
    // F = vec4(yuv2rgb(pixel1), 1.);
}
