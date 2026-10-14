precision highp float;

// varyings are prefixed with v
// they pass through to the fragment shader automatically
// both of these provided by theejs
varying vec2 vUv;
varying vec3 vNormal;


void main()
{
    // Convert the normal to world space so lighting is computed against the
       // (untilted) sun direction, no matter how the mesh is tilted or spun.
       // Safe because the mesh only uses uniform scale.
       vec3 worldNormal = normalize(mat3(modelMatrix) * normal);

       // projectionMatrix, modelViewMatrix, modelMatrix, position, normal and uv
       // are all provided automatically by three.js
       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
       vUv = uv;
       vNormal = worldNormal;

}
