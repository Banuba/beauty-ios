#version 300 es

precision highp float;
#define GLSLIFY 1

layout(location = 0) out vec4 F;
in vec2 v_tex_coord;

uniform sampler2D v_gblur;

void main() 
{
    vec2 uv = v_tex_coord;
    vec2 texture_size = vec2(textureSize(v_gblur, 0));
    vec2 d = 1.0 / texture_size;

    const int kernel_size = 14;
    const float norm_factor = 16.8769;
    const float center_weight = 1.0;
    const float gauss_weights[kernel_size] = float[kernel_size](
        0.989848, 0.960005, 0.912254, 0.849366, 0.774837, 
        0.692569, 0.606531, 0.52045, 0.437565, 0.360448, 
        0.290924, 0.230066, 0.178264, 0.135335);

    vec3 result = center_weight * texture(v_gblur, uv).rgb;

    for (int i = 1; i <= kernel_size; ++i) {
        result += gauss_weights[i - 1] * texture(v_gblur, uv + vec2( float(i) * d.x, 0.0)).rgb;
        result += gauss_weights[i - 1] * texture(v_gblur, uv + vec2(-float(i) * d.x, 0.0)).rgb;
    }

    result /= norm_factor;

    F = vec4(result, 1.0);
    // F = texture(v_gblur, uv);
}
