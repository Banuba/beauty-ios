#include <bnb/glsl.frag>
#include <bnb/color_spaces.glsl>
#include "filtered_mask.glsl"

BNB_IN(0)
vec2 var_uv;
BNB_IN(1)
vec2 var_hair_mask_uv;
BNB_IN(2)
vec2 var_strands_mask_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_camera);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_hair_mask);
BNB_DECLARE_SAMPLER_2D(4, 5, tex_gradient_mask);
BNB_DECLARE_SAMPLER_2D(6, 7, tex_strands_mask);
BNB_DECLARE_SAMPLER_2D(8, 9, tex_avg_color);

/*
    in hair_strand mode
    var_hair_colors[0] - small strand, represents hair deep shadows
    var_hair_colors[1] - average strand, represents hair sub-shadows
    var_hair_colors[2] - the biggest strand, represents base hair color
    var_hair_colors[3] - average strand, represents hair sub-highlights
    var_hair_colors[4] - small strand, represents hair highlights
*/

vec4 get_color(int index)
{
    if (index == 0)
        return var_hair_color0;
    if (index == 1)
        return var_hair_color1;
    if (index == 2)
        return var_hair_color2;
    if (index == 3)
        return var_hair_color3;
    if (index == 4)
        return var_hair_color4;
    return vec4(0.);
}

/* returns interpolated color */
vec4 hair_color_linear(float x)
{
    float sample0 = x;

    int sample1 = int(floor(sample0));
    int sample2 = int(ceil(sample0));
    float ratio = fract(sample0);

    vec4 color1 = get_color(sample1);
    vec4 color2 = get_color(sample2);

    return mix(color1, color2, ratio);
}

vec4 color(vec4 base, vec4 avg_color, vec4 target)
{
    vec3 base_LCh = bnb_rgb_to_LCh(base.rgb);
    vec3 avg_LCh = bnb_rgb_to_LCh(avg_color.rgb);
    vec3 target_LCh = bnb_rgb_to_LCh(target.rgb);

    float d = base_LCh.x - avg_LCh.x;
    float c = target_LCh.x / avg_LCh.x;

    /* Poor man's solution to increase contrast of "dark to light" coloring */
    c = d > 0. // kepp shine as is
            ? c
            : c < 1. // keep shadows as is for "light to dark" recolor
                  ? c
                  : pow(c, 1.618); // increase shadows for "dark to lingh" coloring

    float dL = d * c;

    vec3 res_LCh = vec3(
        target_LCh.x + dL,
        target_LCh.y,
        target_LCh.z);

    vec3 res_rgb = bnb_LCh_to_rgb(res_LCh);

    vec3 colored = mix(base.rgb, res_rgb, target.a);

    return vec4(colored, base.a);
}

void main()
{
    float mask = hair_mask(BNB_PASS_SAMPLER_ARGUMENT(tex_hair_mask), var_hair_mask_uv);
    vec4 camera = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv);
    vec4 avg_color = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_avg_color), var_uv);

    float target_color_idx = 0.;

    if (var_hair_coloring_mode.x == 1.)
        target_color_idx = gradient_mask(BNB_PASS_SAMPLER_ARGUMENT(tex_gradient_mask), var_uv, var_hair_colors_count.x);
    if (var_hair_coloring_mode.x == 2.)
        target_color_idx = strands_mask(BNB_PASS_SAMPLER_ARGUMENT(tex_strands_mask), var_strands_mask_uv);

    vec4 target_color = hair_color_linear(target_color_idx);

    vec4 colored = color(camera, avg_color, target_color);

    bnb_FragColor = vec4(colored.rgb, mask);
}