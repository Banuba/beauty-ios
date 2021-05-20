#version 300 es
#define GLSLIFY 1

layout( location = 0 ) in vec3 attrib_pos;

uniform sampler2D bg_masked;

out vec2 var_uv;
flat out float step_x;

const float FILTER_RADIUS = 1.;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 1., 1. );
	var_uv = v*0.5 + 0.5;
	step_x = FILTER_RADIUS/float(textureSize(bg_masked,0).x);
}