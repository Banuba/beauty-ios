#include <bnb/glsl.frag>

BNB_DECLARE_SAMPLER_2D(0, 1, liner0);

float gauss( float x, float y, float sigma_mult )
{
	return exp( -sigma_mult*(x*x + y*y) );
}

float blur1( BNB_DECLARE_SAMPLER_2D_ARGUMENT(img), ivec2 iuv, float r )
{
	ivec2 isz1 = textureSize(BNB_SAMPLER_2D(img),0) - 1;
	float c = texelFetch( BNB_SAMPLER_2D(img), iuv, 0 ).x;

	float sigma = (r*2.+1.)/4.;
	float sigma_mult = 1./(2.*sigma*sigma);

	float blurred = c;
	float mult_sum = 1.;
	int ir = int(r)+1;
	for( int y = 0; y <= ir; ++y )
	{
		for( int x = 1; x <= ir; ++x )
		{
			float mult = gauss(float(x),float(y),sigma_mult);
			mult_sum += mult*4.;
			blurred += mult*(
				texelFetch( BNB_SAMPLER_2D(img), clamp( iuv + ivec2( x, y), ivec2(0), isz1 ), 0 ).x + 
				texelFetch( BNB_SAMPLER_2D(img), clamp( iuv + ivec2(-y, x), ivec2(0), isz1 ), 0 ).x +
				texelFetch( BNB_SAMPLER_2D(img), clamp( iuv + ivec2(-x,-y), ivec2(0), isz1 ), 0 ).x +
				texelFetch( BNB_SAMPLER_2D(img), clamp( iuv + ivec2( y,-x), ivec2(0), isz1 ), 0 ).x);
		}
	}
	blurred *= 1./mult_sum;
	blurred = clamp( blurred, 0., 1. );
	return blurred;
}

void main()
{
	float m = blur1( BNB_PASS_SAMPLER_ARGUMENT(liner0), ivec2(gl_FragCoord.xy), 3.5 );
	
	if( m > 0.99 || m < 0.01 ) 
		m = 0.;
	else
		m = 1.;
	
	bnb_FragColor = vec4(m,0.,0.,0.);
}
