import * as THREE from '../../libs/three.module.js';
import { CSG } from '../../libs/CSG-v2.js';

class Bomba extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Definición del material.
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000 });
    const material2 = new THREE.MeshBasicMaterial({ color: 0x000000, reflectivity:1, roughness: 1 });
    const esfera = new THREE.SphereGeometry(3);
    const esferaMesh = new THREE.Mesh(esfera, material);
    
    const cilindroMediano = new THREE.CylinderGeometry(1.5, 1.5, 1.5);
    cilindroMediano.translate(0, 3, 0);
    const cilindroMMesh = new THREE.Mesh(cilindroMediano, material2);

    const cilindroPequeno = new THREE.CylinderGeometry(0.25, 0.25, 3);
    cilindroPequeno.rotateZ(-Math.PI/5);
    cilindroPequeno.translate(0.5, 4.5, 0);
    const cilindroPMesh = new THREE.Mesh(cilindroPequeno, material2);

    const csg = new CSG();
    csg.union([cilindroMMesh, cilindroPMesh]);

    const mesh = csg.toMesh(material2);


    mesh.rotateZ(Math.PI/2);
    mesh.userData.tipo = "bomba"; // Asignar userData a la malla
    this.add(esferaMesh);
    this.add(mesh);
  }

  recibeClick() {
    console.log("Bomba ha sido clickeada");
  }
  
  createGUI(gui, titleGui) {
    // Puedes agregar la interfaz gráfica de usuario aquí si es necesario
  }
  
  update() {
    // Método de actualización opcional
  }
}

export { Bomba };
