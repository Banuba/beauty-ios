#version 300 es

precision highp float;

layout(std140) uniform glfx_GLOBAL
{
    mat4 glfx_MVP;
    mat4 glfx_PROJ;
    mat4 glfx_MV;
    vec4 glfx_QUAT;

    vec4 js_color;
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

in vec2 var_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D glfx_L_EYE_MASK;

void main()
{   
    float onOff = js_on_off.x;
	vec4 c = js_color;
	c *= onOff;
	c.xyz *= texture( glfx_L_EYE_MASK, var_uv )[int(glfx_L_EYE_MASK_T[0].w)]*c.w;
	F = c;
}
