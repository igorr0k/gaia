import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

import fetcher from "./fetch";

import { starField } from "./stars";

import earthVert from "./shaders/earth.vert.glsl";
import earthFrag from "./shaders/earth.frag.glsl";

// RESIZE WINDOW AND CRUCIALLY UPDATE devicePixelRatio on zoom
// Higher zoom != lower texture pixel ratio
const scene = new THREE.Scene();
window.addEventListener("resize", () => {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  updateStarUniforms();
});

const canvas = document.querySelector("#c");

const data = await fetcher(
  `https://api.nasa.gov/neo/rest/v1/neo/browse?page=1&size=20&api_key=${API_KEY}`,
);

const datastring = JSON.stringify(data);
const dataJSON = JSON.parse(datastring);
console.log(dataJSON);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CAMERA
const FOV = 75;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const NEAR = 0.1;
const FAR = 40000;

const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR);
camera.position.z = 5;

// CAMERA CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();
controls.minDistance = 1.4;

// OUTER SPACE / SKY
const outerSpace = new Sky();
outerSpace.scale.setScalar(10000);
scene.add(outerSpace);

// OBJECTS
const loader = new THREE.TextureLoader();
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

function loadTexture(path) {
  const texture = loader.load(path);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

const earthGeometry = new THREE.IcosahedronGeometry(1, 12);

// Custom shader material
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

const sunGeometry = new THREE.SphereGeometry(15, 32, 16);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("/8k_sun.jpg"),
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

scene.add(sunMesh);

sunMesh.position.set(200, 3, 0);

// Reflect earth's 23.4 degree axial tilt
// earthMaterial.rotation.z = (-23.4 * Math.PI) / 180;
const earthGroup = new THREE.Group();
earthGroup.rotation.z = THREE.MathUtils.degToRad(23.44);
earthGroup.add(earthMesh);
scene.add(earthGroup);

// LIGHTS
// const sunLight = new THREE.DirectionalLight(0xffffff);
// sunLight.position.set(-2, 0.5, 1.5);
// scene.add(sunLight);

scene.add(starField);

const starUniforms = starField.material.uniforms;

function updateStarUniforms() {
  starUniforms.uScale.value = window.innerHeight / 2;
  starUniforms.uPixelRatio.value = renderer.getPixelRatio();
}

updateStarUniforms();
// Anything you want to change or move while
// the app is running add it here
function animate(time) {
  earthMesh.rotation.y = time / 10000;

  earthMaterial.uniforms.sunDirection.value = sunMesh.position
    .clone()
    .normalize();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
