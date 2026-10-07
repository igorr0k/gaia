import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const API_KEY = import.meta.env.VITE_NASA_API_KEY;
import fetcher from "./fetch";
import { starField } from "./stars";
import earthVert from "./shaders/earth.vert.glsl";
import earthFrag from "./shaders/earth.frag.glsl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const loadingOverlay = document.querySelector("#loading-overlay");

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
  loadingOverlay.classList.remove("opacity-100");
  loadingOverlay.classList.add("opacity-0");
};

loadingOverlay.addEventListener("transitionend", () => {
  loadingOverlay.classList.add("hidden");
});

// CAMERA
const FOV = 75;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const NEAR = 0.1;
const FAR = 40000;

const canvas = document.querySelector("#c");

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// TODO: MOVE TO MODULE
const data = await fetcher(
  `https://api.nasa.gov/neo/rest/v1/neo/browse?page=1&size=20&api_key=${API_KEY}`,
);
const datastring = JSON.stringify(data);
const dataJSON = JSON.parse(datastring);
console.log(dataJSON);

console.log(dataJSON["near_earth_objects"][0]);

const ui = document.querySelector("#ui");
const para = document.createElement("p");
const txt = document.createTextNode("THIS IS SOME TEXT");
para.appendChild(txt);
ui.appendChild(para);

// Pass scale and pixel ratio on resize to star unfiroms
function updateStarUniforms() {
  starUniforms.uScale.value = window.innerHeight / 2;
  starUniforms.uPixelRatio.value = renderer.getPixelRatio();
}

// Resize window listener and CRUCIALLY update devicePixelRatio on zoom
// Higher zoom != lower texture pixel ratio anymore
const scene = new THREE.Scene();
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

// OBJECTS
const textureLoader = new THREE.TextureLoader(loadingManager);
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
function loadTexture(path) {
  const texture = textureLoader.load(path);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

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

// VENUS
const venusGeometry = new THREE.IcosahedronGeometry(0, 12);
const venusMaterial = new THREE.MeshBasicMaterial();

// STARFIELD
scene.add(starField);
const starUniforms = starField.material.uniforms;
updateStarUniforms();

// Anything you want to change or move while the app is running add it here
function animate(time) {
  earthMesh.rotation.y = time / 10000;
  earthMaterial.uniforms.sunDirection.value = sunMesh.position
    .clone()
    .normalize();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
