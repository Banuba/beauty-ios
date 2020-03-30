#version 300 es

#if defined GL_EXT_shader_framebuffer_fetch
#extension GL_EXT_shader_framebuffer_fetch : require
#elif defined GL_ARM_shader_framebuffer_fetch
#extension GL_ARM_shader_framebuffer_fetch : require
#endif

precision highp float;
precision lowp sampler3D;

#ifdef GL_EXT_shader_framebuffer_fetch
layout( location = 0 ) inout vec4 F;
#else
layout( location = 0 ) out vec4 F;
#endif

in vec2 var_uv;
in float var_touch_pos;
// layout( location = 0 ) inout vec4 F;

uniform sampler2D glfx_BACKGROUND;

// vec3 finalColorFilter(vec3 orgColor, sampler2D lut)
// {
//     const float EPS = 0.000001;
//     const float pxSize = 512.0;
    
//     float bValue = (orgColor.b * 255.0) / 4.0;
    
//     vec2 mulB = clamp(floor(bValue) + vec2(0.0, 1.0), 0.0, 63.0);
//     vec2 row = floor(mulB / 8.0 + EPS);
//     vec4 row_col = vec4(row, mulB - row * 8.0);
//     vec4 lookup = orgColor.ggrr * (63.0/pxSize) + row_col * (64.0/pxSize) + (0.5/pxSize);
    
//     float b1w = bValue - mulB.x;
    
// 	lookup*= pxSize;
// 	ivec4 positions = ivec4(lookup);

//     vec3 sampled1 = texelFetch(lut, positions.zx, 0).rgb;
//     vec3 sampled2 = texelFetch(lut, positions.wy, 0).rgb;
    
//     vec3 res = mix(sampled1, sampled2, b1w);
//     return res;
// }

void main()
{
    float div_pos = var_touch_pos;
    vec3 bg1 = texture(glfx_BACKGROUND, var_uv).rgb;

    #if defined GL_EXT_shader_framebuffer_fetch
	vec3 bg2 = F.xyz;
    #elif defined GL_ARM_shader_framebuffer_fetch
        vec3 bg2 = gl_LastFragColorARM.xyz;
    #else
        vec3 bg2 = vec3(0.);
        discard; // TODO
    #endif

    // vec4 c2 = vec4(0.0, 1.0, 1.0, 1.0);
    float divider = smoothstep(div_pos, div_pos, var_uv.x);
    F.xyz = mix(bg2, bg1, divider) * (divider * divider + (1.0 - divider) * (1.0 - divider));
    F.w = 1.0;
}
