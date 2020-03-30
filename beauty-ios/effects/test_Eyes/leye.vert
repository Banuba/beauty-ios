#version 300 es

layout( location = 3 ) in vec2 attrib_uv;

layout(std140) uniform glfx_BASIS_DATA
{
	vec4 unused;
	vec4 glfx_SCREEN;
	vec4 glfx_BG_MASK_T[2];
	vec4 glfx_HAIR_MASK_T[2];
	vec4 glfx_LIPS_MASK_T[2];
	vec4 glfx_L_EYE_MASK_T[2];
	vec4 glfx_R_EYE_MASK_T[2];
	vec4 glfx_SKIN_MASK_T[2];
	vec4 glfx_OCCLUSION_MASK_T[2];
};

out vec2 var_uv;

void main()
{
	mat3 eye_m = inverse( mat3( 
		glfx_L_EYE_MASK_T[0].xyz, 
		glfx_L_EYE_MASK_T[1].xyz, 
		vec3(0.,0.,1.) ) );

	gl_Position = vec4( (vec3(attrib_uv,1.)*eye_m).xy, 0., 1. );
	var_uv = attrib_uv;
}