import * as THREE from "three";
import { loadTexture } from "../graphics/textureLoader";

const detail = 12;

export function createPlanet(radius, rotation, texture) {
  const planetGeometry = new THREE.IcosahedronGeometry(radius, detail);

  const planetMaterial = new THREE.MeshStandardMaterial({
    map: loadTexture(texture),
  });

  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

  planetMesh.rotation.z = THREE.MathUtils.degToRad(rotation);
}
