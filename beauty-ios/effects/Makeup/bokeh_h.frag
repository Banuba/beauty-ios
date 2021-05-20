#version 300 es

precision mediump float;
#define GLSLIFY 1

in vec2 var_uv;
flat in float step_x;

layout( location = 0 ) out vec4 R;
layout( location = 1 ) out vec4 G;
layout( location = 2 ) out vec4 B;

uniform sampler2D bg_masked;

const vec4 kernel[] = vec4[](
	vec4(0.064754,0.000000,  0.064754,0.000000),
	vec4(0.063647,0.005252,  0.062782,0.001529),
	vec4(0.057972,0.019812,  0.057015,0.005570),
	vec4(0.042178,0.038585,  0.047976,0.010684),
	vec4(0.013015,0.050223,  0.036693,0.015064),
	vec4(-0.021449,0.040468, 0.024700,0.017215),
	vec4(-0.038708,0.006957, 0.013753,0.016519),
	vec4(-0.020612,-0.025574,0.005324,0.013416),
	vec4(0.014096,-0.022658, 0.000115,0.009116)
);

const int KERNEL_RADIUS = 8;

void main()
{
	vec4 valR = vec4(0.);
	vec4 valG = vec4(0.);
	vec4 valB = vec4(0.);

	for( int i = -KERNEL_RADIUS; i <= KERNEL_RADIUS; ++i )
	{
		vec2 uv = var_uv;
		uv.x + step_x*float(i);
		vec3 img_pixel = texture(bg_masked,uv).xyz;
		vec4 k = kernel[abs(i)];
		valR += img_pixel.r*k;
		valG += img_pixel.g*k;
		valB += img_pixel.b*k;
	}

	R = valR;
	G = valG;
	B = valB;
}
