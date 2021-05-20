#version 300 es

precision highp float;
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
	vec4 unused;
	vec4 glfx_SCREEN;
	vec4 glfx_BG_MASK_T[2];
	vec4 glfx_HAIR_MASK_T[2];
	vec4 glfx_LIPS_MASK_T[2];
	vec4 glfx_L_EYE_MASK_T[2];
	vec4 glfx_R_EYE_MASK_T[2];
	vec4 glfx_SKIN_MASK_T[2];
	vec4 glfx_OCCLUSION_MASK_T[2];
};

in vec4 var_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D glfx_BACKGROUND, glfx_SKIN_MASK;

#define YUV2RGB_RED_CrV 1.402
#define YUV2RGB_GREEN_CbU 0.3441
#define YUV2RGB_GREEN_CrV 0.7141
#define YUV2RGB_BLUE_CbU 1.772

vec4 rgba2yuva (vec4 rgba)
{
	vec4 yuva = vec4(0.);

	yuva.x = rgba.r * 0.299 + rgba.g * 0.587 + rgba.b * 0.114;
	yuva.y = rgba.r * -0.169 + rgba.g * -0.331 + rgba.b * 0.5 + 0.5;
	yuva.z = rgba.r * 0.5 + rgba.g * -0.419 + rgba.b * -0.081 + 0.5;
	yuva.w = rgba.a;

	return yuva;
}

void main()
{

	float onOff = js_skin_color.a;
	vec3 bg = texture( glfx_BACKGROUND, var_uv.xy ).xyz;

	vec4 js_yuva = rgba2yuva(js_skin_color);
	vec2 maskColor = js_yuva.yz;
	float beta = js_yuva.x;

	float y = dot(bg, vec3(0.2989,0.5866,0.1144));

	vec2 uv_src = vec2(
		dot(bg, vec3(-0.1688,-0.3312,0.5)) + 0.5,
		dot(bg, vec3(0.5,-0.4183,-0.0816)) + 0.5);

	float alpha = abs( glfx_SKIN_MASK_T[1].w 
		- texture( glfx_SKIN_MASK, var_uv.zw )[int(glfx_SKIN_MASK_T[0].w)] ) * js_yuva.w;

	vec2 uv = (1.0 - alpha) * uv_src + alpha * ((1.0 - beta) * maskColor + beta * uv_src);

	float u = uv.x - 0.5;
	float v = uv.y - 0.5;

	float r = y + YUV2RGB_RED_CrV * v;
	float g = y - YUV2RGB_GREEN_CbU * u - YUV2RGB_GREEN_CrV * v;
	float b = y + YUV2RGB_BLUE_CbU * u;

	vec4 color = vec4(r, g, b, 1.0);

	if(onOff > 0.01){
		F = color;
	} else {
		F = texture( glfx_BACKGROUND, var_uv.xy );
	}
}
