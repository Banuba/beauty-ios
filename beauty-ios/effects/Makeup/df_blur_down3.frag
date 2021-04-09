#version 300 es
precision lowp float;
#define GLSLIFY 1
layout( location = 0 ) out vec4 F;
uniform sampler2D tex_df_blur_d2;
in vec2 var_uv;
void main()
{
	vec3 sum = 
		0.5*texture(tex_df_blur_d2,var_uv).xyz + 
		0.125*(
			textureOffset(tex_df_blur_d2,var_uv,ivec2( 1, 1)).xyz + 
			textureOffset(tex_df_blur_d2,var_uv,ivec2(-1, 1)).xyz + 
			textureOffset(tex_df_blur_d2,var_uv,ivec2(-1,-1)).xyz + 
			textureOffset(tex_df_blur_d2,var_uv,ivec2( 1,-1)).xyz); 
	F = vec4(sum,1.);
}