#include <bnb/glsl.frag>

BNB_IN(0)
vec4 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_camera);

void main()
{
    float blur_radius = var_hair_blur_radius.x;

    // clang-format off
    bnb_FragColor = 
		(1. / 6.) * (
			BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv.zw) + 
			BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv.zw + vec2(-blur_radius,            0) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0))) + 
			BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv.zw + vec2(           0, -blur_radius) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0))) + 
			BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv.zw + vec2(-blur_radius, -blur_radius) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0)))
        ) + 
		(1. / 12.) * (
			BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv.xy + vec2( blur_radius, 0) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0))) + 
			BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv.xy + vec2(-blur_radius, 0) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0))) + 
			BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv.xy + vec2( 0, blur_radius) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0))) + 
			BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv.xy + vec2( 0,-blur_radius) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0)))
        );
    // clang-format on
}