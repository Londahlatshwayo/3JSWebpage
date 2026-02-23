import * as THREE from 'three';
import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const width = window.innerWidth;
const height = window.innerHeight;
const scene = new THREE.Scene();
scene.background = THREE.Color(0xff99);
const camera = new THREE. PerspectiveCamera (50, width / height, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);