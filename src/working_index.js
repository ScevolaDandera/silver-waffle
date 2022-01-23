import { THREE, Project, Scene3D, PhysicsLoader, ExtendedMesh } from "enable3d";
import { BlendingEquation } from "three";

class MainScene extends Scene3D {
  constructor() {
    super("MainScene");
  }

  async init() {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async preload() {
    // preload your assets here
    // messing with texture
    //  const loader = new THREE.TextureLoader();
    // const loadimage = await loader.load("/static/grayscale.png", (texture) => {
    //https://jsfiddle.net/e4Lr5xzp/1/
    //http://www.adrianboeing.com/demoscene/test/particleimage/canvas_particles_image.html
    //  this.imagedata = this.getImageData(texture.image);
    //  });
    //end of texture messing
  }

  modifyMesh(g, zvertex) {
    const positionAttribute = g.getAttribute("position");
    const vertex = new THREE.Vector3();
    //   console.log(zvertex);
    //   console.log(positionAttribute.count);
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i); // read vertex
      // do something with vertex
      // vertex.x = Math.random() * (20 - -10) + -10;
      // vertex.y = Math.random() * (20 - -10) + -10;

      vertex.z = zvertex[i];

      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z); // write coordinates
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
  }

  createNoise(nodes) {
    let grid = [];
    for (let i = 0; i <= nodes; i++) {
      let v = Math.random() * (1 - -1) + -1;
      grid.push(v);
    }
    return grid;
  }

  async create() {
    let { camera, lights, orbitalControls } = await this.warpSpeed("-ground");
    this.physics.debug.enable();

    // const bumpimg = await this.load.texture("/static/grayscale.png");
    const widthSegments = 10;
    const heightSegments = 10;

    //  const planeTexture = await this.load.texture("/static/rock.webp");
    const planeTexture = await this.load.texture("/static/heightmap.png");

    const geometry = new THREE.PlaneBufferGeometry(
      100,
      100,
      widthSegments,
      heightSegments
    );
    const totalPoints = geometry.getAttribute("position").count;
    const zvertex = this.createNoise(totalPoints);
    this.modifyMesh(geometry, zvertex);

    const material = new THREE.MeshStandardMaterial({
      color: 0x0000ff,
      // map: planeTexture,
      // displacementMap: heightmap,
      // displacementScale: 8,
      wireframe: true,
    });

    const plane = new ExtendedMesh(geometry, material);
    plane.position.set(0, 0, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.castShadow = true;
    plane.receiveShadow = true;
    this.scene.add(plane);

    this.physics.add.existing(plane, {
      shape: "concaveMesh",
      mass: 0,
      collisionFlags: 1,
    });

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
    this.phyicsbox2.body.applyForceX(1);
    this.haveSomeFun();
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
