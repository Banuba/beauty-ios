#include <bnb/glsl.frag>
#include "../filtered_mask.glsl"

BNB_IN(0)
vec2 var_uv;
BNB_IN(1)
vec2 var_mask_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_camera);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_mask);

void main()
{
    float mask = hair_mask(BNB_PASS_SAMPLER_ARGUMENT(tex_mask), var_mask_uv);
    vec4 camera = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv);

    bnb_FragColor = camera * step(0.001, mask);
}