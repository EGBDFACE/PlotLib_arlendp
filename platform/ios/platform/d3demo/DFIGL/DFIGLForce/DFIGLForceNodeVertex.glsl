#version 300 es

layout (location = 0) in vec3 position;

out lowp vec3 nodeCenter;
out lowp vec2 curPos;
out lowp vec2 type;

uniform float scale;
uniform mat4 projection;
uniform vec3 centers[100];

void main() {
    if (position.z == 0.0f) {
        vec4 temp = vec4((position.xy + centers[gl_InstanceID].xy) * scale, position.z, 1.0f);
        gl_Position = projection * temp;
        nodeCenter = vec3(centers[gl_InstanceID].xy * scale, centers[gl_InstanceID].z);
        curPos = temp.xy;
        type = vec2(0.0f, 0.0f);
    } else {
        gl_Position = projection * vec4(scale * position.xy, -1.0f, 1.0f);
        type = vec2(1.0f, 0.0f);
    }

}