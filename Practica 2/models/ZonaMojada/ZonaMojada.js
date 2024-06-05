import * as THREE from '../../libs/three.module.js'
 
class ZonaMojada extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    this.userData.tipo = "zonaMojada";

    const geometry = new THREE.CylinderGeometry(2.1, 2.1, 2.5, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.z = -Math.PI / 2;
    this.add(cylinder);
  }


  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { ZonaMojada };
