import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Sky } from "three/addons/objects/Sky.js";

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
const FAR = 1000;

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
const geometry = new THREE.IcosahedronGeometry(1, 12);

const loader = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial({
  map: loader.load("/8k_earth_daymap.jpg"),
});
const earthMesh = new THREE.Mesh(geometry, material);
// Reflect earth's 23.4 degree axial tilt
earthMesh.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthMesh);

// LIGHTS
const skyColor = 0xb1e1ff; // light blue
const groundColor = 0xb97a20; // brownish orange
const intensity = 1;

// const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
// scene.add(hemiLight);

// Anything you want to change or move while
// the app is running add it here
function animate(time) {
  earthMesh.rotation.y = time / 10000;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
