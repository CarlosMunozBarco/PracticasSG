import * as THREE from '../libs/three.module.js'
import { MyTubo } from  '../models/Tubo/MyTubo.js'
import { Personaje } from  '../models/Personaje/Personaje.js'
import { Bomba } from  '../models/Bomba/Bomba.js'
import { Tuerca } from  '../models/Tuerca/Tuerca.js'
import * as Tween from '../libs/tween.esm.js'

class PistaMaestra extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    //Comprobando que funciona
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    const radio = 15;
    this.segmentos = 100;
    
    /*****************************TUBO*************************************/
    //Se le pasa radio, altura, numero de vueltas y espacio entre vueltas
    var tubo = new MyTubo(radio);
    this.add(tubo);
    /**********************************************************************/

    /*****************************PERSONAJE************************************/
    this.personaje = new Personaje(gui, titleGui);
    this.personaje.name = 'Personaje';
    this.add(this.personaje);

    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 0);

    this.personaje.add(this.camera);


    var pts = tubo.obtenerPuntos(radio);
    var splinePersonaje = new THREE.CatmullRomCurve3(pts);
    
    
    var animacion = this.crearAnimacion(splinePersonaje);
    animacion.start();

    // Variable para controlar la rotación manual durante la animación
    this.manualRotationAngle = 0;

    // Agregar event listener para el teclado
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);

    /****************************************************************************/


    /******************************BOMBA*****************************************/
      var bomba = new Bomba(gui, titleGui);
      this.add(bomba);
      bomba.position.z += 3*radio;
      bomba.scale.set(0.5, 0.5, 0.5);

      var ptsBomba = this.recorridoVolador(bomba);
      var splineBomba = new THREE.CatmullRomCurve3(ptsBomba);

      var animacionBomba = this.animacionObjeto(bomba, splineBomba);
      

      animacionBomba.start();
    /****************************************************************************/

    /******************************TUERCA*****************************************/
    var tuerca = new Tuerca(gui, titleGui);
    this.add(tuerca);
    tuerca.position.z += 3*radio;
    tuerca.position.x -=3;

    var ptsTuerca = this.invertirVector(this.recorridoVolador(tuerca));
    var splineTuerca = new THREE.CatmullRomCurve3(ptsTuerca);
    var animacionTuerca = this.animacionObjeto(tuerca, splineTuerca);

    animacionTuerca.start();
  /****************************************************************************/
  }

  onKeyDown(event) {
    switch(event.key) {
      case 'a':
        this.manualRotationAngle += -Math.PI / 8; // Angulo de rotación hacia la izquierda
        break;
      case 'd':
        this.manualRotationAngle += +Math.PI / 8; // Angulo de rotación hacia la derecha
        break;
      default:
        break;
    }
  }

  animacionObjeto(objeto, spline){

    var binormales = spline.computeFrenetFrames(this.segmentos, true).binormals;

    var origen = {t : 0};
    var fin = {t : 1};
    var tiempoDeRecorridoBomba = 10000;

    var animacion = new Tween.Tween(origen).to(fin, tiempoDeRecorridoBomba).onUpdate(()=> {
      var posicion = spline.getPointAt(origen.t);
      objeto.position.copy(posicion);
      var tangente = spline.getTangentAt(origen.t);
      posicion.add(tangente);
      objeto.up = binormales[Math.floor(origen.t * this.segmentos)];
      objeto.lookAt(posicion);
  })

  return animacion.repeat(Infinity);

}

  crearAnimacion(splinePersonaje){

    var origen = {t : 0};
    var fin = {t : 1};
    var tiempoDeRecorrido = 30000;
    var spline = splinePersonaje.clone();

    var animacion = new Tween.Tween(origen).to(fin, tiempoDeRecorrido).onUpdate(()=> {
      var posicion = spline.getPointAt(origen.t);
      var tangente = spline.getTangentAt(origen.t);
      origen.t = THREE.MathUtils.clamp(origen.t, 0, 1);
    
      // Mover al personaje principal
      this.personaje.position.copy(posicion);
      if(origen.t < 0.99){
        this.personaje.lookAt(spline.getPointAt((origen.t + 0.01))); // Mirar ligeramente hacia adelante
      }
      


      var distanciaDetras = -4; // Reducir la distancia detrás del personaje para acercar la cámara
      var alturaCamara = 3; // Altura deseada de la cámara por encima del personaje
      // Calcular la posición de la cámara
      var camPos = posicion.clone().add(tangente.clone().multiplyScalar(distanciaDetras));
      
      // Establecer la posición de la cámara
      this.camera.position.copy(camPos);
      this.camera.position.y = posicion.y + alturaCamara; // Ajustar la altura de la cámara
  
      // Hacer que la cámara mire hacia donde está mirando el personaje principal
      this.camera.lookAt(this.personaje.position);

      // Rotar el personaje principal manualmente
      this.personaje.rotateZ(this.manualRotationAngle);
    })

    return animacion.repeat(Infinity);
  }

  getCamera(){
    return this.camera;
  }

  getTarget(){
    return this.personaje.position;
  }
  

  invertirVector(vector) {
    // Creamos un nuevo vector para almacenar el resultado
    var vectorInvertido = [];

    // Iteramos sobre el vector original en orden inverso
    for (var i = vector.length - 1; i >= 0; i--) {
        // Añadimos cada componente al nuevo vector invertido
        vectorInvertido.push(vector[i]);
    }

    return vectorInvertido;
  }

  getCamera(){
    return this.camera;
  }
  
  recorridoVolador(objeto) {
    // Definimos los puntos de la trayectoria
    const puntos = [
        new THREE.Vector3(objeto.position.x, objeto.position.y, objeto.position.z), // Punto inicial
        new THREE.Vector3(objeto.position.x, objeto.position.y+5, objeto.position.z), 
        new THREE.Vector3(objeto.position.x, objeto.position.y, objeto.position.z), 
        new THREE.Vector3(objeto.position.x, objeto.position.y-5, objeto.position.z), 
        new THREE.Vector3(objeto.position.x, objeto.position.y, objeto.position.z) // Punto final (de vuelta al inicio)
    ];

    // Devolvemos los puntos
    return puntos;
}

  createGUI (gui,titleGui) {
  }
  
  update () {
    Tween.update();
  }
}

export { PistaMaestra };
