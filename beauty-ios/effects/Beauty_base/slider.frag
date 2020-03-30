#version 300 es

precision highp float;

in vec2 var_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D glfx_BACKGROUND;
uniform sampler2D luttex1, luttex2;

in float slider_pos, slider_alpha;

vec4 finalColorFilter(vec4 orgColor, sampler2D luttex)
{
    const float EPS = 0.000001;
    const float pxSize = 512.0;
    
    float bValue = (orgColor.b * 255.0) / 4.0;
    
    vec2 mulB = clamp(floor(bValue) + vec2(0.0, 1.0), 0.0, 63.0);
    vec2 row = floor(mulB / 8.0 + EPS);
    vec4 row_col = vec4(row, mulB - row * 8.0);
    vec4 lookup = orgColor.ggrr * (63.0/pxSize) + row_col * (64.0/pxSize) + (0.5/pxSize);
    
    float b1w = bValue - mulB.x;
    
	lookup*= pxSize;
	ivec4 positions = ivec4(lookup);

    vec3 sampled1 = texelFetch(luttex, positions.zx, 0).rgb;
    vec3 sampled2 = texelFetch(luttex, positions.wy, 0).rgb;
    
    vec3 res = mix(sampled1, sampled2, b1w);
    return vec4(res, orgColor.a);
}

void main()
{
    if (slider_alpha < 0.1) discard;

    vec3 color;
    if (var_uv.x > slider_pos){
	    color = finalColorFilter(texture( glfx_BACKGROUND, var_uv ), luttex1).xyz;
    }
    else {
	    color = finalColorFilter(texture( glfx_BACKGROUND, var_uv ), luttex2).xyz;
    }
	F = vec4 (color, 1.0);
}
