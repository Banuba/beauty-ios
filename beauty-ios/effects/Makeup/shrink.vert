#version 300 es
#define GLSLIFY 1
layout( location = 0 ) in vec3 attrib_pos;
out float var_y;
void main()
{
	gl_Position = vec4( attrib_pos.xy, 1., 1. );
	var_y = attrib_pos.y*0.5+0.5;
}