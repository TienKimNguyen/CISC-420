#version 300 es

precision mediump float;

in vec3 out_color;

out vec4 FragColor;

void main() {
    FragColor = vec4(out_color, 1.0);
}
