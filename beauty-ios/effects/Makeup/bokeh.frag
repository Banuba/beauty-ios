#version 300 es

precision highp float;
#define GLSLIFY 1

in vec2 var_uv;
flat in vec2 ps;

layout( location = 0 ) out vec4 F;

uniform sampler2D bg_masked;

void main()
{
	const float hdr_curve = 8.;
	const int samples = 16;
	const int angle_samples = 3*samples;
	const float angle_inc = 6.28318530717958647693/float(angle_samples);
	const float dcos = cos(angle_inc);
	const float dsin = sin(angle_inc);
	const int offset_samples = 1*samples;

	float alpha = texture(bg_masked,var_uv).w;

	vec3 col = vec3(0.);
	float accum = 0.;
	vec2 r = vec2(1.,0.);

	for( int a = 0; a < angle_samples; ++a ) 
	{
		vec2 rps = ps*r;
		r = vec2( r.x*dcos - r.y*dsin, r.x*dsin + r.y*dcos );

		for( int o = 1; o < offset_samples; ++o ) 
		{
			vec4 s = texture(bg_masked,var_uv+rps*float(o));
			s.w *= float(o*o);
			col += pow( s.xyz, vec3(hdr_curve) )*s.w;
			accum += s.w;
		}
	}
	
	//if( accum != 0. )
	col /= accum;
	F = vec4( pow( col, vec3(1./hdr_curve) ), alpha );
}
