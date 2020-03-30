#version 300 es

precision highp float;

layout(std140) uniform glfx_GLOBAL
{
	mat4 glfx_MVP;
	mat4 glfx_PROJ;
	mat4 glfx_MV;
	vec4 glfx_QUAT;

	vec4 js_face;
	
	vec4 js_color;
	vec4 params;
	vec4 nn_params;
	
};

layout(std140) uniform glfx_BASIS_DATA
{
	vec4 unused;
	vec4 glfx_SCREEN;
	vec4 glfx_BG_MASK_T[2];
	vec4 glfx_HAIR_MASK_T[2];
	vec4 glfx_LIPS_MASK_T[2];
	vec4 glfx_L_EYE_MASK_T[2];
	vec4 glfx_R_EYE_MASK_T[2];
	vec4 glfx_SKIN_MASK_T[2];
	vec4 glfx_OCCLUSION_MASK_T[2];
};

in vec4 var_uv;

layout( location = 0 ) out vec4 F;

uniform sampler2D glfx_BACKGROUND;
uniform sampler2D glfx_LIPS_MASK;
uniform sampler2D glfx_LIPS_SHINE_MASK;

const float eps = 0.0000001;

vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs( mod( c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0 ) - 3.0 ) - 1.0, 0.0, 1.0 );
	return c.z * mix( vec3(1.0), rgb, c.y );
}

vec3 rgb2hsv( in vec3 c )
{
    vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix( vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z < c.y) ? 1.0 : 0.0 );
    vec4 q = mix( vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x < c.x) ? 1.0 : 0.0 );
    float d = q.x - min( q.w, q.y );
    return vec3(abs( q.z + (q.w - q.y) / (6.0 * d + eps) ), d / (q.x+eps), q.x );
}

void main()
{
	vec4 maskColor = texture( glfx_LIPS_MASK, var_uv.zw );
	float maskAlpha = maskColor[int(glfx_LIPS_MASK_T[0].w)] * js_color.w;

	vec3 bg = texture( glfx_BACKGROUND, var_uv.xy ).xyz;

	// Lipstick
	float sCoef = params.x;;

	vec3 js_color_hsv = rgb2hsv( js_color.rgb );
	vec3 bg_color_hsv = rgb2hsv( bg );

	float color_hsv_s = js_color_hsv.g * sCoef;
	if ( sCoef > 1. ) {
		color_hsv_s = js_color_hsv.g + (1. - js_color_hsv.g) * (sCoef - 1.);
	}

	float vCoef = params.y;
	float sCoef1 = params.z;
	float bCoef = params.w;
	float a = 20.;
	float b = .75;

	vec3 color_lipstick = vec3(
		js_color_hsv.r,
		color_hsv_s,
		bg_color_hsv.b);

	vec3 color_lipstick_b = color_lipstick * vec3(1., 1., bCoef);
	vec3 color = maskAlpha * hsv2rgb( color_lipstick_b ) + (1. - maskAlpha) * bg;

	// Shine
	vec4 shineColor = texture( glfx_LIPS_SHINE_MASK, var_uv.zw );
	float shineAlpha = shineColor[int(glfx_LIPS_MASK_T[0].w)];

	float v_min = nn_params.x;
	float v_max = nn_params.y;

	float x = (color_lipstick.z - v_min) / (v_max - v_min);
	float y = 1. / (1. + exp( -(x - b) * a * (1. + x) ));

	float v1 = color_lipstick.z * (1. - maskAlpha) + color_lipstick.z * maskAlpha * bCoef;
	float v2 = color_lipstick.z + (1. - color_lipstick.z) * vCoef * y;
	float v3 = v1 * (1. - y) + v2 * y;

	vec3 color_shine = vec3(
		color_lipstick.x,
		color_lipstick.y * (1. - sCoef1 * y),
		v3);

	color = shineAlpha * hsv2rgb( color_shine ) + (1. - shineAlpha) * color;

	if(js_face.x == 0.) discard;

	F = vec4(color, 1.0);
}
