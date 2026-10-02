import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";

import { starField } from "./stars";

import earthVert from "./shaders/earth.vert.glsl";
import earthFrag from "./shaders/earth.frag.glsl";

const scene = new THREE.Scene();

const canvas = document.querySelector("#c");

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
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

// OUTER SPACE / SKY
const outerSpace = new Sky();
outerSpace.scale.setScalar(10000);
scene.add(outerSpace);

// OBJECTS
const loader = new THREE.TextureLoader();

const earthGeometry = new THREE.IcosahedronGeometry(1, 12);

// Custom shader material
const earthMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sunDirection: { value: new THREE.Vector3(-2, 0.5, 1.5) },
    earthNightTexture: { value: loader.load("/8k_earth_nightmap.jpg") },
    earthTexture: { value: loader.load("/8k_earth_daymap.jpg") },
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
