#version 300 es
#define GLSLIFY 1

layout (location = 0) in vec3 attrib_pos;
out vec2 v_tex_coord;

void main()
{
    vec2 v = attrib_pos.xy;
    gl_Position = vec4(v, 1.0, 1.0);
    v_tex_coord = v * 0.5 + 0.5;
}
