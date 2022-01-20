import { THREE, Project, Scene3D, PhysicsLoader, ExtendedMesh } from 'enable3d'


class MainScene extends Scene3D {
  constructor() {
    super('MainScene')
  }

  async init() {
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  async preload() {
    // preload your assets here
  }

  async create() {
    // set up scene (light, grid, sky, orbitControls)
   let { camera, lights, orbitalControls } = await this.warpSpeed('-ground')
  //this.physics.debug.enable();
  
   
   const planeTexture = await this.load.texture("/static/rock.webp");
    const heightmap = await this.load.texture("/static/heightmap.png");
    const geometry = new THREE.PlaneBufferGeometry( 100, 100, 100, 100);
//
const positionAttribute = geometry.getAttribute( 'position' );
  const vertex = new THREE.Vector3();
  for ( let i = 0; i < positionAttribute.count; i++ ) {
  let t = vertex.fromBufferAttribute( positionAttribute, i ); // read vertex
// do something with vertex

//vertex.x = Math.random() * (20 - -10) + -10;
//vertex.y = Math.random() * (20 - -10) + -10;
vertex.z = Math.random() * (1 - -1) + -1;

positionAttribute.setXYZ( i, vertex.x, vertex.y, vertex.z ); // write coordinates
  }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial( {
     map: planeTexture,
    //  displacementMap: heightmap,
    //  displacementScale: 4,
   //  wireframe: true
      });
      console.log(material.displacementMap);
    const plane = new ExtendedMesh(geometry, material)
    plane.position.set(0, 0, 0)
    plane.rotation.x =  -Math.PI / 2;
    plane.castShadow = true;
    plane.receiveShadow = true;
    this.scene.add(plane)
 


    this.physics.add.existing(plane, { shape: 'concaveMesh', mass: 0, collisionFlags:1})

    // position camera
    this.camera.position.set(5, 15, 50)

    // pink box (with physics)
   this.phyicsbox =  this.physics.add.box({ y: 20 }, { lambert: { color: 'hotpink' } })
   this.phyicsbox2 =  this.physics.add.box({ y: 10, z: 0, x:0 }, { lambert: { color: 'yellow' } })
   this.phyicsbox2.body.applyForceX(1);
   this.haveSomeFun();
  }






  update() {
    // this.staticbox.rotation.x += 1;
    // this.phyicsbox.rotation.y += 1;
  }
}

// set your project configs
const config = { scenes: [MainScene], antialias: true }

// load the ammo.js file from the /lib folder and start the project
PhysicsLoader('/lib', () => new Project(config))
