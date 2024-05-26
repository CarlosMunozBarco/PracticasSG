import * as THREE from '../../libs/three.module.js';
import { CSG } from '../../libs/CSG-v2.js';

class Volante extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    
    this.createGUI(gui, titleGui);
    
    // Definición del material.
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    // Parte exterior del volante (anillo)
    var anilloExterior = new THREE.TorusGeometry(1, 0.1, 16, 16);
    var anilloExteriorMesh = new THREE.Mesh(anilloExterior, material);
    anilloExteriorMesh.rotation.x = Math.PI / 2;

    // Centro del volante
    var centerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    var centerMesh = new THREE.Mesh(centerGeometry, material);
    centerMesh.position.y = 0.05;
    centerMesh.rotation.x = Math.PI / 2;
    centerMesh.rotateX(Math.PI/2);

    // Brazos del volante
    var armGeometry = new THREE.BoxGeometry(0.1, 0.05, 1);
    
    var arm1 = new THREE.Mesh(armGeometry, material);
    arm1.position.set(0, 0.05, 0.5);
    
    var arm2 = new THREE.Mesh(armGeometry, material);
    arm2.rotateY(-Math.PI/4);
    arm2.rotation.z = 2 * Math.PI / 3;
    arm2.position.x += 0.33;
    arm2.position.z -= 0.35;

    var arm3 = new THREE.Mesh(armGeometry, material);
    arm3.rotateY(Math.PI/4);
    arm3.rotation.z = 2 * Math.PI / 3;
    arm3.position.x -= 0.33;
    arm3.position.z -= 0.35;


    // Unión de los brazos y el anillo exterior con CSG
    var csg = new CSG();
    csg.union([anilloExteriorMesh, arm1, arm2, arm3, centerMesh]);
    
    var mesh = csg.toMesh();

    mesh.rotateX(Math.PI/2);
    mesh.position.y += 1.3;
    this.add(mesh);
  }
  
  createGUI(gui, titleGui) {
    // Aquí puedes añadir elementos de la interfaz gráfica si es necesario.
  }
  
  update() {
    // Aquí puedes añadir lógica de actualización si es necesario.
  }
}

export { Volante };
