#version 300 es

precision highp float;

in vec3 vertex_position;
in vec3 vertex_color;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 out_color;

void main() {
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(vertex_position, 1.0);
    out_color = vertex_color;
}
