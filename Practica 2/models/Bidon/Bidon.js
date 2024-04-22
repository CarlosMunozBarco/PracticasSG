import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

 
class Bidon extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // Definición del material.
    var material = new THREE.MeshNormalMaterial();  
    material.flatShading = true;             // Se le aplica flatShading para que se vean las caras planas.
    material.needsUpdate = false;            // Se fuerza a que se actualice en el renderizado.     

    var cilindext = new THREE.CylinderGeometry(0.6,0.6,1.7,32,32);
    var cilindextMesh = new THREE.Mesh(cilindext,material);
    cilindextMesh.position.y = 0.85;

    var cilindint = new THREE.CylinderGeometry(0.55,0.55,1.8,32,32);
    var cilindintMesh = new THREE.Mesh(cilindint,material);
    cilindintMesh.position.y = 0.95;

    var toro1 = new THREE.TorusGeometry(0.61,0.01,32,32);
    var toro1Mesh = new THREE.Mesh(toro1,material);
    toro1Mesh.rotateX(Math.PI/2);

    var box = new THREE.BoxGeometry(0.6,2,1.2);
    var boxMesh = new THREE.Mesh(box,material);
    boxMesh.position.y = 1;
    boxMesh.position.x = 0.3;

    var cilindaux = new THREE.CylinderGeometry(0.6,0.6,0.1,64,64);
    var cilindauxMesh = new THREE.Mesh(cilindaux,material);

    var aux = new CSG();
    aux.intersect([cilindauxMesh,boxMesh]);

    var auxMesh = aux.toMesh(material);
    auxMesh.position.y = 1.63;

    

    var csg = new CSG();
    csg.subtract([cilindextMesh,cilindintMesh]);
    toro1Mesh.position.y = 0.85;
    csg.union([toro1Mesh]);
    toro1Mesh.position.y = 1.7;
    csg.union([toro1Mesh]);
    csg.union([auxMesh]);





    var mesh = csg.toMesh(material);

    this.add(mesh);

  }



  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Bidon };
