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
    
    /*****************************TUBO*************************************/
    //Se le pasa radio, altura, numero de vueltas y espacio entre vueltas
    var tubo = new MyTubo(radio);
    this.add(tubo);
    /**********************************************************************/

    /*****************************PERSONAJE************************************/
    var personaje = new Personaje(gui, titleGui);
    personaje.name = 'Personaje';
    this.add(personaje);

    var pts = tubo.obtenerPuntos(radio);
    this.spline = new THREE.CatmullRomCurve3(pts);
    this.segmentos = 100;
    this.binormales = this.spline.computeFrenetFrames(this.segmentos, true).binormals;

    var origen = {t : 0};
    var fin = {t : 1};
    var tiempoDeRecorridoCoche = 20000;

    var animacionPersonaje = new Tween.Tween(origen).to(fin, tiempoDeRecorridoCoche).onUpdate(()=> {
      var posicion = this.spline.getPointAt(origen.t);
      personaje.position.copy(posicion);
      var tangente = this.spline.getTangentAt(origen.t);
      posicion.add(tangente);
      personaje.up = this.binormales[Math.floor(origen.t * this.segmentos)];
      personaje.lookAt(posicion);
    })

    animacionPersonaje.start();

    /****************************************************************************/


    /******************************BOMBA*****************************************/
      var bomba = new Bomba(gui, titleGui);
      this.add(bomba);
      bomba.position.z += 3*radio;
      bomba.scale.set(0.5, 0.5, 0.5);

      var ptsBomba = this.recorridoVolador(bomba);
      this.splineBomba = new THREE.CatmullRomCurve3(ptsBomba);
      this.binormalesBomba = this.splineBomba.computeFrenetFrames(this.segmentos, true).binormals;

      var origen = {t : 0};
      var fin = {t : 1};
      var tiempoDeRecorridoBomba = 10000;

      var animacionBomba = new Tween.Tween(origen).to(fin, tiempoDeRecorridoBomba).onUpdate(()=> {
        var posicion = this.splineBomba.getPointAt(origen.t);
        bomba.position.copy(posicion);
        var tangente = this.splineBomba.getTangentAt(origen.t);
        posicion.add(tangente);
        bomba.up = this.binormalesBomba[Math.floor(origen.t * this.segmentos)];
        bomba.lookAt(posicion);
    })

    animacionBomba.start();
    /****************************************************************************/

    /******************************TUERCA*****************************************/
    var tuerca = new Tuerca(gui, titleGui);
    this.add(tuerca);
    tuerca.position.z += 3*radio;
    tuerca.position.x -=3;

    var ptsTuerca = this.invertirVector(this.recorridoVolador(tuerca));
    this.splineTuerca = new THREE.CatmullRomCurve3(ptsTuerca);
    this.binormalesTuerca = this.splineTuerca.computeFrenetFrames(this.segmentos, true).binormals;

    var origen = {t : 1};
    var fin = {t : 0};
    var tiempoDeRecorridoTuerca = 10000;

    var animacionTuerca = new Tween.Tween(origen).to(fin, tiempoDeRecorridoTuerca).onUpdate(()=> {
      var posicion = this.splineTuerca.getPointAt(origen.t);
      tuerca.position.copy(posicion);
      var tangente = this.splineTuerca.getTangentAt(origen.t);
      posicion.add(tangente);
      tuerca.up = this.binormalesTuerca[Math.floor(origen.t * this.segmentos)];
      tuerca.lookAt(posicion);
    })

  animacionTuerca.start();
  /****************************************************************************/
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
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 1.0,
      sizeY : 1.0,
      sizeZ : 1.0,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.sizeX = 1.0;
        this.guiControls.sizeY = 1.0;
        this.guiControls.sizeZ = 1.0;
        
        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;
        
        this.guiControls.posX = 0.0;
        this.guiControls.posY = 0.0;
        this.guiControls.posZ = 0.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI/2, 0.01).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI/2, 0.01).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.01).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.01).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.01).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.01).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    
    this.position.set (this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
    this.rotation.set (this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
    this.scale.set (this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
    Tween.update();
  }
}

export { PistaMaestra };
