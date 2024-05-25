import * as THREE from '../../libs/three.module.js';

class MyTubo extends THREE.Object3D {
  constructor(radio) {
    super();

    var pts = this.crearCamino(radio);
    var path = new THREE.CatmullRomCurve3(pts, true);

    var resolucion = 200;
    var radio = 2;
    var segmentosCirculo = 20;

    var geometriaTubo = new THREE.TubeGeometry(path, resolucion, radio, segmentosCirculo, true);

    var loader = new THREE.TextureLoader();
    var textura = loader.load('../../models/Tubo/carretera.jpg', (texture) => {
      // Configurar el modo de repetición de la textura
      texture.wrapS = THREE.RepeatWrapping; // O THREE.MirroredRepeatWrapping o THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.RepeatWrapping; // O THREE.MirroredRepeatWrapping o THREE.ClampToEdgeWrapping

      // Configurar el número de repeticiones de la textura
      texture.repeat.set(30, 2); // Cambia los valores según tus necesidades

      // Solicitar una actualización de la textura si se cambia el modo de repetición
      texture.needsUpdate = true;
    });

    var material = new THREE.MeshBasicMaterial({ map: textura });

    var meshTubo = new THREE.Mesh(geometriaTubo, material);

    this.add(meshTubo);
  }

  obtenerPuntos(radio) {
    return this.crearCamino(radio);
  }

  crearCamino(radio) {
    const shape = new THREE.Shape();
    shape.moveTo(-radio, radio);
    shape.quadraticCurveTo(0, 0, radio, radio);
    shape.lineTo(radio * 3, radio);
    shape.lineTo(radio * 3, radio * 2);
    shape.lineTo(radio, radio * 2);
    shape.quadraticCurveTo(0, 3 * radio, -radio, 2 * radio);
    shape.lineTo(-radio * 3, radio * 2);
    shape.lineTo(-radio * 3, radio);
    shape.lineTo(-radio, radio);

    // Extracción de los puntos del Shape
    const puntosExtruidos = shape.getPoints();
    const puntos = puntosExtruidos.map(punto => new THREE.Vector3(punto.x, 0, punto.y)); // Mantener los puntos en el plano xz

    return puntos;
  }

  createGUI(gui, titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX: 1.0,
      sizeY: 1.0,
      sizeZ: 1.0,

      rotX: 0.0,
      rotY: 0.0,
      rotZ: 0.0,

      posX: 0.0,
      posY: 0.0,
      posZ: 0.0,

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset: () => {
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
    var folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add(this.guiControls, 'sizeX', 0.1, 5.0, 0.01).name('Tamaño X : ').listen();
    folder.add(this.guiControls, 'sizeY', 0.1, 5.0, 0.01).name('Tamaño Y : ').listen();
    folder.add(this.guiControls, 'sizeZ', 0.1, 5.0, 0.01).name('Tamaño Z : ').listen();

    folder.add(this.guiControls, 'rotX', 0.0, Math.PI / 2, 0.01).name('Rotación X : ').listen();
    folder.add(this.guiControls, 'rotY', 0.0, Math.PI / 2, 0.01).name('Rotación Y : ').listen();
    folder.add(this.guiControls, 'rotZ', 0.0, Math.PI / 2, 0.01).name('Rotación Z : ').listen();

    folder.add(this.guiControls, 'posX', -20.0, 20.0, 0.01).name('Posición X : ').listen();
    folder.add(this.guiControls, 'posY', 0.0, 10.0, 0.01).name('Posición Y : ').listen();
    folder.add(this.guiControls, 'posZ', -20.0, 20.0, 0.01).name('Posición Z : ').listen();

    folder.add(this.guiControls, 'reset').name('[ Reset ]');
  }

  update() {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación

    this.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);
    this.rotation.set(this.guiControls.rotX, this.guiControls.rotY, this.guiControls.rotZ);
    this.scale.set(this.guiControls.sizeX, this.guiControls.sizeY, this.guiControls.sizeZ);
  }
}

export { MyTubo };
