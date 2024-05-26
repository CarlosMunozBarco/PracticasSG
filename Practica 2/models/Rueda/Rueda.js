import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

 
class Rueda extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    

    var material = new THREE.MeshBasicMaterial({ color: 0x333333 });
    var cilindroExt = new THREE.CylinderGeometry(1, 1, 0.5, 20);
    var cilindroInt = new THREE.CylinderGeometry(0.5, 0.5, 1, 20);
    var cilindroExtMesh = new THREE.Mesh(cilindroExt, material);
    var cilindroIntMesh = new THREE.Mesh(cilindroInt, material);

    cilindroIntMesh.position.set(0,0.25,0);

    var csg = new CSG();
    csg.subtract([cilindroExtMesh, cilindroIntMesh]);
    var mesh = csg.toMesh(material);
    this.add(mesh);
  }



  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Rueda };
