import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

 
class Peaje extends THREE.Object3D {
  constructor(levantado) {
    super();
    
    
    if(levantado){
      var mesh = this.peajeSubido();
    }else{
      var mesh = this.peajeBajado();
    }

    this.levantado = levantado;

    this.add(mesh);

  }

  peajeSubido(){
    // Definición del material.
    var material = new THREE.MeshNormalMaterial();  

    var cilindext = new THREE.CylinderGeometry(0.1,0.1,1.5,16,16);
    var cilindextMesh = new THREE.Mesh(cilindext,material);

    var palo = new THREE.BoxGeometry(2.5, 0.2, 0.1);
    var paloMesh = new THREE.Mesh(palo, material);

    
    paloMesh.rotateZ(45*(Math.PI/180));
    paloMesh.position.x = 0.90;

    cilindextMesh.position.y = 0.75;
    paloMesh.position.y = 2;
    

    
    var csg = new CSG();
    csg.union([cilindextMesh, paloMesh]);

    var mesh = csg.toMesh(material);

    return mesh;

  }

  peajeBajado(){
    // Definición del material.
    var material = new THREE.MeshNormalMaterial();  

    var cilindext = new THREE.CylinderGeometry(0.1,0.1,1.5,16,16);
    var cilindextMesh = new THREE.Mesh(cilindext,material);

    var palo = new THREE.BoxGeometry(2.5, 0.2, 0.1);
    var paloMesh = new THREE.Mesh(palo, material);

    cilindextMesh.position.y = 0.75;
    paloMesh.position.y = 1.3;
    paloMesh.position.x = 1.20;

    
    var csg = new CSG();
    csg.union([cilindextMesh, paloMesh]);

    var mesh = csg.toMesh(material);

    return mesh;
  }



  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Peaje };
