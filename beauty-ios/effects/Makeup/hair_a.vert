#version 300 es
#define GLSLIFY 1

layout( location = 0 ) in vec3 attrib_pos;

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
out vec2 var_hairmask_uv;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 1., 1. );
	var_uv = v*0.5 + 0.5;

	mat2x3 hair_basis = mat2x3(glfx_HAIR_MASK_T[0].xyz, glfx_HAIR_MASK_T[1].xyz);
	var_hairmask_uv = vec3(v,1.)*hair_basis;
}