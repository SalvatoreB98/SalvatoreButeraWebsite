import * as animations from './animations';
import * as THREE from 'three'
import GSAP from 'gsap';
import { lerp } from 'three/src/math/mathutils';
Vue.createApp({
    el: '#app',
    data() {
        return {
            selectedButton: '',
            snapFX:'',
            windFX: '',
            pageId: '',
            selectedSkill: 'javascript',
            lastDistanceMax: Number.MIN_VALUE,
            movement: 0,
            prevX: -1,
            grabInfo: false
        }
    },
    mounted(){
        this.snapFX = new Audio('src/fx/hover.wav');
        this.windFX = new Audio('src/fx/wind.wav');
        this.snapFX.volume = .2;
        setTimeout(()=>{
            this.setActive('home-profile')
        },100);
        let iconContainers = document.querySelectorAll('.icon-container');
            iconContainers.forEach(element=>{
                element.addEventListener("mouseenter",(e)=>{
                    this.windFX.cloneNode(true).play();
                    this.$refs.tooltip.innerHTML = `<strong>${e.target.id}</strong>`
                    this.$refs.tooltip.style.top = e.target.offsetTop.toString() + 'px';
                    this.$refs.tooltip.style.opacity = 1
                })
                element.addEventListener("mouseleave",(e)=>{
                    this.$refs.tooltip.style.opacity = 0
                    this.windFX.pause();
                })
            })
        },
    methods: {
        setActive(event){
            if(event != this.selectedButton.id){
                this.windFX.pause();
                let iconContainers = document.querySelectorAll('.icon-container');
                iconContainers.forEach(element=>{
                    element.style.borderRight = "none";
                });
                this.$refs.tooltip.style.opacity = 0
                this.snapFX.play();
                this.selectedButton = document.getElementById(event);
                this.selectedButton.style.borderRight = "solid #007eb1";
                animations.animation1(this.$refs.page,'animaton-1')
                if(event == 'career'){
                    setTimeout(()=>{
                        let element = document.getElementById('rise-up');
                        element.classList.add('rise-up-animation')
                    },75);
                }
                switch(event){
                    case 'home-profile' :{
                        this.$refs['progress-bar'].style.width = `14%`
                        break
                    }
                    case 'about-me' :{
                        this.$refs['progress-bar'].style.width = `28%`
                        break
                    }
                    case 'career' :{
                        this.$refs['progress-bar'].style.width = `42%`
                        break
                    }
                    case 'education' :{
                        this.$refs['progress-bar'].style.width = `56%`
                        break
                    }
                    case 'works' :{
                        this.$refs['progress-bar'].style.width = `70%`
                        break
                    }
                    case 'skills' :{
                        this.$refs['progress-bar'].style.width = `84%`
                        break
                    }
                    case 'contacts' :{
                        this.$refs['progress-bar'].style.width = `100%`
                        break
                    }
                }
                if(event == 'skills'){
                    setTimeout(()=>{
                        this.sphere()
                    },75);
                }
            }
            
        },
        playWind(){
            this.windFX = new Audio('src/fx/wind.wav');
            this.windFX.play()
        },
        stopWind(){
            this.windFX.pause()
        },
        sphere(){
                
                const scene = new THREE.Scene()
                const camera = new THREE.PerspectiveCamera(
                    75,
                    innerWidth / innerHeight,
                    0.1,
                    1000
                )
                const renderer = new THREE.WebGLRenderer({
                    alpha:true,
                    antialias:true
                })
                renderer.setSize(innerWidth/4,innerHeight/4)
                renderer.setPixelRatio(window.devicePixelRatio)
                const sphereCanvas = document.getElementById("sphere-container");
                sphereCanvas.appendChild(renderer.domElement);
                sphereCanvas.style.opacity = 0.5
                this.grabInfo = true;
                
                //create a sphere
                const sphere = new THREE.Mesh(new THREE.SphereGeometry(3,50,50),new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load('/imgs/wrapskills.png'),
                    transparent:true,
                    side: THREE.DoubleSide
                }))
                scene.add(sphere)
                camera.position.z = 5
                let move = false;
                sphere.rotation.y = 0.4
                  
                let mousedown;
                let mouseSpeed = {
                    x:0,
                    y:0
                } ;
                let interpolate = true;
                let isWheel = false
                var prevEvent, currentEvent;
                var  movementX = 0;
                document.documentElement.onmousemove=function(event){
                currentEvent=event;
                }
                setInterval(function(){
                    if(prevEvent && currentEvent){
                        movementX= currentEvent.screenX-prevEvent.screenX;
                    }
                    prevEvent=currentEvent;
                }, 10)
                document.addEventListener('mousemove',(e)=>{
                    currentEvent = e;
                    mouseSpeed = {
                        x: movementX/100,
                        y: e.movementY
                    } ;   
                })  
                document.addEventListener('mousedown',(e)=>{
                    mousedown = true;
                    sphereCanvas.style.cursor = 'grabbing';
                    sphereCanvas.style.opacity = 1
                    this.grabInfo = false
                    lerp.current = lerp.target
                })     
                document.addEventListener('mouseup',(e)=>{
                    sphereCanvas.style.cursor = 'grab' 
                    mousedown = false;
                    console.log('speed: ', mouseSpeed.x)
                    console.log('current: ', lerp.current)
                    console.log('target: ', lerp.target)
                    if(mouseSpeed !=0){
                        lerp.target = sphere.rotation.y + mouseSpeed.x *5 
                    }            
                });
                var lerp = {
                    current:0,
                    target: 0,
                    ease: 0.1
                }
                let that = this;
                function animate() {
                    // console.log('speed: ', mouseSpeed.x)
                    // console.log('current: ', lerp.current)
                    // console.log('target: ', lerp.target)
                    if(mousedown == false && isWheel == false){
                        sphere.rotation.y = lerp.current;   
                        lerp.current = GSAP.utils.interpolate(
                            lerp.current,
                            lerp.target,
                            lerp.ease
                        )                 
                    }
                    if(mousedown == true){
                        sphere.rotation.y = sphere.rotation.y + mouseSpeed.x*0.5
                        lerp.current = sphere.rotation.y;
                    }
                    that.selectedSkill =that.getSkill(sphere.rotation.y);
                    requestAnimationFrame(animate)
                    renderer.render(scene,camera)
                }
                animate(); 
        },
        getSkill(sphereRotation){
            let toReturn = 'javascript'
            sphereRotation = THREE.MathUtils.radToDeg(sphereRotation);
            if(sphereRotation > 0){
                while(sphereRotation > 360){
                    sphereRotation = sphereRotation - 360;
                }
            } else {
                while(sphereRotation < -360){
                    sphereRotation = sphereRotation + 360;
                }
            }
            if(sphereRotation < 45 && sphereRotation > 0){
                toReturn = 'javascript'
            }
            if(sphereRotation < 90 && sphereRotation > 45){
                toReturn = 'angular'
            }
            if(sphereRotation < 135 && sphereRotation > 90){
                toReturn = 'typescript'
            }
            if(sphereRotation < 180 && sphereRotation > 135){
                toReturn = 'java'
            }
            if(sphereRotation < 225 && sphereRotation > 180){
                toReturn = 'scss'
            }
            if(sphereRotation < 270 && sphereRotation > 225){
                toReturn = 'css'
            }
            if(sphereRotation < 315 && sphereRotation > 270){
                toReturn = 'html'
            }
            if(sphereRotation < 360 && sphereRotation > 315){
                toReturn = 'bootstrap'
            }


            if(sphereRotation < 0 && sphereRotation > -45){
                toReturn = 'bootstrap'
            }
            if(sphereRotation > -90 && sphereRotation < -45){
                toReturn = 'html'
            }
            if(sphereRotation > -135 && sphereRotation < -90){
                toReturn = 'css'
            }
            if(sphereRotation > -180 && sphereRotation < -135){
                toReturn = 'scss'
            }
            if(sphereRotation > -225 && sphereRotation < -180){
                toReturn = 'java'
            }
            if(sphereRotation > -270 && sphereRotation < -225){
                toReturn = 'typescript'
            }
            if(sphereRotation > -315 && sphereRotation < -270){
                toReturn = 'angular'
            }
            if(sphereRotation > -360 && sphereRotation < -315){
                toReturn = 'javascript'
            }
            return toReturn;
        }
        
    }
  }).mount('#app')