import { THREE, Project, Scene3D, PhysicsLoader, ThirdDimension, ExtendedMesh } from 'enable3d'

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
    // set up scene (light, ground, grid, sky, orbitControls)
   let { camera, lights, orbitalControls } = await this.warpSpeed('-ground')
  //     let { camera, lights, ground, orbitalControls } = await this.warpSpeed()
  // console.log(ground);
   this.physics.debug.enable();
  
     const planeTexture = await this.load.texture(
      "/static/rock.webp"
    );

    const heightmap = await this.load.texture(
      "/static/heightmap.png"
    );




    //
    const geometry = new THREE.PlaneBufferGeometry( 20, 20, 10, 10);
    const material = new THREE.MeshStandardMaterial( {
     map: planeTexture,
   //  displacementMap: heightmap,
  //   displacementScale: 4
   //  wireframe: true
    //  alphaMap: alphamap,
    // side: THREE.DoubleSide,
      // transparent: true, 
      // depthTest: false
  } );
    const plane = this.heightMap.add(heightmap);
 //   const plane = new ExtendedMesh(geometry, material)
    plane.material = material;
    plane.geometry = geometry;
    plane.position.set(0, 0, 0)
   plane.rotation.x =  -Math.PI / 2;
    this.scene.add(plane)
    this.physics.add.existing(plane, { shape: 'convex', mass: 0, collisionFlags:2})


    // position camera
    this.camera.position.set(5, 15, 50)

    // pink box (with physics)
   this.phyicsbox =  this.physics.add.box({ y: 10 }, { lambert: { color: 'hotpink' } })
   this.phyicsbox2 =  this.physics.add.box({ y: 20, z: 0, x:5 }, { lambert: { color: 'yellow' } })
   this.phyicsbox2.body.applyForceX(1);
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
