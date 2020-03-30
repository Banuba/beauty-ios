#version 300 es

layout( location = 0 ) in vec3 attrib_pos;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 0., 1. );
}