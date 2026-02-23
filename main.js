import * as THREE from "three";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

/////////////////////////////////////////////RENDERER/////////////////////////////////////////////
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/////////////////////////////////////////////RENDERER/////////////////////////////////////////////



/////////////////////////////////////////////CAMERA/////////////////////////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 1, 10);
/////////////////////////////////////////////CAMERA/////////////////////////////////////////////


/////////////////////////////////////////////GROUNDPLANE/////////////////////////////////////////////
const geometry = new THREE.PlaneGeometry(70, 100, 100, 100);
geometry.rotateX(-Math.PI/2);
const material = new THREE.MeshPhysicalMaterial({ color: 0x555555, side: THREE.DoubleSide});
const groundMesh = new THREE.Mesh(geometry, material);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);
/////////////////////////////////////////////GROUNDPLANE/////////////////////////////////////////////


/////////////////////////////////////////////BACKPLANE/////////////////////////////////////////////

/////////////////////////////////////////////BACKPLANE/////////////////////////////////////////////


/////////////////////////////////////////////LIGHTS/////////////////////////////////////////////
const ambientLight = new THREE.AmbientLight(0xFFFFFF, .02);
ambientLight.position.set(0, 0, 0);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xFFFFFF, 5000, 100, .1, .9);
spotLight.position.set(0, 50, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -.0001;
scene.add(spotLight);
/////////////////////////////////////////////LIGHTS/////////////////////////////////////////////


/////////////////////////////////////////////LOADMODEL/////////////////////////////////////////////
const loader = new GLTFLoader().setPath('.vite/assets/models/');
loader.load('SM_PortraitWeb-v1.glb', (gltf) => {
    const portrait = gltf.scene;

    portrait.traverse((child) => {
        if (child.isMesh) {
            child.geometry.center();
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    portrait.position.set (0, 0, 0);
    scene.add(portrait)});
/////////////////////////////////////////////LOADMODEL/////////////////////////////////////////////


renderer.render(scene, camera);
