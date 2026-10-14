import * as THREE from "three";
import { scene } from "../graphics/scene";

import { planetData } from "./planetData";
import { loadTexture } from "../graphics/textureLoader";

import earthVert from "../graphics/shaders/earth.vert.glsl";
import earthFrag from "../graphics/shaders/earth.frag.glsl";

const sunlightIntesity = 1;

export default function createSolarSystem() {
  // EARTH
  const earthGeometry = new THREE.IcosahedronGeometry(1, 12);
  const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
      sunDirection: { value: new THREE.Vector3(-2, 0.5, 1.5) },
      earthNightTexture: { value: loadTexture("/8k_earth_nightmap.jpg") },
      earthTexture: { value: loadTexture("/8k_earth_daymap.jpg") },
    },
    vertexShader: earthVert,
    fragmentShader: earthFrag,
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = THREE.MathUtils.degToRad(23.44);
  earthGroup.add(earthMesh);
  scene.add(earthGroup);

  // SUN
  const sunGeometry = new THREE.SphereGeometry(15, 32, 16);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: loadTexture("/8k_sun.jpg"),
  });
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

  scene.add(sunMesh);
  sunMesh.position.set(400, 3, 0);

  const sunLight = new THREE.PointLight(0xffffff, sunlightIntesity, 0, 0);

  sunLight.position.set(0, 0, 0);

  scene.add(sunLight);

  function update(time) {
    earthMesh.rotation.y = time / 10000;
    earthMaterial.uniforms.sunDirection.value = sunMesh.position
      .clone()
      .normalize();
  }

  return { update };
}
