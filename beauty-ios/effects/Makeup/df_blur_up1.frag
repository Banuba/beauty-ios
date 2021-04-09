#version 300 es
precision lowp float;
#define GLSLIFY 1
layout( location = 0 ) out vec4 F;
uniform sampler2D tex_df_blur_u1;
in vec4 var_uv;
void main()
{
	vec3 sum = 
		(1./6.)*(
			texture      (tex_df_blur_u1,var_uv.zw             ).xyz + 
			textureOffset(tex_df_blur_u1,var_uv.zw,ivec2(-1, 0)).xyz + 
			textureOffset(tex_df_blur_u1,var_uv.zw,ivec2( 0,-1)).xyz + 
			textureOffset(tex_df_blur_u1,var_uv.zw,ivec2(-1,-1)).xyz) + 
		(1./12.)*(
			textureOffset(tex_df_blur_u1,var_uv.xy,ivec2( 1, 0)).xyz + 
			textureOffset(tex_df_blur_u1,var_uv.xy,ivec2(-1, 0)).xyz + 
			textureOffset(tex_df_blur_u1,var_uv.xy,ivec2( 0, 1)).xyz + 
			textureOffset(tex_df_blur_u1,var_uv.xy,ivec2( 0,-1)).xyz);
	F = vec4(sum,1.);
}