#version 300 es

precision mediump float;
precision mediump int;

layout( location = 0 ) in vec3 attrib_pos;
layout( location = 1 ) in vec2 attrib_uv;
layout( location = 3 ) in vec4 attrib_red_mask;

layout(std140) uniform glfx_GLOBAL
{
    mat4 glfx_MVP;
    mat4 glfx_PROJ;
    mat4 glfx_MV;
    vec4 unused;
    
    vec4 script_data1;
    vec4 script_data2;
    vec4 script_data3;
    vec4 script_data4;
    vec4 script_data5;
    vec4 script_data6;
    vec4 js_is_apply_makeup;
    vec4 script_data7;
    vec4 js_makeup_mul_color;
};

out vec3 maskColor;
out vec4 var_uv_bg_uv;
out vec2 var_uv;
invariant gl_Position;

void main()
{
    gl_Position = glfx_MVP * vec4( attrib_pos, 1. );
    maskColor = attrib_red_mask.xyz;
    vec2 bg_uv  = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
    vec2 half_fish_uv = smoothstep(0.,1.,attrib_uv);
    half_fish_uv.x = min(half_fish_uv.x,1.-half_fish_uv.x)*2.;
    var_uv_bg_uv = vec4(half_fish_uv,bg_uv);
    var_uv = attrib_uv;
}
