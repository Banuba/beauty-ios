#version 300 es

precision mediump float;
precision mediump int;

layout( location = 0 ) in vec3 attrib_pos;
layout( location = 1 ) in vec2 attrib_uv;

layout(std140) uniform glfx_GLOBAL
{
    mat4 glfx_MVP;
    mat4 glfx_PROJ;
    mat4 glfx_MV;
    vec4 unused;
    vec4 script_data1;
    vec4 script_data2;
    vec4 script_data3;
};

out vec4 var_uv;

invariant gl_Position;

void main()
{
    gl_Position = glfx_MVP * vec4( attrib_pos, 1. );
    vec2 uv_flare = (attrib_uv-vec2(332./1024.,394./1024.))/vec2(360./1024.,80./1024.);
    vec2 uv_half = attrib_uv;
    uv_half.x = abs(uv_half.x*2. - 1.);
    uv_half = (uv_half-vec2(52./512.,332./1024.))/vec2(216./512.,128./1024.);
    var_uv = vec4(uv_flare,uv_half);
}
