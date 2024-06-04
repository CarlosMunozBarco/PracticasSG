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
    
    
    
    // Crear el modelo y agregarlo a la escena
    this.model = new PistaMaestra(this.gui, "Controles de la Caja", this);
    this.add(this.model);

    this.personaje = this.model.personaje;
    
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

    // Crear luces
    this.createLights();

    // Crear los ejes
    this.axis = new THREE.AxesHelper(2);
    this.add(this.axis);

    // Escuchar eventos de redimensionamiento
    window.addEventListener("resize", () => this.onWindowResize());

    // Crear el fondo de cubemap
    this.createBackgroundCubeMap();
    
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

  createBackgroundCubeMap() {
    const path = '../../juego/'; // No es necesario especificar una ruta si las imágenes están en la misma carpeta que MyScene.js
    const format = '.png'; // Asegúrate de que la extensión coincida con la de tus imágenes
    const urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    var textureCube = new THREE.CubeTextureLoader().load(urls);

    this.background = textureCube; // Asigna el cubemap como fondo de la escena
}

  //Función que aumenta la intensidad de la luz roja (la "enciende") durante 3 segundos
  encenderLuzRoja() {
    this.luzRoja.power = 500;
    setTimeout(() => {
      this.luzRoja.power = 0;
    }, 3000); // Apaga la luz roja después de 3 segundos
  }



  //Crea la cámara
  createCamera() {
    // Obtener la cámara del modelo
    this.camera = this.model.getCamera();
    this.camera.lookAt(this.model.getTarget());
    this.add(this.camera);

    // Crear controles para la cámara
    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
    this.cameraControl.target = this.model.getTarget();
  }

  //Crea la camara
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

  //Cambia a la cámara que NO se este usando
  toggleCamera() {
    if (this.activeCamera === this.camera) {
      this.activeCamera = this.fullViewCamera;
    } else {
      this.activeCamera = this.camera;
    }
  }


  //Crea la interfaz
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

  
  //Crea las luces
  createLights() {

    //Luz ambiental
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);


    //Luz por conseguir puntos
    this.luzCoche = new THREE.SpotLight(0x970FF);
    this.add(this.luzCoche);
    this.luzCoche.power = 100;
    this.luzCoche.penumbra = 0.75;
    this.luzCoche.position.set(0, 10, 10);
    this.model.personaje.add(this.luzCoche);
    this.luzCoche.target = this.model.personaje;


    //Luz por perder puntos
    this.luzRoja = new THREE.SpotLight(0xFF0000);
    this.add(this.luzRoja);
    this.luzRoja.power = 0;
    this.luzRoja.penumbra = 0.75;
    this.luzRoja.position.set(0, 10, 10);
    this.model.personaje.add(this.luzRoja);
    this.luzRoja.target = this.model.personaje;

    //Luz para iluminar el trofeo
    this.luzTrofeo = new THREE.SpotLight(0xFFFFFF);
    this.add(this.luzTrofeo);
    this.luzTrofeo.power = 900;
    this.luzTrofeo.penumbra = 0.75;
    this.luzTrofeo.position.set(0, 10, 10);
    this.model.trofeo.add(this.luzTrofeo);  
    this.luzTrofeo.target = this.model.trofeo;

    //Luz para iluminar el cronometro
    this.luzCronometro = new THREE.SpotLight(0xFFFFFF);
    this.add(this.luzCronometro);
    this.luzCronometro.power = 900;
    this.luzCronometro.penumbra = 0.75;
    this.luzCronometro.position.set(0, 10, 10);
    this.model.cronometro.add(this.luzCronometro);  
    this.luzCronometro.target = this.model.cronometro;
    

    const spotLightHelper = new THREE.SpotLightHelper(this.luzCoche);
    this.add(spotLightHelper);

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

  //Crea el renderer
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

  //Define el comportamiento al modificar el tamaño de la ventana
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

    //Modifica la intensidad de la luz azul que apunta al coche en base a los puntos obtenidos
    this.luzCoche.power = 100 + 150*this.model.score;

    requestAnimationFrame(() => this.update());
  }
}

$(function() {
  var scene = new MyScene("#WebGL-output");
});