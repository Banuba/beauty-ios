#version 300 es

precision lowp float;
precision lowp sampler2D;
#define GLSLIFY 1

in vec2 var_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D bokeh;

void main()
{
	F = texture(bokeh,var_uv);
}
