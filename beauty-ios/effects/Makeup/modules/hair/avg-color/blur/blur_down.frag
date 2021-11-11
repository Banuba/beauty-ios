#include <bnb/glsl.frag>

BNB_IN(0)
vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_camera);

void main()
{
    float blur_radius = var_hair_blur_radius.x;

    // clang-format off
    bnb_FragColor = 
			0.5 * BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv) + 
			0.125 * (
				BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv + vec2( blur_radius, blur_radius) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0).xy)) + 
				BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv + vec2(-blur_radius, blur_radius) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0).xy)) + 
				BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv + vec2(-blur_radius,-blur_radius) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0).xy)) + 
				BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv + vec2( blur_radius,-blur_radius) / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0).xy))
					);
    // clang-format on
}