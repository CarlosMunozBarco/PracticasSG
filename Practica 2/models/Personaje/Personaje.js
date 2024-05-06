import * as THREE from '../../libs/three.module.js'
import { MTLLoader } from '../../libs/MTLLoader.js';
import { OBJLoader } from '../../libs/OBJLoader.js';

 
class Personaje extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    var materialLoader = new MTLLoader();
    var objetoLoader = new OBJLoader();

    materialLoader.load ('../../models/Personaje/Formula_1_mesh.mtl', (materials) => {
      objetoLoader.setMaterials(materials);
      objetoLoader.load('../../models/Personaje/Formula_1_mesh.obj', (object) => {
        object.scale.set(0.007,0.007,0.007);
        this.add(object);
      }, null , null);
    });
  }

  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Personaje };
