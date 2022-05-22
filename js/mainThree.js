import gsap from 'gsap';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Utils from './Utils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//GUI
const world = {
  plane: {
    width: 25,
    height: 25,
    widthSegments: 50,
    heightSegments: 50,
    color: {
      r: 0,
      g: 0.065,
      b: 0.09
    }
  }
}

//INITIALIZATIONS
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();

//RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio);
window.addEventListener("resize",()=>{
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
})

document.body.appendChild(renderer.domElement)

//GEOMETRY & MATERIALS
const planeGeometry = new THREE.PlaneGeometry(world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const material = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide, 
  flatShading: THREE.FlatShading,
  vertexColors: true
})
const mesh = new THREE.Mesh(planeGeometry,material);
const {array} =  mesh.geometry.attributes.position
Utils.lowPolySea(array);
scene.add(mesh);


//LIGHTING
const light = new THREE.DirectionalLight(0xffffff,0.45)
light.position.set(0, 0, 1)
scene.add(light);

//CAMERA && UX/UI
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 4;
new OrbitControls(camera,renderer.domElement)
const mouse = {
  x: undefined,
  y: undefined,
}
addEventListener('mousemove',(e)=>{
  touchOrMouseMove(e);
})
addEventListener('touchmove',(e)=>{
  touchOrMouseMove(e);
})

generatePlane()
//ANIMATIONS
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse,camera);
  const intersect = raycaster.intersectObject(mesh);
  if (intersect.length > 0){
    const {color} = intersect[0].object.geometry.attributes
    color.needsUpdate = true;
  }
  camera.position.x = -mouse.x/5;
  camera.position.y = -mouse.y/5;
  const initialColor = {
    r: world.plane.color.r,
    g: world.plane.color.g,
    b: world.plane.color.b
  }
  const hoverColor = {
    r: 0.12,
    g: 0.49,
    b: 0.69
  }
  gsap.to(hoverColor,{
    r: initialColor.r,
    g: initialColor.g,
    b: initialColor.b,
    onUpdate: ()=>{
      if(intersect[0]){
        var {color} = intersect[0].object.geometry.attributes
      //vert 1
        color.setX(intersect[0].face.a,hoverColor.r);
        color.setY(intersect[0].face.a,hoverColor.g);
        color.setZ(intersect[0].face.a,hoverColor.b);
        //vert 2
        color.setX(intersect[0].face.b,hoverColor.r);
        color.setY(intersect[0].face.b,hoverColor.g);
        color.setZ(intersect[0].face.b,hoverColor.b);
        //vert 3
        color.setX(intersect[0].face.c,hoverColor.r);
        color.setY(intersect[0].face.c,hoverColor.g);
        color.setZ(intersect[0].face.c,hoverColor.b);
        color.needsUpdate = true;
      }
    }
  })
}
animate();


//FUNCTIONS
function generatePlane(){
  mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const {array} =  mesh.geometry.attributes.position
  scene.add(mesh);
  Utils.lowPolySea(array);
  const colors = [];
  for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
    colors.push(world.plane.color.r,world.plane.color.g,world.plane.color.b);
  }
  mesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors),3))
}
function touchOrMouseMove(e){
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
  mesh.rotation.x = -mouse.y / 10;
  mesh.rotation.y = mouse.x / 10;
}