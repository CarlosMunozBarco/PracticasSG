import * as THREE from '../../libs/three.module.js'
import { MTLLoader } from '../../libs/MTLLoader.js';
import { OBJLoader } from '../../libs/OBJLoader.js';

class Pistola extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var material = new THREE.MeshBasicMaterial({ color: 0xff00ff, ior: 1.5, roughness: 0.5, metalness: 1});
    var objetoLoader = new OBJLoader();

      objetoLoader.load('./Drill.obj', (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
          }
        });
        object.scale.set(0.01,0.01,0.01);
        object.rotateX(-Math.PI/2);
        this.add(object);
      }, null , null);
    
  }

  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Pistola };
