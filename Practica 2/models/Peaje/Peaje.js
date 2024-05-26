import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

class Peaje extends THREE.Object3D {
  constructor(levantado) {
    super();

    var loader = new THREE.TextureLoader();
    var textura = loader.load('../../models/Peaje/peaje.jpg', (texture) => {
      // Configurar el modo de repetición de la textura
      texture.wrapS = THREE.RepeatWrapping; // O THREE.MirroredRepeatWrapping o THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.RepeatWrapping; // O THREE.MirroredRepeatWrapping o THREE.ClampToEdgeWrapping

      // Configurar el número de repeticiones de la textura
      texture.repeat.set(2, 0.5); // Cambia los valores según tus necesidades

      // Solicitar una actualización de la textura si se cambia el modo de repetición
      texture.needsUpdate = true;
    });

    this.material = new THREE.MeshBasicMaterial({ map: textura, side: THREE.DoubleSide});
    
    var cilindext = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16, 16);
    var cilindextMesh = new THREE.Mesh(cilindext, this.material);
    cilindextMesh.position.y = 0.75;

    if(levantado){
      this.paloMesh = this.peajeSubido();
    }else{
      this.paloMesh = this.peajeBajado();
    }

    this.levantado = levantado;

    this.add(cilindextMesh);
    this.add(this.paloMesh);
  }

  peajeSubido(){ 
   

    var palo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16, 16);
    var paloMesh = new THREE.Mesh(palo, this.material);

    paloMesh.rotateZ(Math.PI/2 + Math.PI/4);
    paloMesh.position.x = 0.90;
    paloMesh.position.y = 2;

    return paloMesh;
  }

  peajeBajado(){
    

    var palo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16, 16);
    var paloMesh = new THREE.Mesh(palo, this.material);

    paloMesh.rotateZ(Math.PI/2);
    paloMesh.position.y = 1.3;
    paloMesh.position.x = 1.20;

    return paloMesh;
  }

  createGUI (gui, titleGui) {
  }

  update () {
    if(this.paloMesh != null){
      if(!this.levantado)
        this.paloMesh.rotation.x += 0.05;
    }
    this.rotation.y += 0.01;
  }
}

export { Peaje };
