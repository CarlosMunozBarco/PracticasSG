import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
 
class Tuerca extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = false;


    var figura = new THREE.Shape();
    figura.moveTo(0.4,0);
    figura.lineTo(0.4,0.05);
    figura.lineTo(0.41,0.05);
    figura.lineTo(0.41,0.06);
    figura.lineTo(0.4,0.06);
    figura.lineTo(0.4,0.09);
    figura.lineTo(0.41,0.09);
    figura.lineTo(0.41,0.10);
    figura.lineTo(0.4,0.10);
    figura.lineTo(0.4,0.13);
    figura.lineTo(0.41,0.13);
    figura.lineTo(0.41,0.14);
    figura.lineTo(0.4,0.14);
    figura.lineTo(0.4,0.17);
    figura.lineTo(0.41,0.17);
    figura.lineTo(0.41,0.18);
    figura.lineTo(0.4,0.18);
    figura.lineTo(0.4,0.21);
    figura.lineTo(0.41,0.21);
    figura.lineTo(0.41,0.22);
    figura.lineTo(0.4,0.22);
    figura.lineTo(0.4,0.25);
    figura.lineTo(0.41,0.25);
    figura.lineTo(0.41,0.26);
    figura.lineTo(0.4,0.26);
    figura.lineTo(0.4,0.29);
    figura.lineTo(0.41,0.29);
    figura.lineTo(0.41,0.30);
    figura.lineTo(0.4,0.30);
    figura.lineTo(0.4,0.33);
    figura.lineTo(0.41,0.33);
    figura.lineTo(0.41,0.34);
    figura.lineTo(0.4,0.34);
    figura.lineTo(0.4,0.37);
    figura.lineTo(0.41,0.37);
    figura.lineTo(0.41,0.38);
    figura.lineTo(0.4,0.38);
    figura.lineTo(0.4,0.41);
    figura.lineTo(0.41,0.41);
    figura.lineTo(0.41,0.42);
    figura.lineTo(0.4,0.42);
    figura.lineTo(0.4,0.45);
    figura.lineTo(0.41,0.45);
    figura.lineTo(0.41,0.46);
    figura.lineTo(0.4,0.46);
    figura.lineTo(0.4,0.7);


    var points = figura.extractPoints().shape;
    var interior = new THREE.LatheGeometry(points, 64, 0, Math.PI*2);
    var interiorMesh = new THREE.Mesh(interior, material);
    interiorMesh.position.y = -0.1;

    var sphere = new THREE.SphereGeometry(0.99, 32, 64);
    var sphereMesh = new THREE.Mesh(sphere, material);


    var hexagon = new THREE.CylinderGeometry(1,1,0.7,6);
    var hexagonMesh = new THREE.Mesh(hexagon, material);


    var csg = new CSG();
    csg.intersect([hexagonMesh, sphereMesh]);
    csg.subtract([interiorMesh]);



    var mesh = csg.toMesh(material);


  
    this.add(mesh);

    // OPERACIONES DE CSG:
    // union: une los objetos.
    // subtract: resta el segundo objeto del primero.
    // intersect: intersección de los objetos.
    // toMesh: devuelve un mesh a partir de la operación.
    // merge: fusiona los objetos.
    // toGeometry: devuelve una geometría a partir de la operación.
    // ClipTo: corta el objeto con otro.
    // Inverse: invierte el objeto.
    // Subdivide: subdivide el objeto.
  }


  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Tuerca };