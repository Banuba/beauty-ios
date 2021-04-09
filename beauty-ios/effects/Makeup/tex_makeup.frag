#version 300 es

precision mediump float;
#define GLSLIFY 1

in vec2 var_uv;
in vec2 var_bg_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D tex0, tex1, tex2, tex3, tex4, tex5, tex6, tex7;

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

void main()
{
	vec4 t;
	vec4 c = vec4(0.,0.,0.,0.);

	if(js_blushes_color.a > 0.01){
		t = texture( tex0, var_uv );
		t.rgb += js_blushes_color.rgb;
		t.w *= js_blushes_color.a;
		t.xyz *= t.w;
		c = c*(1.-t.w) + t;
	};

	if(js_contour_color.a > 0.01){
		t = texture( tex1, var_uv ); 
		t.rgb += js_contour_color.rgb;
		t.w *= js_contour_color.a;
		t.xyz *= t.w;
		c = c*(1.-t.w) + t;
	};

	if(js_eyeliner_color.a > 0.01){
		t = texture( tex2, var_uv ); 
		t.rgb += js_eyeliner_color.rgb;
		t.w *= js_eyeliner_color.a;
		t.xyz *= t.w;
		c = c*(1.-t.w) + t;
	};

	if(js_eyeshadow_color.a > 0.01){
		t = texture( tex3, var_uv );
		t.rgb += js_eyeshadow_color.rgb;
		t.w *= js_eyeshadow_color.a;
		t.xyz *= t.w;
		c = c*(1.-t.w) + t;
	};

	if(js_lashes_color.a > 0.01){
		t = texture( tex4, var_uv ); 
		t.rgb += js_lashes_color.rgb;
		t.w *= js_lashes_color.a;
		t.xyz *= t.w;
		c = c*(1.-t.w) + t;
	}

	if(js_brows_color.a > 0.01){
		t = texture( tex5, var_uv ); 
		t.rgb += js_brows_color.rgb;
		t.w *= js_brows_color.a;
		t.xyz *= t.w;
		c = c*(1.-t.w) + t;
	}

	if(js_highlighter_color.a > 0.01){
		t = texture( tex6, var_uv ); 
		t.rgb += js_highlighter_color.rgb;
		t.w *= js_highlighter_color.a;
		t.xyz *= t.w;
		c = c*(1.-t.w) + t;
	}

  /* uncomment if 7-th texture is added */
	// if(js_make_weights[7][3] > 0.01){
	// 	t = texture( tex7, var_uv ); 
	// 	t.rgb += js_make_weights[7].rgb;
	// 	t.w *= js_make_weights[7][3];
	// 	t.xyz *= t.w;
	// 	c = c*(1.-t.w) + t;
	// }

	F = c;
}
