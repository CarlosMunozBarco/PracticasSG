import * as THREE from '../../libs/three.module.js'

 
class MyTubo extends THREE.Object3D {
  constructor(radio) {
    super();
    
    
    var pts = this.crearCamino(radio);
    var path = new THREE.CatmullRomCurve3(pts, true);

    var resolucion = 200;
    var radio = 2;
    var segmentosCirculo = 20;

    var geometriaTubo = new THREE.TubeGeometry(path, resolucion, radio, segmentosCirculo, true);
    var materialTubo = new THREE.MeshNormalMaterial();

    var meshTubo = new THREE.Mesh(geometriaTubo, materialTubo);
    //meshTubo.rotateX(90*(Math.PI/180));
    
    this.add(meshTubo);
  }

  obtenerPuntos(radio){
    return this.crearCamino(radio);
  }
  

  crearCamino(radio) {
    var pts = [];
  
    // Creamos los puntos sin rotar
    for (let i = 0; i < 18; i++) {
      const ang = (i / 20) * Math.PI * 2;
      const x = radio * Math.cos(ang);
      const y = radio * Math.sin(ang);
      const punto = new THREE.Vector3(x, y, 0);
      pts.push(punto);
    }
  
    // Rotamos cada punto y lo agregamos a la lista
    for (let i = 0; i < pts.length; i++) {
      pts[i].applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    }
  
    // Creamos el punto adicional para el recorrido del coche
    var recta = pts[pts.length - 1].clone();
    recta.x += 15;
    pts.push(recta);
  
    // Rotamos el punto adicional
    recta.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
  
    // Creamos los puntos adicionales del tubo
    for (let i = 0; i < 18; i++) {
      const ang = (i / 20) * Math.PI * 2;
      const x = radio * Math.cos(ang) + 15;
      const y = radio * Math.sin(ang);
      const punto = new THREE.Vector3(x, y, 15);
      pts.push(punto);
    }
  
    return pts;
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
  }
}

export { MyTubo };
