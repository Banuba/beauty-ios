#version 300 es
#define GLSLIFY 1

layout( location = 3 ) in vec2 attrib_uv;

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

out vec2 var_uv;
out vec2 var_bg_uv;

void main()
{
	mat3 eye_m = inverse( mat3( 
		glfx_L_EYE_MASK_T[0].xyz, 
		glfx_L_EYE_MASK_T[1].xyz, 
		vec3(0.,0.,1.) ) );

	if( js_is_face_tracked.x < 0.5 ) 
		gl_Position = vec4(2.,2.,0.,1.); // instead of discard in frag shader move whole polygon outside of screen in vert
	else
		gl_Position = vec4( (vec3(attrib_uv,1.)*eye_m).xy, 0., 1. );
	var_uv = attrib_uv;
	var_bg_uv = gl_Position.xy*0.5+0.5;
}