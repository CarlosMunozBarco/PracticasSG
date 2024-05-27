
import * as THREE from '../libs/three.module.js'
import { MyTubo } from  '../models/Tubo/MyTubo.js'
import { Personaje } from  '../models/Personaje/Personaje.js'
import { Bomba } from  '../models/Bomba/Bomba.js'
import { Tuerca } from  '../models/Tuerca/Tuerca.js'
import { Bidon } from '../models/Bidon/Bidon.js'
import { Trofeo } from '../models/Trofeo/Trofeo.js'
import { Peaje } from '../models/Peaje/Peaje.js'
import { Volante } from '../models/Volante/Volante.js'
import { DRS } from '../models/DRS/DRS.js'
import { Bandera } from '../models/Bandera/Bandera.js'
import { Cronometro } from '../models/Cronometro/Cronometro.js'
import * as Tween from '../libs/tween.esm.js'

class PistaMaestra extends THREE.Object3D {
  constructor(gui,titleGui, scene) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    //Comprobando que funciona
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    const radio = 20;
    this.segmentos = 100;

    //Guardamos la escena
    this.scene = scene;

    /*****************************TUBO*************************************/
    //Se le pasa radio, altura, numero de vueltas y espacio entre vueltas
    var tubo = new MyTubo(radio);
    this.add(tubo);
    /**********************************************************************/

    /*****************************PERSONAJE************************************/
    this.personaje = new Personaje(gui, titleGui);
    this.personaje.name = 'Personaje';
    this.add(this.personaje);

    this.headlight = new THREE.SpotLight(0x00ff00, 2); // Color verde más llamativo
    this.headlight.position.set(0, 1, 2); 
    this.headlight.angle = Math.PI / 6;
    this.headlight.penumbra = 0.1;
    this.headlight.distance = 100;
    this.headlight.target.position.set(0, 0, 10); // Asegurarse de que el objetivo esté hacia adelante
    this.add(this.headlight.target);
    this.personaje.add(this.headlight);
    this.velocidadActual = 30000; //Velocidad del coche
    this.velocidadMinima = 20000;
    

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
    // Agregar event listener para el clic del ratón
    document.addEventListener('click', this.onMouseClick.bind(this), false);
    this.score = 0;

    /****************************************************************************/


    /******************************BOMBA*****************************************/
      var bomba = new Bomba(gui, titleGui);
      this.add(bomba);
      bomba.position.z += 3*radio - 10;
      bomba.position.y += 5;
      bomba.scale.set(0.5, 0.5, 0.5);

      var ptsBomba = this.recorridoVolador(bomba);
      var splineBomba = new THREE.CatmullRomCurve3(ptsBomba);

      var animacionBomba = this.animacionObjeto(bomba, splineBomba);
      

      animacionBomba.start();
    /****************************************************************************/

    /******************************TUERCA*****************************************/
    var tuerca = new Tuerca(gui, titleGui);
    this.add(tuerca);
    tuerca.position.z += 3*radio - 10;
    tuerca.position.y += 5;
    tuerca.position.x -= 3;

    var ptsTuerca = this.invertirVector(this.recorridoVolador(tuerca));
    var splineTuerca = new THREE.CatmullRomCurve3(ptsTuerca);
    var animacionTuerca = this.animacionObjeto(tuerca, splineTuerca);

    animacionTuerca.start();
  /****************************************************************************/

  /******************************BIDON*****************************************/
    this.bidon = new Bidon(gui, titleGui);
    this.add(this.bidon);
    this.bidon.position.z += 2*radio + 0.05;
    this.bidon.position.y += 2;
    this.bidon.position.x += radio;
    this.bidonActivo = true;
    
  /****************************************************************************/

  /******************************TROFEO*****************************************/
  this.trofeo = new Trofeo(gui, titleGui);
  this.add(this.trofeo);
  this.trofeo.position.z += radio - 1;
  this.trofeo.position.y += 2;
  this.trofeo.position.x += 2*radio;
  this.trofeoActivo = true;
  
/****************************************************************************/

/******************************PEAJE*****************************************/
  this.peaje = new Peaje(false);
  this.add(this.peaje);
  this.peaje.rotateY(-Math.PI/2);
  this.peaje.position.z += radio - 3;
  this.peaje.position.y += 1.8;
  this.peaje.position.x -= 2*radio + 3;
/****************************************************************************/

/******************************VOLANTE*****************************************/
  this.volante = new Volante();
  this.add(this.volante);
  this.volante.rotateY(-Math.PI/2);
  this.volante.position.z += 2*radio + 0.05;
  this.volante.position.y -= 4.5;
  this.volante.position.x += radio;
  this.volanteActivo = true;
/****************************************************************************/

/******************************DRS*******************************************/
  this.DRS = new DRS();
  this.add(this.DRS);
  this.DRS.rotateY(-Math.PI/2);
  this.DRS.position.z += radio - 2;
  this.DRS.position.y += 2.3;
  this.DRS.position.x -= 2*radio - 4;
  this.DRSActivo = true;
/****************************************************************************/

/******************************BANDERA*****************************************/
  this.bandera = new Bandera();
  this.add(this.bandera);
  this.bandera.rotateX(-Math.PI);
  this.bandera.rotateY(-Math.PI/2);
  this.bandera.position.z += radio - 3;
  this.bandera.position.y -= 2.5;
  this.bandera.position.x -= 2*radio + 3;
  this.banderaActivo = true;
/****************************************************************************/

/******************************Cronometro*****************************************/
  this.crearCronometro();
/****************************************************************************/





/*************************COLISIONES***********************************/
  this.cajaPersonaje = new THREE.Box3();
  this.cajaBidon = new THREE.Box3();
  this.cajaTrofeo = new THREE.Box3();
  this.cajaPeaje = new THREE.Box3();
  this.cajaVolante = new THREE.Box3();
  this.cajaDRS = new THREE.Box3();
  this.cajaBandera = new THREE.Box3();  
  this.cajaCronometro = new THREE.Box3();
/**********************************************************************/
  }

// Implementa el método onMouseClick
onMouseClick(event) {
  console.log("Se ha hecho clic en la escena."); // Punto de control para verificar si se ha activado el evento del ratón

  // Obtiene las coordenadas del clic del ratón
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Define el rayo desde la posición de la cámara a través de las coordenadas del ratón
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, this.camera);

  // Calcula las intersecciones entre el rayo y los objetos en la escena
  const intersects = raycaster.intersectObjects(this.children, true);

  // Si hay intersecciones, realiza alguna acción
  if (intersects.length > 0) {
      console.log("Se ha detectado una intersección."); // Punto de control para verificar si se detecta una intersección

      // Obtiene el primer objeto intersectado
      const selectedObject = intersects[0].object;

      // Imprime el objeto seleccionado en la consola para depuración
      console.log("Objeto seleccionado:", selectedObject);

      // Verifica el tipo de objeto seleccionado y actualiza la puntuación según corresponda
      if (selectedObject.userData && selectedObject.userData.tipo === "tuerca") {
          // Aumenta la puntuación si el objeto es 'Tuerca'
          console.log("Se ha hecho clic en la tuerca.");
          this.score += 2;
      } else if (selectedObject.userData && selectedObject.userData.tipo === "bomba") {
          // Disminuye la puntuación si el objeto es 'Bomba'
          console.log("Se ha hecho clic en la bomba.");
          this.score -= 5;
          if(this.score < 0){ 
            this.score = 0;
          }
      }

      // Actualiza la visualización de la puntuación en la interfaz gráfica de usuario
      this.updateScoreDisplay(this.score);
  }
}

  crearCronometro(){
    const radio = 20;
    this.cronometro = new Cronometro();
    this.add(this.cronometro);
    this.cronometro.scale.set(2, 2, 2);
    this.cronometro.rotateY(Math.PI/2);
    this.cronometro.position.z += 2*radio + 0.05;
    this.cronometro.position.y += 2;
    this.cronometro.position.x -= 2*radio;
    this.cronometroActivo = true;
    
  }

  // Implementa el método updateScoreDisplay
  updateScoreDisplay(score, perder = false) {
    // Actualiza la puntuación en la interfaz gráfica de usuario

    //Encender una luz roja si se han perdido puntos
    if(perder)
      this.scene.encenderLuzRoja();

    if(score < 0){
      this.score = 0;
      score = 0;
    }
    this.scoreDisplay.score = score;
    
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

crearAnimacion(splinePersonaje) {
  var origen = { t: 0 };
  var fin = { t: 1 };
  var spline = splinePersonaje.clone();

  var animacion = new Tween.Tween(origen).to(fin, this.velocidadActual).onUpdate(() => {
      var posicion = spline.getPointAt(origen.t);

      // Mover al personaje principal
      this.personaje.position.copy(posicion);
      if (origen.t < 0.9999) {
          this.personaje.lookAt(spline.getPointAt((origen.t + 0.0001))); // Mirar ligeramente hacia adelante
      }

      var distanciaDetras = -4; // Reducir la distancia detrás del personaje para acercar la cámara
      var alturaCamara = 3.5; // Altura deseada de la cámara por encima del personaje

      // Calcular la posición de la cámara relativa al personaje
      var relativeCamPos = new THREE.Vector3(0, alturaCamara, distanciaDetras);
      relativeCamPos.applyQuaternion(this.personaje.quaternion); // Aplicar la rotación del personaje a la posición relativa

      // Aplicar la posición relativa al personaje
      var camPos = posicion.clone().add(relativeCamPos);

      // Establecer la posición de la cámara
      this.camera.position.copy(camPos);

      

      // Rotar el personaje principal manualmente
      this.personaje.rotateZ(this.manualRotationAngle);

      // Recalcular la posición relativa de la cámara después de rotar el personaje
      relativeCamPos = new THREE.Vector3(0, alturaCamara, distanciaDetras);
      relativeCamPos.applyQuaternion(this.personaje.quaternion); // Aplicar la rotación del personaje a la posición relativa
      camPos = posicion.clone().add(relativeCamPos);
      this.camera.position.copy(camPos);

      // Hacer que la cámara mire hacia el personaje
      this.camera.lookAt(this.personaje.position);
      this.camera.rotateZ(-this.manualRotationAngle);

       // Detectar vuelta completa
       if (origen.t >= 1.0 && this.velocidadActual > this.velocidadMinima) {
        this.velocidadActual *= 0.9; // Aumentar la velocidad un 10%
        this.crearAnimacion(splinePersonaje); // Reiniciar la animación con la nueva velocidad
      }
  });
  animacion.start();
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
        new THREE.Vector3(objeto.position.x, objeto.position.y, objeto.position.z +5), 
        new THREE.Vector3(objeto.position.x, objeto.position.y, objeto.position.z), 
        new THREE.Vector3(objeto.position.x, objeto.position.y, objeto.position.z -5), 
        new THREE.Vector3(objeto.position.x, objeto.position.y, objeto.position.z) // Punto final (de vuelta al inicio)
    ];

    // Devolvemos los puntos
    return puntos;
 }

  createGUI (gui,titleGui) {
    // Mostrar la puntuación
    this.scoreDisplay = { score: 0 };
    gui.add(this.scoreDisplay, 'score').name('Puntuación').listen();
  }
  
  gestionarColisiones(){
    this.cajaBidon.setFromObject(this.bidon);
    this.cajaPersonaje.setFromObject(this.personaje);
    this.cajaTrofeo.setFromObject(this.trofeo);
    this.cajaPeaje.setFromObject(this.peaje);
    this.cajaVolante.setFromObject(this.volante);
    this.cajaDRS.setFromObject(this.DRS);
    this.cajaBandera.setFromObject(this.bandera);
    this.cajaCronometro.setFromObject(this.cronometro);

    if(this.cajaPersonaje.intersectsBox(this.cajaBidon) && this.bidonActivo == true){
      this.remove(this.cajaBidon);
      this.remove(this.bidon);
      this.bidonActivo = false;
      this.score -= 10;
      this.updateScoreDisplay(this.score, true);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaCronometro) && this.cronometroActivo == true){
      this.remove(this.cajaCronometro);
      this.remove(this.cronometro);
      this.cronometroActivo = false;
      this.score += 3;
      this.updateScoreDisplay(this.score);
      setTimeout(() => {
        this.crearCronometro();
      }, 2000);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaTrofeo) && this.trofeoActivo == true){
      this.remove(this.cajaTrofeo);
      this.remove(this.trofeo);
      this.trofeoActivo = false;
      this.score += 7;
      this.updateScoreDisplay(this.score);
      
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaDRS) && this.DRSActivo == true){
      this.remove(this.cajaDRS);
      this.remove(this.DRS);
      this.DRSActivo = false;
      this.score += 5;
      this.updateScoreDisplay(this.score);
      //Bufo de velocidad temporal para la siguiente vuelta
      this.velocidadActual -= 100;
      setTimeout(() => {
        this.velocidadActual-= 100;
      }, 5000);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaVolante) && this.volanteActivo == true){

      this.score += 10;
      this.updateScoreDisplay(this.score);
      this.remove(this.cajaVolante);
      this.remove(this.volante);
      this.volanteActivo = false;

      var posActual = this.peaje.position;
      this.cajaPeaje = new THREE.Box3();
      this.remove(this.peaje);

      this.peaje = new Peaje(true);
      this.add(this.peaje);
      this.peaje.rotateY(-Math.PI/2);
      this.peaje.position.x = posActual.x;
      this.peaje.position.y = posActual.y;
      this.peaje.position.z = posActual.z;
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaBandera) && this.banderaActivo == true){
      this.remove(this.cajaBandera);
      this.remove(this.bandera);
      this.banderaActivo = false;
      this.score = this.score/2;
      this.updateScoreDisplay(this.score, true);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaPeaje) && this.peaje.levantado == false){
      this.score = 0;
      this.updateScoreDisplay(this.score, true);
    }

  }
  update () {
    Tween.update();
    this.gestionarColisiones();
    if(this.peaje){
      this.peaje.update();
    }
  
  }
}

export { PistaMaestra };
