import * as THREE from '../../libs/three.module.js';
import { CSG } from '../../libs/CSG-v2.js';

class BanderaNegra extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);
    
    // Definición del material.
    var materialBandera = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1, side: THREE.DoubleSide });
    var materialPalo = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.5 });

    // Crear el cilindro (mástil de la bandera)
    var cilindro = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 30);
    var cilindroMesh = new THREE.Mesh(cilindro, materialPalo);

    // Crear la geometría de la bandera
    var banderaGeometry = new THREE.PlaneGeometry(1, 0.75, 20, 20);

    // Aplicar deformación sinusoidal a los vértices de la bandera
    const vertices = banderaGeometry.attributes.position.array;
    const widthSegments = banderaGeometry.parameters.widthSegments;
    const heightSegments = banderaGeometry.parameters.heightSegments;

    for (let i = 0; i <= widthSegments; i++) {
      for (let j = 0; j <= heightSegments; j++) {
        const index = (i * (heightSegments + 1) + j) * 3;
        const x = vertices[index];
        const y = vertices[index + 1];
        const z = Math.sin(x * 5) * 0.05; // Ajustar la frecuencia y amplitud de la onda
        vertices[index + 2] = z;
      }
    }

    banderaGeometry.attributes.position.needsUpdate = true;
    banderaGeometry.computeVertexNormals();

    var banderaMesh = new THREE.Mesh(banderaGeometry, materialBandera);
    banderaMesh.position.set(0.49, 0.375, 0.03);  // Ajustar posición para estar pegada al cilindro


    this.add(cilindroMesh);
    this.add(banderaMesh);
  }

  createGUI(gui, titleGui) {
    // Configuración de la interfaz gráfica (GUI) si es necesario
  }
  
  update() {
    // No se necesita animación en este caso
  }
}

export { BanderaNegra };