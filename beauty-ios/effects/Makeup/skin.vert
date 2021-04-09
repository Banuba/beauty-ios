#version 300 es
#define GLSLIFY 1

layout( location = 0 ) in vec3 attrib_pos;

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

out vec4 var_uv;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 1., 1. );

	mat2x3 nn_m = mat2x3( 
		glfx_SKIN_MASK_T[0].xyz, 
		glfx_SKIN_MASK_T[1].xyz );

	var_uv.xy = v*0.5 + 0.5;
	var_uv.zw = vec3(v,1.)*nn_m;
}