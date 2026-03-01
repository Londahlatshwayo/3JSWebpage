import * as THREE from "three";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import getLayer from "./getLayer.js"
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { color, texture } from "three/tsl";
import { OutlinePass } from "three/examples/jsm/Addons.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';


/////////////////////////////////////////////RENDERER/////////////////////////////////////////////
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
/////////////////////////////////////////////RENDERER/////////////////////////////////////////////

/////////////////////////////////////////////POSTPROCESSING/////////////////////////////////////////////
//this.composer = new EffectComposer(this.threejs);
/////////////////////////////////////////////POSTPROCESSING/////////////////////////////////////////////



/////////////////////////////////////////////CAMERA/////////////////////////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .5, 1000);
camera.position.set(0, 0, .8);
/////////////////////////////////////////////CAMERA/////////////////////////////////////////////



/////////////////////////////////////////////CONTROLS/////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.enablePan =false;
controls.minPolarAngle = 1;
controls.maxPolarAngle = 1.4;
controls.minAzimuthAngle = -.5;
controls.maxAzimuthAngle = .5;
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
const ambientLight = new THREE.AmbientLight(0x145de5, 1);
ambientLight.position.set(0, 0, 0);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFE3FF1, 2);
pointLight.position.set(-.9, 0, 0);
scene.add(pointLight);

const pointRimLight = new THREE.PointLight(0x00bde1, 300);
pointRimLight.position.set(0, .9, -1.8);
scene.add(pointRimLight);

const pointLightTopDown = new THREE.PointLight(0xee8e0d, 3);
pointLightTopDown.position.set(.9, .3, .7);
scene.add(pointLightTopDown);

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

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
loader.setDRACOLoader( dracoLoader );


loader.load('assets/models/SM_PortraitWeb-moved.glb', (gltf) => {
    const portrait = gltf.scene;
    
    //Material & texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'assets/textures/T_Portrait_Albedo2048.webp' );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY =false;
    texture.colorSpace = THREE.SRGBColorSpace;

    //Base material
    const portraitMaterial = new THREE.MeshPhysicalMaterial({map:texture});
    portraitMaterial.roughness = .8;
    portraitMaterial.iridescence = .05;

    //Outline material
    //const outlineMaterial = new THREE.MeshBasicMaterial({color: "black"});

    //addOutlineObject(gltf.scene);

    portrait.traverse((child) => {
        if (child.isMesh) {
            console.log(child)
            child.geometry.center();
            //child.material = outlineMaterial;
            child.material = portraitMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    portrait.position.set (0, 0, 0);
    scene.add(portrait)});
/////////////////////////////////////////////LOADMODEL/////////////////////////////////////////////


/////////////////////////////////////////////OUTLINEFUNCTION/////////////////////////////////////////////
//function addOutlineObject(object){
    //objectsToOutline.push(portrait);
    //OutlinePass.selectedObjects = objectsToOutline;
//}
/////////////////////////////////////////////OUTLINEFUNCTION/////////////////////////////////////////////

/////////////////////////////////////////////ANIMATEFUNCTION/////////////////////////////////////////////
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();

}
/////////////////////////////////////////////ANIMATEFUNCTION/////////////////////////////////////////////

animate()