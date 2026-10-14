import * as THREE from "three";

const loadingOverlay = document.querySelector("#loading-overlay");

export const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
  loadingOverlay.classList.remove("opacity-100");
  loadingOverlay.classList.add("opacity-0");
};

loadingOverlay.addEventListener("transitionend", () => {
  loadingOverlay.classList.add("hidden");
});
