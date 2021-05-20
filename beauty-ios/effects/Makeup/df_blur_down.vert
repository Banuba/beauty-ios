#version 300 es
#define GLSLIFY 1

layout( location = 0 ) in vec3 attrib_pos;

out vec2 var_uv;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 1., 1. );
	var_uv = v*0.5 + 0.5;
}