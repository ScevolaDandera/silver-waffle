import { Project, Scene3D, PhysicsLoader } from 'enable3d'

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
     const { camera, ground, lights, orbitalControls } = await this.warpSpeed()

    // enable physics debug
    this.physics.debug.enable()

    // position camera
    this.camera.position.set(13, 10, 13)
    // blue box (without physics)
   this.staticbox = this.physics.add.box({ y: 5 }, { lambert: { color: 'deepskyblue' } })

    // pink box (with physics)
   this.phyicsbox =  this.physics.add.box({ y: 0 }, { lambert: { color: 'hotpink' } })
   this.phyicsbox2 =  this.physics.add.box({ z: 0, x:-10 }, { lambert: { color: 'yellow' } })
   this.phyicsbox2.body.applyForceX(20);
  }

  update() {
    this.staticbox.rotation.x += 1
    this.phyicsbox.rotation.y += 1
  }
}

// set your project configs
const config = { scenes: [MainScene], antialias: true }

// load the ammo.js file from the /lib folder and start the project
PhysicsLoader('/lib', () => new Project(config))
