#include <bnb/glsl.frag>

BNB_DECLARE_SAMPLER_2D(0, 1, lips_mask);

BNB_IN(0) vec2 var_uv;

void main()
{
	float m = step(0.5,textureLod(BNB_SAMPLER_2D(lips_mask),var_uv,0.).x);

	if( m < 0.5 )
	{
		int top = 96-1;
		ivec2 p = ivec2(gl_FragCoord.xy/4. + 0.5);
		for( ivec2 d = p; d.y > 0;  )
		{
			--d.y;
			if( texelFetch(BNB_SAMPLER_2D(lips_mask),d,0).x > 0.5 )
			{
				for( ivec2 u = p; u.y < top; )
				{
					++u.y;
					if( texelFetch(BNB_SAMPLER_2D(lips_mask),u,0).x > 0.5 )
					{
						m = 1.;
						break;
					}
				}
			}
		}
	}

	bnb_FragColor = vec4(m,0.,0.,0.);
}
