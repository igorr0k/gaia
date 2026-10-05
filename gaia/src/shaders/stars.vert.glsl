uniform float uSize;
uniform float uScale;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;

    // size attenuation. Futher away is smaller
    gl_PointSize = uSize * (uScale / -mvPosition.z);
}
