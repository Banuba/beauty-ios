#version 300 es
precision lowp float;
#define GLSLIFY 1
layout( location = 0 ) out vec4 F;
uniform sampler2D glfx_BACKGROUND;
in vec2 var_uv;
void main()
{
	vec3 sum = 
		0.5*texture(glfx_BACKGROUND,var_uv).xyz + 
		0.125*(
			textureOffset(glfx_BACKGROUND,var_uv,ivec2( 1, 1)).xyz + 
			textureOffset(glfx_BACKGROUND,var_uv,ivec2(-1, 1)).xyz + 
			textureOffset(glfx_BACKGROUND,var_uv,ivec2(-1,-1)).xyz + 
			textureOffset(glfx_BACKGROUND,var_uv,ivec2( 1,-1)).xyz); 
	F = vec4(sum,1.);
}