import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

 
class Trofeo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // Definición del material.
    var material = new THREE.MeshNormalMaterial();  
    material.flatShading = true;             // Se le aplica flatShading para que se vean las caras planas.
    material.needsUpdate = false;            // Se fuerza a que se actualice en el renderizado.     

    var box = new THREE.BoxGeometry(1,0.5,1);
    var boxMesh = new THREE.Mesh(box,material);
    boxMesh.position.y = 0.25;

    var shape = new THREE.Shape();
    shape.moveTo(0.4,0);
    shape.lineTo(0.4,0.1);
    shape.lineTo(0.2,0.1);
    shape.lineTo(0.2,0.6);
    shape.quadraticCurveTo(0.4,0.8,0.5,1.3);
    shape.lineTo(0,1.3);
    var points = shape.extractPoints().shape;
    var lathe = new THREE.LatheGeometry(points,64,0,Math.PI*2);
    var latheMesh = new THREE.Mesh(lathe,material);
    latheMesh.position.y = 0.5;

    var cilindro = new THREE.CylinderGeometry(0.05,0.05,1.8,64,64);
    var cilindroMesh = new THREE.Mesh(cilindro,material);
    cilindroMesh.rotateX(Math.PI/2);
    cilindroMesh.position.y = 1.7;

    var toro = new THREE.TorusGeometry(0.95,0.05,32,32);
    var toroMesh = new THREE.Mesh(toro,material);
    toroMesh.rotateY(Math.PI/2);
    toroMesh.position.y = 2;

    var aux = new THREE.BoxGeometry(2,2,2);
    var auxMesh = new THREE.Mesh(aux,material);
    auxMesh.position.y = 2.75;

    var csg = new CSG();
    csg.union([cilindroMesh,toroMesh]);
    csg.subtract([auxMesh]);
    csg.union([latheMesh]);
    

    var mesh = csg.toMesh(material);

    this.add(boxMesh);
    this.add(mesh);

  }



  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Trofeo };
