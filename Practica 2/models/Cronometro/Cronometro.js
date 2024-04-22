import * as THREE from '../../libs/three.module.js'
import { MTLLoader } from '../../libs/MTLLoader.js';
import { OBJLoader } from '../../libs/OBJLoader.js';

class Cronometro extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var materialLoader = new MTLLoader();
    var objetoLoader = new OBJLoader();

    materialLoader.load ('./obj/11751_Watch_v1_L3.mtl', (materials) => {
      objetoLoader.setMaterials(materials);
      objetoLoader.load('./obj/11751_Watch_v1_L3.obj', (object) => {
        object.scale.set(0.1,0.1,0.1);
        object.rotateX(-Math.PI/2);
        this.add(object);
      }, null , null);
    });
  }



  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Cronometro };
