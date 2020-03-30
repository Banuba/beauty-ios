#version 300 es

layout( location = 0 ) in vec3 attrib_pos;

layout(std140) uniform glfx_GLOBAL
{
    mat4 glfx_MVP;
    mat4 glfx_PROJ;
    mat4 glfx_MV;
    vec4 glfx_QUAT;
    vec4 js_hair_color;
	vec4 js_on_off;
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

out vec2 var_uv;
out vec2 var_hairmask_uv;
out vec4 hair_color;

uniform sampler2D glfx_HAIR_MASK;

void main()
{
	float onOff = js_on_off.x;
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 1., 1. );
	var_uv = v*0.5 + 0.5;

	mat2x3 hair_basis = mat2x3(glfx_HAIR_MASK_T[0].xyz, glfx_HAIR_MASK_T[1].xyz);
	var_hairmask_uv = vec3(v,1.)*hair_basis;
	hair_color = js_hair_color;
	hair_color *= onOff;
}