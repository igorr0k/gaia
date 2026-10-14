uniform vec3 uColor;
uniform float uOpacity;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));

    if (dist > 0.5) discard;

    // 0 at center, 1 at the edge of the point
     float d = dist * 2.0;

     // bright, tight core
     float core = 1.0 - smoothstep(0.0, 0.15, d);

     // wide, soft halo that reaches zero at the edge
     float halo = pow(1.0 - d, 3.0);

     float alpha = clamp(core + halo * 0.6, 0.0, 1.0);

     if (alpha < 0.01) discard;

    gl_FragColor = vec4(uColor, alpha * uOpacity);
}
