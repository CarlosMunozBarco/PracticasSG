
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
import { Pistola } from '../models/Pistola/Pistola.js'
import { ZonaMojada } from '../models/ZonaMojada/ZonaMojada.js'
import { Rueda } from '../models/Rueda/Rueda.js'
import * as Tween from '../libs/tween.esm.js'

class PistaMaestra extends THREE.Object3D {
  constructor(gui,titleGui, scene) {
    super();
    
    //Se crea la interfaz
    this.createGUI(gui,titleGui);

    //Se definen las variables constantes y valores numéricos
    const radio = 20; //El radio que define lo grande o pequeño que sera el circuito
    this.velocidadActual = 30000; //Velocidad del coche (tiempo que tarda en dar una vuelta)
    this.velocidadMinima = 15000; //Velocidad maxima del coche (el tiempo minimo que puede tardar en dar una vuelta)

    //Guardamos la escena
    this.scene = scene;

    /*****************************TUBO*************************************/
    //Crea el circuito en base al radio
    var tubo = new MyTubo(radio);
    this.add(tubo);
    /**********************************************************************/

    /*****************************PERSONAJE************************************/
    //Crea el personaje
    this.personaje = new Personaje(gui, titleGui);
    this.personaje.name = 'Personaje';
    this.add(this.personaje);

    //Se crea la camara que seguirá al personaje
    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 0);
    this.personaje.add(this.camera);


    //Se obtienen los puntos que conforman el tubo para poder crear la animación del coche y la cámara
    var pts = tubo.obtenerPuntos(radio);
    this.splinePersonaje = new THREE.CatmullRomCurve3(pts);
    
    //Se crea la animación de la cámara y el coche en base a los puntos del tubo
    this.crearAnimacion(this.splinePersonaje, false);
    

    // Variable para controlar la rotación manual durante la animación
    this.manualRotationAngle = 0;

    // Agregar event listener para el teclado
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    // Agregar event listener para el clic del ratón
    document.addEventListener('click', this.onMouseClick.bind(this), false);
    this.score = 0;

    /****************************************************************************/

    this.tieneRueda = false;


    /******************************BOMBA*****************************************/
      var bomba = new Bomba(gui, titleGui); //Se crea la bomba
      this.add(bomba);
      bomba.position.z += 3*radio - 10;
      bomba.position.y += 5;
      bomba.scale.set(0.5, 0.5, 0.5);

      var ptsBomba = this.recorridoVolador(bomba); //Se obtiene el camino que recorrera la bomba
      var splineBomba = new THREE.CatmullRomCurve3(ptsBomba);

      var animacionBomba = this.animacionObjeto(bomba, splineBomba); //Se crea la animación de la bomba en base a dichos puntos
      
      animacionBomba.start();
    /****************************************************************************/

    /******************************TUERCA*****************************************/
    var tuerca = new Tuerca(gui, titleGui); //Se crea la tuerca
    this.add(tuerca);
    tuerca.position.z += 3*radio - 10;
    tuerca.position.y += 5;
    tuerca.position.x -= 3;

    var ptsTuerca = this.invertirVector(this.recorridoVolador(tuerca)); //Se obtiene el camino que recorrerá la tuerca
    var splineTuerca = new THREE.CatmullRomCurve3(ptsTuerca);
    var animacionTuerca = this.animacionObjeto(tuerca, splineTuerca); //Se crea la animación de la tuerca en base a dichos puntos

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
  this.volanteActivo = true; //Variable que sirve para controlar si el objeto esta o no activo.
  //Sirve para evitar que aplique varias veces las consecuencias de la colisión antes de desaparecer
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
  this.crearCronometro(); //Funcion que crea el cronometro y lo situa en el lugar correcto
/****************************************************************************/

/******************************Pistola*****************************************/
  this.pistola = new Pistola();
  this.add(this.pistola);
  this.pistola.position.z += radio - 1;
  this.pistola.position.y += 2;
  this.pistola.position.x -= 2*radio - 15;
  this.pistolaActiva = true;
/****************************************************************************/

/******************************Zona Mojada***************************************/
  this.zonaMojada = new ZonaMojada();
  this.add(this.zonaMojada);
  this.zonaMojada.position.z += 2*radio -0.4;
  this.zonaMojada.position.x -= 4 +radio;
/****************************************************************************/

/******************************Rueda***************************************/
this.rueda = new Rueda();
this.add(this.rueda);
this.rueda.position.set(3* radio + 2, 3, 1.5 * radio + 5);


/*************************COLISIONES***********************************/
//Creamos una caja para todos los objetos de la escena, que luego servira para gestionar las colisiones

  this.cajaPersonaje = new THREE.Box3();
  this.cajaBidon = new THREE.Box3();
  this.cajaTrofeo = new THREE.Box3();
  this.cajaPeaje = new THREE.Box3();
  this.cajaVolante = new THREE.Box3();
  this.cajaDRS = new THREE.Box3();
  this.cajaBandera = new THREE.Box3();  
  this.cajaCronometro = new THREE.Box3();
  this.cajaPistola = new THREE.Box3();
  this.cajaZonaMojada = new THREE.Box3();
  this.cajaRueda = new THREE.Box3();
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

  //Crea el cronometro y lo situa en el lugar correcto
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


  //Gestiona que pulsar las teclas a y d modifiquen el angulo de rotación del coche y la cámara
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

  //Función que sirve para crear una animación para un objeto en base a un spline dado
  animacionObjeto(objeto, spline){

    var segmentos = 100; 
    var binormales = spline.computeFrenetFrames(segmentos, true).binormals;

    var origen = {t : 0}; 
    var fin = {t : 1};
    var tiempoDeRecorridoBomba = 10000;

    var animacion = new Tween.Tween(origen).to(fin, tiempoDeRecorridoBomba).onUpdate(()=> {
      var posicion = spline.getPointAt(origen.t);
      objeto.position.copy(posicion);
      var tangente = spline.getTangentAt(origen.t);
      posicion.add(tangente);
      objeto.up = binormales[Math.floor(origen.t * segmentos)];
      objeto.lookAt(posicion);
  })

  return animacion.repeat(Infinity);

}

//Modifica la velocidad actual del coche y la cámara. Basicamente, crea una nueva animación con la velocidad actualizada 
//que sustituye a la antigua
modificarVelocidad(cantidad){

  if(this.velocidadActual - 2000*cantidad > this.velocidadMinima){
    this.velocidadActual -= 2000*cantidad;
  }else{
    this.velocidadActual = this.velocidadMinima;
  }

  console.log(this.velocidadActual);
  this.crearAnimacion(this.splinePersonaje, true);
}


//Crea la animación del coche y la cámara
crearAnimacion(splinePersonaje, iniciada) {

  var origen = { t: 0 };
  var fin = { t: 1 };
  var spline = splinePersonaje.clone();

  if(this.animacion){
    this.animacion.stop();
  }

  //Comprobamos si la animación ha sido reiniciada para modificar la velocidad o no
  if(iniciada == true){
    origen.t = this.tActual;
  }

  this.tActual = origen.t;
  //                                               Si la animación se reinicia en un punto avanzado, el tiempo 
  //                                               de recorrido se ajusta para que la sensación de velocidad no cambie
  this.animacion = new Tween.Tween(origen).to(fin, this.velocidadActual*(fin.t-origen.t)).onUpdate(() => {
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
       if (origen.t >= 1.0 ) {
        if(this.velocidadActual > this.velocidadMinima){
          this.velocidadActual *= 0.9; // Aumentar la velocidad un 10%
        }
        this.crearAnimacion(splinePersonaje, false); // Reiniciar la animación con la nueva velocidad
      }
      
      //Guardamos el punto de la animación en el que nos encontramos para poder reiniciar la animación por donde estaba
      //pero con la velocidad modificada (cuando se llame a modificarVelocidad())
      this.tActual = origen.t;
  });
  this.animacion.start();
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

  //Modificamos el peaje para que ahora tenga la barra levantada
  modificarPeaje(){
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

  createGUI (gui,titleGui) {
    // Mostrar la puntuación
    this.scoreDisplay = { score: 0 };
    gui.add(this.scoreDisplay, 'score').name('Puntuación').listen();
  }
  

  //Esta funcion sirve para gestionar todo lo relacionado con las colisiones entre el personaje y los objetos de la escena
  gestionarColisiones(){

    //Asinamos a cada caja un objeto
    this.cajaBidon.setFromObject(this.bidon);
    this.cajaPersonaje.setFromObject(this.personaje);
    this.cajaTrofeo.setFromObject(this.trofeo);
    this.cajaPeaje.setFromObject(this.peaje);
    this.cajaVolante.setFromObject(this.volante);
    this.cajaDRS.setFromObject(this.DRS);
    this.cajaBandera.setFromObject(this.bandera);
    this.cajaCronometro.setFromObject(this.cronometro);
    this.cajaPistola.setFromObject(this.pistola);
    this.cajaZonaMojada.setFromObject(this.zonaMojada);

    //Si el personaje colisiona con un objeto, su velocidad y puntaje se ven afectados
    if(this.cajaPersonaje.intersectsBox(this.cajaPistola) && this.pistolaActiva == true){
      this.remove(this.cajaPistola);
      this.remove(this.pistola);
      this.pistolaActiva = false;
      this.score -= 4;
      this.updateScoreDisplay(this.score, true);
      this.modificarVelocidad(2);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaBidon) && this.bidonActivo == true){
      this.remove(this.cajaBidon);
      this.remove(this.bidon);
      this.bidonActivo = false;
      this.score -= 10;
      this.updateScoreDisplay(this.score, true);
      this.modificarVelocidad(-2);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaCronometro) && this.cronometroActivo == true){
      this.remove(this.cajaCronometro);
      this.remove(this.cronometro);
      this.cronometroActivo = false;
      this.score += 3;
      this.updateScoreDisplay(this.score);

      //El cronometro es el único objeto que reaparece tras cogerlo
      setTimeout(() => {
        this.crearCronometro();
      }, 2000);
      this.modificarVelocidad(1);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaTrofeo) && this.trofeoActivo == true){
      this.remove(this.cajaTrofeo);
      this.remove(this.trofeo);
      this.trofeoActivo = false;
      this.score += 7;
      this.updateScoreDisplay(this.score);
      this.modificarVelocidad(2);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaDRS) && this.DRSActivo == true){
      this.remove(this.cajaDRS);
      this.remove(this.DRS);
      this.DRSActivo = false;
      this.score += 5;
      this.updateScoreDisplay(this.score);
      //Bufo de velocidad temporal 
      this.modificarVelocidad(2);
      setTimeout(() => {
        this.modificarVelocidad(-2);
      }, 5000);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaVolante) && this.volanteActivo == true){

      this.score += 10;
      this.updateScoreDisplay(this.score);
      this.remove(this.cajaVolante);
      this.remove(this.volante);
      this.volanteActivo = false;
      //Coger el volante implica levantar la barra del peaje
      this.modificarPeaje();
      this.modificarVelocidad(2);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaBandera) && this.banderaActivo == true){
      this.remove(this.cajaBandera);
      this.remove(this.bandera);
      this.banderaActivo = false;
      this.score = this.score/2;
      this.updateScoreDisplay(this.score, true);
      this.modificarVelocidad(-2);
    }

    //El peaje solo resta puntaje si no esta levantado
    if(this.cajaPersonaje.intersectsBox(this.cajaPeaje) && this.peaje.levantado == false){
      this.score = 0;
      this.updateScoreDisplay(this.score, true);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaZonaMojada) && this.tieneRueda == false){
      this.modificarVelocidad(-2);
    }

    if(this.cajaPersonaje.intersectsBox(this.cajaRueda)){
      this.tieneRueda = true;
      this.remove(this.rueda);
      this.score += 5;
      this.updateScoreDisplay(this.score);
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
