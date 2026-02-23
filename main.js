import * as THREE from "three";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

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
const ambientLight = new THREE.AmbientLight(0xFFFFFF, .01);
ambientLight.position.set(0, 0, 0);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xFFFFFF, 5000, 0, .1, 1);
spotLight.position.set(0, 50, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -.0001;
scene.add(spotLight);
/////////////////////////////////////////////LIGHTS/////////////////////////////////////////////


/////////////////////////////////////////////LOADMODEL/////////////////////////////////////////////
const loader = new GLTFLoader();
loader.load('assets/models/SM_PortraitWeb-moved.glb', (gltf) => {
    const portrait = gltf.scene;

    portrait.traverse((child) => {
        if (child.isMesh) {
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