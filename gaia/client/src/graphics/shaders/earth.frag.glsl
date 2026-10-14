uniform sampler2D earthNightTexture;
uniform sampler2D earthTexture;

uniform vec3 sunDirection;
varying vec2 vUv;
varying vec3 vNormal;


void main() {
    // Calculate dot product of surface normal and sun direction
    float blendFactor = dot(vNormal, sunDirection);

    vec4 earthDayColor = texture2D(earthTexture, vUv);
    vec4 earthNightColor = texture2D(earthNightTexture, vUv);

    vec4 earthBlendColor = mix(earthNightColor, earthDayColor, smoothstep(-0.1, 0.1,blendFactor));







    // gl_FragColor = texture2D(earthBlendColor, vUv);
    //
    gl_FragColor = earthBlendColor;
}
