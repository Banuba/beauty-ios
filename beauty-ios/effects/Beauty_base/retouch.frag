#version 300 es

precision mediump float;
precision mediump int;
precision lowp sampler2D;
precision lowp sampler3D;

layout( location = 0 ) out vec4 F;

layout(std140) uniform glfx_GLOBAL
{
    mat4 glfx_MVP;
    mat4 glfx_PROJ;
    mat4 glfx_MV;
    vec4 unused;
    vec4 script_data1;
    vec4 script_data2;
    vec4 script_data3;
    vec4 script_data4;
    vec4 script_data5;
    vec4 script_data6;
    vec4 js_is_apply_makeup;
    vec4 script_data7;
    vec4 js_makeup_mul_color;
};

 layout(std140) uniform glfx_OCCLUSION_DATA
 {
    vec4 glfx_OCCLUSION_RECT;
    vec4 glfx_SCREEN;
 };

//#define YVG_NO_LUT_SCALE
//#define YVG_USE_TEXTURE_OFFSET

#define PSI 0.05

#define teethSharpenIntensity 0.2

in vec3 maskColor;
in vec4 var_uv_bg_uv;
in vec2 var_uv;
// in float var_blend_makeup;

uniform sampler2D glfx_BACKGROUND;

uniform sampler2D tex_makeup;
uniform sampler3D glfx_WLUT1, glfx_WLUT2;

vec3 textureLookup(vec3 originalColor, sampler3D lookupTexture)
{
#ifdef YVG_NO_LUT_SCALE
    return texture(lookupTexture, originalColor.xyz).xyz;
#else
    return texture(lookupTexture, originalColor.xyz*(63./64.)+0.5/64.).xyz;
#endif
}

vec3 whitening(vec3 originalColor, float factor, sampler3D lookup) {
    vec3 color = textureLookup(originalColor, lookup);
    return mix(originalColor, color, factor);
}

vec3 sharpen(vec3 originalColor, float factor) {
#ifdef YVG_USE_TEXTURE_OFFSET
    vec3 total = 5.0 * originalColor
    - textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(-1,-1)).xyz
    - textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(-1,+1)).xyz
    - textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(+1,-1)).xyz
    - textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(+1,+1)).xyz;
#else
    float dx = glfx_SCREEN.z;
    float dy = glfx_SCREEN.w;
    
    vec3 total = 5.0 * originalColor
    - texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w-dy)).xyz
    - texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w-dy)).xyz
    - texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w+dy)).xyz
    - texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w+dy)).xyz;
#endif
    vec3 result = mix(originalColor, total, factor);
    return clamp(result, 0.0, 1.0);
}

vec3 softSkin(vec3 originalColor, float factor) {
    vec3 screenColor = originalColor;

#ifdef YVG_USE_TEXTURE_OFFSET
    vec3 nextColor0 = textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(-5, -5)).xyz;
    vec3 nextColor1 = textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(5, -5)).xyz;
    vec3 nextColor2 = textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(-5, 5)).xyz;
    vec3 nextColor3 = textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(5, 5)).xyz;
#else
    // Lookup by non-integer (4.5 vs 5.0) offset leads to better averaging - effectively, 16 pixels vs 4, as we have linear texture filter
    float dx = 4.0 / glfx_SCREEN.x;
    float dy = 4.0 / glfx_SCREEN.y;
    
    vec3 nextColor0 = texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w-dy)).xyz;
    vec3 nextColor1 = texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w-dy)).xyz;
    vec3 nextColor2 = texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w+dy)).xyz;
    vec3 nextColor3 = texture(glfx_BACKGROUND, vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w+dy)).xyz;
#endif
    
    float intensity = screenColor.g;
    vec4 nextIntensity = vec4(nextColor0.g, nextColor1.g, nextColor2.g, nextColor3.g);
    
    //    float lgI0 = log(intensity);
    //    vec4 lg = log(nextIntensity) - lgI0;
    
    //    float lgI0 = log(intensity);
    vec4 lg = nextIntensity - intensity;
    
    
    ////    vec4 weight = exp(lg*lg * (1./(-2.*PSI*PSI)));
    ////    vec4 weight = max(1. - lg*lg * (1./(2.*PSI*PSI)), 0.);
    //    vec4 weight = max(1. - abs(lg * (1./(1.41*PSI))), 0.);
    //    vec4 curr = 0.367 * weight;
    
    vec4 curr = max(0.367 - abs(lg * (0.367*0.6/(1.41*PSI))), 0.);
    
    float summ = 1.0 + curr.x + curr.y + curr.z + curr.w;
    screenColor += (nextColor0 * curr.x + nextColor1 * curr.y + nextColor2 * curr.z + nextColor3 * curr.w);
    screenColor = screenColor * (factor / summ);
    
    screenColor = originalColor*(1.-factor) + screenColor;
    return screenColor;
}

uniform sampler2D tex_softlight;

float softlight_blend_1ch(float a, float b)
{
   return ((1.-2.*b)*a+2.*b)*a;
}

vec3 softlight_blend_1ch(vec3 base, vec3 blend) {
    return vec3(softlight_blend_1ch(base.r,blend.r),softlight_blend_1ch(base.g,blend.g),softlight_blend_1ch(base.b,blend.b));
}

vec3 softlight_blend_1ch(vec3 base, vec3 blend, float opacity) {
    return (softlight_blend_1ch(base, blend) * opacity + base * (1.0 - opacity));
}

uniform sampler2D glfx_BLUR_BACKGROUND;

#if 0
uniform sampler2D bag_selection_tex;
#define saturate(v) clamp(v, 0.0, 1.0)

vec3 rgb_to_hcv(vec3 rgb)
{
    // Based on work by Sam Hocevar and Emil Persson
    vec4 P = (rgb.g < rgb.b) ? vec4(rgb.bg, -1.0, 2.0/3.0) : vec4(rgb.gb, 0.0, -1.0/3.0);
    vec4 Q = (rgb.r < P.x) ? vec4(P.xyw, rgb.r) : vec4(rgb.r, P.yzx);
    float C = Q.x - min(Q.w, Q.y);
    float H = abs((Q.w - Q.y) / max(0.001,6.0 * C) + Q.z);
    return vec3(H, C, Q.x);
}

vec3 hue_to_rgb(float hue)
{
    float R = abs(hue * 6.0 - 3.0) - 1.0;
    float G = 2.0 - abs(hue * 6.0 - 2.0);
    float B = 2.0 - abs(hue * 6.0 - 4.0);
    return saturate(vec3(R,G,B));
}

vec3 hsl_to_rgb(vec3 hsl)
{
    vec3 rgb = hue_to_rgb(hsl.x);
    float C = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
    return (rgb - 0.5) * C + hsl.z;
}

vec3 rgb_to_hsl(vec3 rgb)
{
    vec3 HCV = rgb_to_hcv(rgb);
    float L = HCV.z - HCV.y * 0.5;
    float S = HCV.y / max(0.001, 1.0 - abs(L * 2.0 - 1.0));
    return vec3(HCV.x, S, L);
}

vec3 remove_bags( vec3 res, float RemoveBagsIntensity )
{
    float bag_factor = texture(bag_selection_tex, var_uv_bg_uv.xy).g*RemoveBagsIntensity;

    if (bag_factor > 1./255. && var_uv_bg_uv.y < 0.6)
    {
        vec3 avg = texture(glfx_BLUR_BACKGROUND,var_uv_bg_uv.zw).xyz;

        //hsv = mix(hsv, avg, 1.00);
        vec3 hsl = rgb_to_hsl(res);
        vec3 hsl2 = rgb_to_hsl(avg);
        hsl.b = hsl2.b;
        hsl.g = mix(hsl.g, 0.0, 0.1);
        hsl.b = mix(1.0, hsl.b, 0.925);

        vec3 skin = hsl_to_rgb(hsl);
        res = mix(res, skin, bag_factor);
    }
    return res;
}
#endif

void main()
{
    float softlight_alpha = script_data1.y;
    // float flare_alpha = script_data1.z;
    // float eyesWhiteningCoeff = script_data1.w;
    
    // float eyesSharpenIntensity = script_data2.x;
    // float teethWhiteningCoeff = script_data2.y;
    // float eyebrows_alpha = script_data2.z;
    // float makeup_alpha = script_data2.w;
    
    float skinSoftIntensity = script_data3.x;
    float RemoveBagsIntensity = script_data3.y;
    float rot = script_data3.z;
    
    vec3 res = texture(glfx_BACKGROUND, var_uv_bg_uv.zw).xyz;
    
    //res = remove_bags( res, RemoveBagsIntensity );
    
//#ifdef SOFT_SKIN
    float soft_skin_factor = maskColor.r * skinSoftIntensity;
    //if( soft_skin_factor > 1./255. )
    res = softSkin(res, soft_skin_factor);
//#endif
    
//#if defined(TEETH_WHITENING) || defined(SHARPEN_TEETH)
    if( maskColor.g > 1./255. )
    {
//#ifdef SHARPEN_TEETH
        float sharp_factor = maskColor.g * teethSharpenIntensity;
//        if( sharp_factor > 1./255. )
            res = sharpen(res, sharp_factor);
//#endif
    
//#if defined(TEETH_WHITENING)
        float teeth_factor = maskColor.g;
//        if( teeth_factor > 1./255. )
            res = whitening(res, teeth_factor, glfx_WLUT2);
//#endif
    }
//#endif

//#if defined(EYES_HIGHLIGHT) || defined(SHARPEN_EYES) || defined(EYES_WHITENING)
    if( maskColor.b > 1./255. )
    {
//#ifdef SHARPEN_EYES
        // float e_sharp_factor = maskColor.b * eyesSharpenIntensity;
        //if( e_sharp_factor > 1./255. )
        // res = sharpen(res, e_sharp_factor);
//#endif
        
//#if defined(EYES_WHITENING)
        float e_factor = maskColor.b;
        //if( e_factor > 1./255. )
        res = whitening(res, e_factor, glfx_WLUT1);
//#endif
    }
//#endif

    vec4 soft_light_layer = texture( tex_softlight, var_uv_bg_uv.xy );

    // desaturate soft-light layer if underlying pixel is too dark
    const float soft_cutoff0 = 0.3;
    const float soft_cutoff1 = 0.7;
    //float brightness = dot(res.xyz,vec3(0.299,0.587,0.114));
    float brightness = res.g;
    float light_factor = smoothstep(soft_cutoff0,soft_cutoff1,brightness);
    soft_light_layer.xyz = mix( 
        vec3(dot(soft_light_layer.xyz,vec3(0.299,0.587,0.114))), 
        soft_light_layer.xyz, 
        light_factor );

    vec3 softlight_color = softlight_blend_1ch( res, soft_light_layer.xyz );

    res = mix(res, softlight_color, softlight_alpha*mix(1.,rot,soft_light_layer.w));
    vec2 uv = var_uv_bg_uv.xy;

    
    if (js_is_apply_makeup.x > 0.5) {
        vec4 makeup_color = texture(tex_makeup, var_uv);
        makeup_color *= js_makeup_mul_color;
        res = mix(res, makeup_color.rgb, makeup_color.w); 
    }
    
    F = vec4(res, 1.);
}
