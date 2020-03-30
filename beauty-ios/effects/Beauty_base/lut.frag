#version 300 es

//#define YVG_NO_LUT_SCALE

#if defined GL_EXT_shader_framebuffer_fetch
#extension GL_EXT_shader_framebuffer_fetch : require
#elif defined GL_ARM_shader_framebuffer_fetch
#extension GL_ARM_shader_framebuffer_fetch : require
#endif

precision lowp float;
precision lowp sampler3D;

#ifdef GL_EXT_shader_framebuffer_fetch
layout( location = 0 ) inout vec4 F;
#else
layout( location = 0 ) out vec4 F;
#endif

uniform sampler3D glfx_WLUT0;

void main()
{
#if defined GL_EXT_shader_framebuffer_fetch
	vec3 bg = F.xyz;
#elif defined GL_ARM_shader_framebuffer_fetch
	vec3 bg = gl_LastFragColorARM.xyz;
#else
	vec3 bg = vec3(0.);
	discard; // TODO
#endif

#ifndef YVG_NO_LUT_SCALE
	bg = bg*(63./64.)+(0.5/64.);
#endif
	vec3 c = texture( glfx_WLUT0, bg ).xyz;
	F = vec4(c,1.);
}
