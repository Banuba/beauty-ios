#version 300 es

precision mediump float;
precision mediump int;
#define GLSLIFY 1

layout( location = 0 ) in vec3 attrib_pos;

out vec2 var_uv;
out vec2 var_bg_uv;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 0., 1. );
	var_uv = v*0.5+0.5;
	var_bg_uv = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
}
