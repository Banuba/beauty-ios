#include <bnb/glsl.frag>
#include <bnb/texture_bicubic.glsl>

BNB_IN(0)
vec4 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, liner_mask);

void main()
{
    vec4 js_lips_color = vec4(var_lips_liner_color);
    float maskAlpha = BNB_TEXTURE_2D(BNB_SAMPLER_2D(liner_mask), var_uv.zw).x;

    bnb_FragColor = vec4(js_lips_color.xyz, js_lips_color.a * maskAlpha);
}
