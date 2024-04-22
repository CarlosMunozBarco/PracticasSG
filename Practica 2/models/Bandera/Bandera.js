import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

 
class Bandera extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // Definición del material.
    var material = new THREE.MeshNormalMaterial();  
    material.flatShading = true;             // Se le aplica flatShading para que se vean las caras planas.
    material.needsUpdate = false;            // Se fuerza a que se actualice en el renderizado.     

    var cilindro = new THREE.CylinderGeometry(0.02,0.02,1.5,30);
    var cilindroMesh = new THREE.Mesh(cilindro,material);

    // Crear la geometría de la bandera
    var banderaShape = new THREE.Shape();
    banderaShape.moveTo(0.02,0);
    banderaShape.lineTo(1, 0);
    banderaShape.lineTo(1, 0.75);
    banderaShape.lineTo(0, 0.75);
    banderaShape.lineTo(0, 0);

    var extrudeSettings = {
      steps: 10,
      depth: 0.01,
      bevelEnabled: false
    };

    var banderaGeometry = new THREE.ExtrudeGeometry(banderaShape, extrudeSettings);
    var banderaMesh = new THREE.Mesh(banderaGeometry, material);

    

    this.add(cilindroMesh);
    this.add(banderaMesh);
  }



  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Bandera };
