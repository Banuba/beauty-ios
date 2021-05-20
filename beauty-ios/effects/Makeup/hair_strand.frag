#version 300 es

#if defined GL_EXT_shader_framebuffer_fetch
#extension GL_EXT_shader_framebuffer_fetch : require
#elif defined GL_ARM_shader_framebuffer_fetch
#extension GL_ARM_shader_framebuffer_fetch : require
#endif

precision mediump float;
#define GLSLIFY 1

in vec2 var_uv;
in vec2 var_hair_mask_uv;

#ifdef GL_EXT_shader_framebuffer_fetch
layout( location = 0 ) inout vec4 F;
#else
layout( location = 0 ) out vec4 F;
#endif

#if !defined GL_EXT_shader_framebuffer_fetch && !defined GL_ARM_shader_framebuffer_fetch
uniform sampler2D glfx_BACKGROUND;
#endif

uniform sampler2D glfx_HAIR_MASK;
uniform sampler2D colored_hair_strand;
uniform sampler2D blured_hair_strand;

vec4 cubic(float v)
{
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    float w = 6.0 - x - y - z;
    return vec4(x, y, z, w) * (1.0/6.0);
}

vec4 textureBicubic(sampler2D sampler, vec2 texCoords)
{
   vec2 texSize = vec2(textureSize(sampler, 0));
   vec2 invTexSize = 1.0 / texSize;
   
   texCoords = texCoords * texSize - 0.5;

   
    vec2 fxy = fract(texCoords);
    texCoords -= fxy;

    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);

    vec4 c = texCoords.xxyy + vec2(-0.5, +1.5).xyxy;
    
    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4(xcubic.yw, ycubic.yw) / s;
    
    offset *= invTexSize.xxyy;
    
    vec4 sample0 = texture(sampler, offset.xz);
    vec4 sample1 = texture(sampler, offset.yz);
    vec4 sample2 = texture(sampler, offset.xw);
    vec4 sample3 = texture(sampler, offset.yw);

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix(
       mix(sample3, sample2, sx), mix(sample1, sample0, sx)
    , sy);
}

vec3 hsv2rgb(vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) -1.0, 0.0, 1.0);

    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 rgb2yuv(vec3 rgb)
{
    float Y =  0.299 * rgb.x + 0.587 * rgb.y + 0.114 * rgb.z; // Luma
    float U = -0.147 * rgb.x - 0.289 * rgb.y + 0.436 * rgb.z; // Delta Blue
    float V =  0.615 * rgb.x - 0.515 * rgb.y - 0.100 * rgb.z; // Delta Red

    return vec3(Y, U, V);
}

vec3 yuv2rgb(vec3 yuv)
{
    float R = yuv.x + 1.140 * yuv.z;
    float G = yuv.x - 0.395 * yuv.y - 0.581 * yuv.z;
    float B = yuv.x + 2.032 * yuv.y;

    return vec3(R, G, B);
}

void main()
{
#if defined GL_EXT_shader_framebuffer_fetch
    vec3 bg = F.xyz;
#elif defined GL_ARM_shader_framebuffer_fetch
    vec3 bg = gl_LastFragColorARM.xyz;
#else
    vec3 bg = texture( glfx_BACKGROUND, var_uv.xy ).xyz;
#endif

    const float threshold = 0.2;
    float mask = max((textureBicubic(glfx_HAIR_MASK, var_hair_mask_uv).x-threshold)/(1.-threshold),0.);
    vec3 hair_strand_color = texture(blured_hair_strand, var_uv).rgb;

    vec3 bg_yuv = rgb2yuv(bg);
    vec3 clr_yuv = rgb2yuv(hsv2rgb(hair_strand_color));

    bg_yuv.gb = (1.0 - mask) * bg_yuv.gb + mask * (0.3 * bg_yuv.gb + 0.7 * clr_yuv.gb);

    F = vec4(yuv2rgb(bg_yuv), 1.0);
}
