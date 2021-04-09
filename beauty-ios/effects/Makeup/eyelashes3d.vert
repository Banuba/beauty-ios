#version 300 es
#define GLSLIFY 1

#define MORPH_MULTIPLIER 1.3

//#define GLFX_1_BONE
#define GLFX_TBN
#define GLFX_LIGHTING

layout( location = 0 ) in vec3 attrib_pos;
#ifdef GLFX_LIGHTING
layout( location = 1 ) in vec3 attrib_n;
#ifdef GLFX_TBN
layout( location = 2 ) in vec4 attrib_t;
#endif
#endif
layout( location = 3 ) in vec2 attrib_uv;
layout( location = 4 ) in uvec4 attrib_bones;
#ifndef GLFX_1_BONE
layout( location = 5 ) in vec4 attrib_weights;
#endif

layout(std140) uniform glfx_GLOBAL
{
	highp mat4 glfx_MVP;
	highp mat4 glfx_PROJ;
	highp mat4 glfx_MV;
	highp vec4 glfx_QUAT;

	// retouch
	highp vec4 js_softlight; // y - softlight strength, z - eyeflare strength
  highp vec4 js_skinsoftening_removebags_rotation;
	highp vec4 js_is_apply_makeup; // x - makeup, y - softlight, z - eyeflare
	highp vec4 js_makeup_type;

	// selective makeup
	highp vec4 js_blushes_color;
	highp vec4 js_contour_color;
	highp vec4 js_eyeliner_color;
	highp vec4 js_eyeshadow_color;
	highp vec4 js_lashes_color;
	highp vec4 js_lashes3d_color;
	highp vec4 js_brows_color;
	highp vec4 js_highlighter_color;

	// common variable
	// TODO: but actually has effect only for eyes coloring
	highp vec4 js_is_face_tracked;

	// LUT filter
	highp vec4 js_slider_pos_alpha;

	// background texture
	highp vec4 js_bg_rotation;
	highp vec4 js_bg_scale;
	highp vec4 js_platform_data; //  "0 0 0 0" - Android, "1 0 0 0" - iOS

	// skin
	highp vec4 js_skin_color;

	// eyes coloring
	highp vec4 js_eyes_color;

	// hair coloring (monotone & gradient)
	highp vec4 js_hair_colors[8];
	highp vec4 js_hair_colors_size;
	// hair strands coloring
	highp vec4 js_strand_colors[5];

	// mat & shiny lips color
	highp vec4 js_lips_color;
	// mat lips brightness & contrast
	highp vec4 js_lips_brightness_contrast;
	// lips shine parameters: color saturation, brightness (intensity), saturation (color bleeding),  darkness (more is less)
	highp vec4 js_lips_shine;
	// lips glitter parameters noiseness (width), highlights, grain (pixely)
	highp vec4 js_lips_glitter;

	// the value must declared at the end - this is SDK convention
	// shiny lips nn-specific params

	highp vec4 lips_nn_params; // no `js_` prefix cuz the value is not set by JS but by SDK
};

uniform sampler2D glfx_BONES;

uniform sampler2D glfx_MORPH;
vec2 glfx_morph_coord( vec3 v )
{
    const float half_angle = radians(104.);
    const float y0 = -110.;
    const float y1 = 112.;
    float x = atan( v.x, v.z )/half_angle;
    float y = ((v.y-y0)/(y1-y0))*2. - 1.;
    return vec2(x,y);
}

out vec2 var_uv;
#ifdef GLFX_LIGHTING
#ifdef GLFX_TBN
out vec3 var_t;
out vec3 var_b;
#endif
out vec3 var_n;
out vec3 var_v;
#endif

mat4 get_bone( uint bone_idx )
{
    int b = int(bone_idx)*3;
    mat4 m = transpose( mat4(
        texelFetch( glfx_BONES, ivec2(b,0), 0 ),
        texelFetch( glfx_BONES, ivec2(b+1,0), 0 ),
        texelFetch( glfx_BONES, ivec2(b+2,0), 0 ),
        vec4(0.,0.,0.,1.) ) );

    vec2 morph_uv = glfx_morph_coord(m[3].xyz)*0.5 + 0.5;
    vec3 translation = texture( glfx_MORPH, morph_uv ).xyz;
    m[3].xyz += translation*MORPH_MULTIPLIER;

    mat4 ibp = transpose( mat4(
        texelFetch( glfx_BONES, ivec2(b,1), 0 ),
        texelFetch( glfx_BONES, ivec2(b+1,1), 0 ),
        texelFetch( glfx_BONES, ivec2(b+2,1), 0 ),
        vec4(0.,0.,0.,1.) ) );

    return m*ibp;
}

mat4 get_transform()
{
    mat4 m = get_bone( attrib_bones[0] );
#ifndef GLFX_1_BONE
    if( attrib_weights[1] > 0. )
    {
        m = m*attrib_weights[0] + get_bone( attrib_bones[1] )*attrib_weights[1];
        if( attrib_weights[2] > 0. )
        {
            m += get_bone( attrib_bones[2] )*attrib_weights[2];
            if( attrib_weights[3] > 0. )
                m += get_bone( attrib_bones[3] )*attrib_weights[3];
        }
    }
#endif
    return m;
}

void main()
{
    mat4 m = get_transform();
    vec3 vpos = attrib_pos;

    vpos = (m*vec4(vpos,1.)).xyz;

    gl_Position = glfx_MVP * vec4(vpos,1.);

    var_uv = attrib_uv;

#ifdef GLFX_LIGHTING
    var_n = mat3(glfx_MV)*(mat3(m)*attrib_n);
#ifdef GLFX_TBN
    var_t = mat3(glfx_MV)*(mat3(m)*attrib_t.xyz);
    var_b = attrib_t.w*cross( var_n, var_t );
#endif
    var_v = (glfx_MV*vec4(vpos,1.)).xyz;
#endif
}
