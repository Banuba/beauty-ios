#version 300 es
#define GLSLIFY 1

layout( location = 0 ) in vec3 attrib_pos;

out vec4 var_uv;

uniform sampler2D tex_df_blur_u1;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 1., 1. );
	var_uv.xy = v*0.5 + 0.5;
	var_uv.zw = var_uv.xy + 0.5/vec2(textureSize(tex_df_blur_u1,0));
}