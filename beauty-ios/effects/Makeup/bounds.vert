#version 300 es
#define GLSLIFY 1
layout( location = 0 ) in vec3 attrib_pos;
void main()
{
	gl_Position = vec4( attrib_pos.xy, 1., 1. );
}