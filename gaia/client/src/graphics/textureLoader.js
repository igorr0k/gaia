import * as THREE from "three";

import { renderer } from "./renderer";
import { loadingManager } from "./loadingManager";

const textureLoader = new THREE.TextureLoader(loadingManager);
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
export function loadTexture(path) {
  const texture = textureLoader.load(path);
  texture.anisotropy = maxAnisotropy;
  return texture;
}
