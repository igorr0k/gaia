import * as THREE from "three";

import starsVert from "./shaders/stars.vert.glsl";
import starsFrag from "./shaders/stars.frag.glsl";

const SCALE_FACTOR = 300;

const getStarsJson = async () => {
  try {
    const response = await fetch(`../stars.json`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(`an error occured: ${error.message}`);
  }
};

const data = await getStarsJson();
const dataString = JSON.stringify(data);
const starData = JSON.parse(dataString);

const radians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const convertToCartesian = (ra, dec, par) => {
  // calc distance + convert parallax from milliarcseconds to arcseconds
  const distance = 1000 / par;

  const x =
    distance * Math.cos(radians(dec)) * Math.cos(radians(ra)) * SCALE_FACTOR;
  const y =
    distance * Math.cos(radians(dec)) * Math.sin(radians(ra)) * SCALE_FACTOR;
  const z = distance * Math.sin(radians(dec)) * SCALE_FACTOR;

  return [x, y, z];
};

const starPositions = new Float32Array(starData.length * 3);

starData.forEach((star, i) => {
  if (!star.parallax) {
    return;
  }
  starPositions.set(
    convertToCartesian(star.ra, star.dec, star.parallax),
    i * 3,
  );
});

const starGeometry = new THREE.BufferGeometry();

starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starPositions, 3),
);

const starMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color(0xffffff) },
    uOpacity: { value: 0.8 },
    uSize: { value: 75 },
    uScale: { value: window.innerHeight / 2 },
    uPixelRatio: {
      value: window.devicePixelRatio,
    },
  },
  vertexShader: starsVert,
  fragmentShader: starsFrag,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

export const starField = new THREE.Points(starGeometry, starMaterial);
