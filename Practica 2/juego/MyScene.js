// Clases de la biblioteca
import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'

// Clases de mi proyecto
import { PistaMaestra } from './PistaMaestra.js'

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();
    
    // Crear el renderer
    this.renderer = this.createRenderer(myCanvas);
    
    // Crear GUI
    this.gui = this.createGUI();
    
    // Inicializar estadísticas
    this.initStats();
    
    // Crear luces
    this.createLights();
    
    // Crear el modelo y agregarlo a la escena
    this.model = new PistaMaestra(this.gui, "Controles de la Caja");
    this.add(this.model);
    
    // Crear cámaras
    this.createCamera();
    this.createFullViewCamera();
    
    // Establecer la cámara activa
    this.activeCamera = this.camera;
    
    // Configurar evento de teclado para cambiar cámaras
    document.addEventListener('keydown', (event) => {
      if (event.key === 'c') {
        this.toggleCamera();
      }
    });

    // Crear los ejes
    this.axis = new THREE.AxesHelper(2);
    this.add(this.axis);

    // Escuchar eventos de redimensionamiento
    window.addEventListener("resize", () => this.onWindowResize());

    // Primera visualización
    this.update();
  }
  
  initStats() {
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    
    // Posicionar las estadísticas
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    document.body.appendChild(stats.domElement);
    this.stats = stats;
  }
  
  createCamera() {
    // Obtener la cámara del modelo
    this.camera = this.model.getCamera();
    this.camera.lookAt(this.model.getTarget());
    this.add(this.camera);

    // Crear controles para la cámara
    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.target = this.model.getTarget();
  }

  createFullViewCamera() {
    // Cámara de vista completa
    this.fullViewCamera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 0.1, 50);
    this.fullViewCamera.position.set(0, 15, this.model.radio);
    this.fullViewCamera.lookAt(0, 0, 10);
    this.add(this.fullViewCamera);

    // Crear controles para la cámara de vista completa
    this.fullViewCameraControl = new TrackballControls(this.fullViewCamera, this.renderer.domElement);
    this.fullViewCameraControl.target.set(0, 0, 30);
  }

  toggleCamera() {
    if (this.activeCamera === this.camera) {
      this.activeCamera = this.fullViewCamera;
    } else {
      this.activeCamera = this.camera;
    }
  }

  createGround() {
    var geometryGround = new THREE.BoxGeometry(10, 0.2, 10);
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial({ map: texture });
    var ground = new THREE.Mesh(geometryGround, materialGround);
    ground.position.y = -0.1;
    this.add(ground);
  }

  createGUI() {
    var gui = new GUI();
    this.guiControls = {
      lightPower: 500.0,
      ambientIntensity: 0.5,
      axisOnOff: true
    }

    var folder = gui.addFolder('Luz y Ejes');
    folder.add(this.guiControls, 'lightPower', 0, 1000, 20).name('Luz puntual: ').onChange((value) => this.setLightPower(value));
    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05).name('Luz ambiental: ').onChange((value) => this.setAmbientIntensity(value));
    folder.add(this.guiControls, 'axisOnOff').name('Mostrar ejes: ').onChange((value) => this.setAxisVisible(value));
    
    return gui;
  }

  createLights() {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);
    
    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(0,5, 10);
    this.add(this.pointLight);
  }

  setLightPower(value) {
    this.pointLight.power = value;
  }

  setAmbientIntensity(value) {
    this.ambientLight.intensity = value;
  }

  setAxisVisible(value) {
    this.axis.visible = value;
  }

  createRenderer(myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.querySelector(myCanvas).appendChild(renderer.domElement);
    return renderer;
  }

  getCamera() {
    return this.camera;
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
    this.fullViewCamera.aspect = ratio;
    this.fullViewCamera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    if (this.stats) this.stats.update();
    
    this.cameraControl.update();
    this.fullViewCameraControl.update();

    this.model.update();

    this.renderer.render(this, this.activeCamera);

    requestAnimationFrame(() => this.update());
  }
}

$(function() {
  var scene = new MyScene("#WebGL-output");
});
