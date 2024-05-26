import * as THREE from '../../libs/three.module.js';


class DRS extends THREE.Object3D {
  constructor(gui, tituloGui) {
    super();
    
    // Crear la interfaz gráfica (GUI)
    this.crearGUI(gui, tituloGui);

    // Materiales para las letras y el marco
    const materialLetras = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });

    // Crear geometrías para las letras "D", "R" y "S"
    const geometriaD = this.crearGeometriaLetraD();
    const geometriaR = this.crearGeometriaLetraR();
    const geometriaS = this.crearGeometriaLetraS();

    const mallaD = new THREE.Mesh(geometriaD, materialLetras);
    const mallaR = new THREE.Mesh(geometriaR, materialLetras);
    const mallaS = new THREE.Mesh(geometriaS, materialLetras);

    mallaD.position.set(-1.3, 0, 0);
    mallaR.position.set(-0.5, 0, 0);
    mallaS.position.set(0.4, 0.2, 0);
    mallaS.scale.set(0.8, 0.8, 0.8);

    // Añadir las letras al objeto
    this.add(mallaD);
    this.add(mallaR);
    this.add(mallaS);

    // Crear geometría para el marco
    const geometriaMarco = new THREE.BoxGeometry(2.5, 1.5, 0.1);
    // Material para el marco
    const materialMarco = new THREE.MeshBasicMaterial({ color: 0x000000 });
    // Crear malla para el marco
    const mallaMarco = new THREE.Mesh(geometriaMarco, materialMarco);
    // Posicionar el marco
    mallaMarco.position.set(-0.25, 0.5, -0.05);
    // Añadir el marco al objeto
    this.add(mallaMarco);
  }

  crearGeometriaLetraD() {
    const forma = new THREE.Shape();
    forma.moveTo(0, 0);
    forma.lineTo(0.2, 0);
    forma.quadraticCurveTo(0.5, 0, 0.5, 0.5);
    forma.quadraticCurveTo(0.5, 1, 0.2, 1);
    forma.lineTo(0, 1);
    forma.lineTo(0, 0);
    
    const agujero = new THREE.Path();
    agujero.moveTo(0.15, 0.2);
    agujero.quadraticCurveTo(0.35, 0.2, 0.35, 0.5);
    agujero.quadraticCurveTo(0.35, 0.8, 0.15, 0.8);
    agujero.lineTo(0.15, 0.2);
    forma.holes.push(agujero);
    
    return new THREE.ExtrudeGeometry(forma, { depth: 0.1, bevelEnabled: false });
  }

  crearGeometriaLetraR() {
    const forma = new THREE.Shape();
    forma.moveTo(0, 0);
    forma.lineTo(0.3, 0);
    forma.quadraticCurveTo(0.6, 0, 0.3, 0.6);
    forma.quadraticCurveTo(0.6, 1, 0.3, 1);
    forma.lineTo(0, 1);
    forma.lineTo(0, 0);

    // forma.moveTo(0.3, 0.5);
    // forma.quadraticCurveTo(0.5, 0.5, 0.5, 0.75);
    // forma.quadraticCurveTo(0.5, 1, 0.3, 1);

    const agujero = new THREE.Path();
    agujero.moveTo(0.1, 0.6);
    agujero.quadraticCurveTo(0.3, 0.6, 0.3, 0.75);
    agujero.quadraticCurveTo(0.3, 0.9, 0.1, 0.9);
    agujero.lineTo(0.1, 0.6);
    forma.holes.push(agujero);

    const agujero2 = new THREE.Path();
    agujero2.moveTo(0.1, 0);
    agujero2.lineTo(0.1, 0.4);
    agujero.lineTo(0.3, 0.4); 
    agujero2.quadraticCurveTo(0.1, 0.5, 0.3, 0.4);
    agujero2.lineTo(0.3, 0);
    agujero2.lineTo(0.1, 0);
    forma.holes.push(agujero2);


    return new THREE.ExtrudeGeometry(forma, { depth: 0.1, bevelEnabled: false });
  }


  crearGeometriaLetraS() {
    const forma = new THREE.Shape();
    forma.moveTo(0, 0.5);
    forma.absarc(0.25, 0.6, 0.4, Math.PI+ Math.PI/2, 0, true);
    forma.absarc(0.25, 0.6, 0.2, 0, Math.PI + Math.PI/2, 0, false);
    forma.absarc(0,0.07,0.4, Math.PI/2, -Math.PI, true);
    forma.absarc(0,0.07,0.2, -Math.PI, Math.PI/4, false);

    
    
    return new THREE.ExtrudeGeometry(forma, { depth: 0.1, bevelEnabled: false });
  }




















  crearGUI(gui, tituloGui) {
    // Configuración de la interfaz gráfica (GUI) si es necesario
  }
  
  update() {
    // No se necesita animación en este caso
  }
}

export { DRS };
