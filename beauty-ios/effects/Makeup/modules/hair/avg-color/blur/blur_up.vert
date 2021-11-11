#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0)
BNB_IN vec2 attrib_pos;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_camera);

BNB_OUT(0)
vec4 var_uv;

void main()
{
    var_uv.xy = attrib_pos * 0.5 + 0.5;

#ifdef BNB_VK_1
    var_uv.y = 1. - var_uv.y;
#endif

    var_uv.zw = var_uv.xy + 0.5 / vec2(textureSize(BNB_SAMPLER_2D(tex_camera), 0).xy);

    gl_Position = vec4(attrib_pos, 0., 1.);
}