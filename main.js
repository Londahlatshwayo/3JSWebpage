import * as THREE from "three";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import getLayer from "./getLayer.js"
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { color, texture } from "three/tsl";
import { TextureLoader } from "three/webgpu";

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
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .5, 1000);
camera.position.set(0, 0, 1.8);
/////////////////////////////////////////////CAMERA/////////////////////////////////////////////



/////////////////////////////////////////////CONTROLS/////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.enablePan =false;
controls.minPolarAngle = .1;
controls.maxPolarAngle = 1.5;
controls.enableZoom = true;
controls.update();
/////////////////////////////////////////////CONTROLS/////////////////////////////////////////////



/////////////////////////////////////////////GROUNDPLANE/////////////////////////////////////////////
//const geometry = new THREE.PlaneGeometry(70, 100, 100, 100);
//geometry.rotateX(-Math.PI/2);
//const material = new THREE.MeshPhysicalMaterial({ color: 0x555555, side: THREE.DoubleSide});
//const groundMesh = new THREE.Mesh(geometry, material);
//groundMesh.castShadow = false;
//groundMesh.receiveShadow = true;
//scene.add(groundMesh);
/////////////////////////////////////////////GROUNDPLANE/////////////////////////////////////////////


/////////////////////////////////////////////BACKGROUND/////////////////////////////////////////////
const gradientBackground = getLayer({
  hue: 0.6,
  numSprites: 8,
  opacity: 0.25,
  radius: 16,
  size: 30,
  z: -15.5,
});
scene.add(gradientBackground);
/////////////////////////////////////////////BACKGROUND/////////////////////////////////////////////


/////////////////////////////////////////////LIGHTS/////////////////////////////////////////////
const ambientLight = new THREE.AmbientLight(0xFFFFFF, .9);
ambientLight.position.set(0, 0, 0);
scene.add(ambientLight);

const hemispherLight = new THREE.HemisphereLight(0xFFFFFF, .9);
hemispherLight.position.set(0, 0, 0);
scene.add(hemispherLight);

const spotLight = new THREE.SpotLight(0xFFFFFF, 5000, 0, .1, 0);
spotLight.position.set(0, 50, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -.0001;
scene.add(spotLight);
/////////////////////////////////////////////LIGHTS/////////////////////////////////////////////


/////////////////////////////////////////////LOADMODEL/////////////////////////////////////////////
const loader = new GLTFLoader();
loader.load('assets/models/SM_PortraitWeb-moved.glb', (gltf) => {
    const portrait = gltf.scene;
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'assets/textures/T_Portrait_Albedo2048.webp' );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY =false;
    //texture.colorSpace = THREE.SRGBColorSpace;

    const portraitMaterial = new THREE.MeshPhysicalMaterial({map:texture});

    portrait.traverse((child) => {
        if (child.isMesh) {
            child.geometry.center();
            child.material = portraitMaterial;
            child.castShadow = false;
            child.receiveShadow = true;
        }
    });

    portrait.position.set (0, 0, 1);
    scene.add(portrait)});
/////////////////////////////////////////////LOADMODEL/////////////////////////////////////////////


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

}

animate()