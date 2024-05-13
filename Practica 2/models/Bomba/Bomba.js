import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

 
class Bomba extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Establece el userData del objeto Bomba
    this.userData.tipo = "bomba";

    // Definición del material.
    var material = new THREE.MeshNormalMaterial();  

    var esfera = new THREE.SphereGeometry(3);
    var esferaMesh = new THREE.Mesh(esfera, material);
    
    var cilindroMediano = new THREE.CylinderGeometry(1.5, 1.5, 1.5);
    cilindroMediano.translate(0, 3, 0);
    var cilindroMMesh = new THREE.Mesh(cilindroMediano, material);

    var cilindroPequeno = new THREE.CylinderGeometry(0.25, 0.25, 3);
    cilindroPequeno.rotateZ(-Math.PI/5);
    cilindroPequeno.translate(0.5, 4.5, 0);
    var cilindroPMesh = new THREE.Mesh(cilindroPequeno, material);

    var csg = new CSG();
    csg.union([esferaMesh, cilindroMMesh]);
    csg.union([cilindroPMesh]);

    var mesh = csg.toMesh(material);

    mesh.rotateZ(Math.PI/2);
    this.add(mesh);
}

  recibeClick() {
    console.log("Bomba ha sido clickeada");
  }
  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Bomba };