import { THREE, Project, Scene3D, PhysicsLoader, ExtendedMesh } from "enable3d";
import { BlendingEquation, Vector2 } from "three";
import { ImprovedNoise } from '../modules/ImprovedNoise.js';

class MainScene extends Scene3D {
  constructor() {
    super("MainScene");
  }

  async init() {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async preload() {}

  modifyMesh(g,hd) {
    const positionAttribute = g.getAttribute("position");
    let nodes = positionAttribute.count;
    const v = new THREE.Vector3();
    console.log("number of nodes: ", nodes);
    console.log("number of noise points: ", hd.length)
    for (let i = 0; i < hd.length; i++) {
      v.fromBufferAttribute(positionAttribute, i); // read vertex
      v.z = ~~hd[i];
      positionAttribute.setXYZ(i, v.x, v.y, v.z); // write coordinates
    }

    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
  }

  generateHeight(width, height, p) {
    let seed = Math.PI / 4;
    let FloorRandom =  function () {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const size = width * height,
      data = new Uint8Array(size);
    const perlin = new ImprovedNoise(),
      z = FloorRandom() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width,
          y = ~~(i / width);
        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
      }

      quality *= 5;
    }

    return data;
  }

  async create() {
    let { camera, lights, orbitalControls } = await this.warpSpeed("-ground");

    // this.physics.debug.enable();

    const planewidth = 500;
    const planeheight = 500;
    const widthSegments = 10;
    const heightSegments = 10;

    


    const planeTexture = await this.load.texture("/static/rock.webp");

    const geometry = new THREE.PlaneBufferGeometry(
      planewidth,
      planeheight,
      widthSegments,
      heightSegments
    );
    let points = geometry.getAttribute("position").count;
    let heightData = this.generateHeight(widthSegments-1, heightSegments-1, points);
    this.modifyMesh(geometry, heightData);

    const material = new THREE.MeshStandardMaterial({
      color: 0x0000ff,
      //  map: planeTexture,
      // displacementMap: planeTexture,
      // displacementScale: 1,
      wireframe: true,
      side: THREE.BackSide,
    });

    const plane = new ExtendedMesh(geometry, material);
    plane.position.set(0, -0.5, 0);
    plane.rotation.x = Math.PI / 2;
    plane.castShadow = true;
    plane.receiveShadow = true;
    this.scene.add(plane);

    this.physics.add.existing(plane, {
      shape: "concaveMesh",
      mass: 0,
      collisionFlags: 1,
    });

    const sea = new ExtendedMesh(
      new THREE.PlaneGeometry(500, 500, 50, 50),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    sea.position.set(0, -40, 0);
    sea.rotation.x = -Math.PI / 2;
    sea.castShadow = true;
    sea.receiveShadow = true;
    // this.scene.add(sea);

    // position camera
    this.camera.position.set(5, 15, 50);

    // pink box (with physics)
    this.phyicsbox = this.physics.add.box(
      { y: 20 },
      { lambert: { color: "hotpink" } }
    );
    this.phyicsbox2 = this.physics.add.box(
      { y: 10, z: 0, x: 0 },
      { lambert: { color: "yellow" } }
    );
    // this.phyicsbox.body.applyForceX(2);
    //this.haveSomeFun();
  }

  update() {
    // this.staticbox.rotation.x += 1;
    // this.phyicsbox.rotation.y += 1;
  }
}

// set your project configs
const config = { scenes: [MainScene], antialias: true };

// load the ammo.js file from the /lib folder and start the project
PhysicsLoader("/lib", () => new Project(config));
