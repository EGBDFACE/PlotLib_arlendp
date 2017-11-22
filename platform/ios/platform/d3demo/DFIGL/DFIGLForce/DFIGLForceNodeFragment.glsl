#version 300 es

in lowp vec3 nodeCenter;
in lowp vec2 curPos;
in lowp vec2 type;

out lowp vec4 color;

uniform lowp vec2 radius;
//uniform lowp vec2 screenSize;

void main() {
    // todo 颜色渐变
    if (type.x == 0.0f) {
        lowp float dx = curPos.x - nodeCenter.x;
        lowp float dy = curPos.y - nodeCenter.y;
        lowp float distance = sqrt(dx * dx + dy * dy);
        lowp float colorType = nodeCenter.z;
        // todo 从外面传进来颜色值
        if (distance < radius.x) {
            //color = vec4(51.0f / 255.0f, 255.0f / 255.0f, 153.0f / 255.0f, 0.5f);
            if (colorType == 1.0f) {
                color = vec4(255.0f / 255.0f, 177.0f / 255.0f, 14.0f / 255.0f, 1.0f);
            } else if (colorType == 2.0f) {
                color = vec4(174.0f / 255.0f, 199.0f / 255.0f, 232.0f / 255.0f, 1.0f);
            } else if (colorType == 3.0f) {
                color = vec4(31.0f / 255.0f, 119.0f / 255.0f, 180.0f / 255.0f, 1.0f);
            } else if (colorType == 4.0f) {
                color = vec4(152.0f / 255.0f, 223.0f / 255.0f, 138.0f / 255.0f, 1.0f);
            } else if (colorType == 5.0f) {
                color = vec4(255.0f / 255.0f, 187.0f / 255.0f, 120.0f / 255.0f, 1.0f);
            } else if (colorType == 6.0f) {
                color = vec4(44.0f / 255.0f, 160.0f / 255.0f, 44.0f / 255.0f, 1.0f);
            } else if (colorType == 7.0f) {
                color = vec4(214.0f / 255.0f, 39.0f / 255.0f, 40.0f / 255.0f, 1.0f);
            } else if (colorType == 8.0f) {
                color = vec4(148.0f / 255.0f, 103.0f / 255.0f, 189.0f / 255.0f, 1.0f);
            } else if (colorType == 9.0f) {
                color = vec4(140.0f / 255.0f, 86.0f / 255.0f, 75.0f / 255.0f, 1.0f);
            } else if (colorType == 10.0f) {
                color = vec4(255.0f / 255.0f, 152.0f / 255.0f, 150.0f / 255.0f, 1.0f);
            } else {
                color = vec4(51.0f / 255.0f, 255.0f / 255.0f, 153.0f / 255.0f, 1.0f);
            }
        } else {
            color = vec4(1.0f, 1.0f, 1.0f, 0.0f);
        }
    } else {
        color = vec4(9.0f / 255.0f, 9.0f / 255.0f, 9.0f / 255.0f, 1.0f);
    }

}