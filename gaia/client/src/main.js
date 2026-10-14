import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { starField } from "./stars";

import { renderer } from "./graphics/renderer";
import { scene } from "./graphics/scene";
import { loadTexture } from "./graphics/textureLoader";

import { FOV, ASPECT_RATIO, NEAR, FAR } from "./constants";
import createSolarSystem from "./solar-system/createSolarSystem";

const canvas = document.querySelector("#c");
const ui = document.querySelector("#ui");
const para = document.createElement("p");
const txt = document.createTextNode("Injected Text...");
para.appendChild(txt);
ui.appendChild(para);

// Pass scale and pixel ratio on resize to star unfiroms
function updateStarUniforms() {
  starUniforms.uScale.value = window.innerHeight / 2;
  starUniforms.uPixelRatio.value = renderer.getPixelRatio();
}

// Resize window listener and CRUCIALLY update devicePixelRatio on zoom
// Higher zoom != lower texture pixel ratio anymore
window.addEventListener("resize", () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  updateStarUniforms();
});

// CAMERA CONTROLS
const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR);
camera.position.z = 5;
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();
controls.minDistance = 1.4;

const solarSystem = createSolarSystem();

// STARFIELD
scene.add(starField);
const starUniforms = starField.material.uniforms;
updateStarUniforms();

// Anything you want to change or move while the app is running add it here
function animate(time) {
  solarSystem.update(time);
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
