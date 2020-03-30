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
};

in vec4 var_uv;


uniform sampler2D tex_highlight, tex_makeup, tex_eyebrows;

void main()
{
    // float softlight_alpha = script_data1.y;
    float flare_alpha = script_data1.z;
    // float eyesWhiteningCoeff = script_data1.w;
    
    // float eyesSharpenIntensity = script_data2.x;
    // float teethWhiteningCoeff = script_data2.y;
    float eyebrows_alpha = script_data2.z;
    float makeup_alpha = script_data2.w;
    
    // float skinSoftIntensity = script_data3.x;
    // float RemoveBagsIntensity = script_data3.y;
    // float rot = script_data3.z;
    
    vec3 highlight = texture( tex_highlight, var_uv.xy ).xyz;

    vec2 uv_half = var_uv.zw;

    vec3 makeup_rgb = vec3(32./255.,21./255.,20./255.);
    float makeup = texture( tex_makeup, uv_half ).x;
    makeup *= makeup_alpha;

    float eyebrows = texture( tex_eyebrows, uv_half ).x;
    eyebrows *= eyebrows_alpha;

    float im = 1. - makeup;
    float ie = 1. - eyebrows;

    F = vec4(
        highlight*(flare_alpha*ie*im)
        + makeup_rgb*makeup,
        1.-im*ie);
}
