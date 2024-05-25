import * as THREE from '../../libs/three.module.js'
import { CSG } from '../../libs/CSG-v2.js'

 
class Trofeo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);
    
    // Definición del material.
    this.materialTrofeo = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.6, metalness: 1 });
    var loader = new THREE.TextureLoader();
    var textura = loader.load('../../models/Trofeo/base.jpg');
    var materialBase = new THREE.MeshBasicMaterial({ map: textura });

    var box = new THREE.BoxGeometry(1,0.5,1);
    var boxMesh = new THREE.Mesh(box,materialBase);
    var uno = this.crearUno();
    
    boxMesh.position.y = 0.25;

    var shape = new THREE.Shape();
    shape.moveTo(0.4,0);
    shape.lineTo(0.4,0.1);
    shape.lineTo(0.2,0.1);
    shape.lineTo(0.2,0.6);
    shape.quadraticCurveTo(0.4,0.8,0.5,1.3);
    shape.lineTo(0,1.3);
    var points = shape.extractPoints().shape;
    var lathe = new THREE.LatheGeometry(points,16,0,Math.PI*2);
    var latheMesh = new THREE.Mesh(lathe,this.materialTrofeo);
    latheMesh.position.y = 0.5;

    var cilindro = new THREE.CylinderGeometry(0.05,0.05,1.8,16,16);
    var cilindroMesh = new THREE.Mesh(cilindro,this.materialTrofeo);
    cilindroMesh.rotateX(Math.PI/2);
    cilindroMesh.position.y = 1.7;

    var toro = new THREE.TorusGeometry(0.95,0.05,16,16);
    var toroMesh = new THREE.Mesh(toro,this.materialTrofeo);
    toroMesh.rotateY(Math.PI/2);
    toroMesh.position.y = 2;

    var aux = new THREE.BoxGeometry(2,2,2);
    var auxMesh = new THREE.Mesh(aux,this.materialTrofeo);
    auxMesh.position.y = 2.75;

    var csg = new CSG();
    
    csg.union([cilindroMesh,toroMesh]);
    csg.subtract([auxMesh]);
    csg.union([latheMesh]);
    

    var mesh = csg.toMesh(this.materialTrofeo);
    this.add(mesh);
    this.add(boxMesh);
    this.add(uno);


  } 

  crearUno(){
    var shape = new THREE.Shape();

    shape.moveTo(0, 0);
    
    shape.lineTo(0, 1.3);
    
    shape.lineTo(0.15, 1.3);
    
    shape.lineTo(0.5, 0.7);
    
    shape.lineTo(0.4, 0.7);

    shape.lineTo(0.15, 1.1)
    shape.lineTo(0.15, 0);

    // Definir los parámetros de la extrusión
    const options1 = {
        steps: 2,
        depth: 0.1,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 1
    };

    var geometry = new THREE.ExtrudeGeometry(shape, options1);

    // Crear el material
    var material = new THREE.MeshNormalMaterial();

    // Crear la malla (mesh)
    var mesh = new THREE.Mesh(geometry, this.materialTrofeo);  

    mesh.rotateY(-90*Math.PI/180);
    mesh.position.x += 0.55;
    mesh.scale.set(0.5,0.38,0.5);
    mesh.position.z -= 0.05;
    
    return mesh;
  }



  
  createGUI (gui,titleGui) {
  }
  
  update () {
  }
}

export { Trofeo };
