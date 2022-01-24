import { THREE, Project, Scene3D, PhysicsLoader, ExtendedMesh } from "enable3d";
import { BlendingEquation, Vector2 } from "three";

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

  sat(x) {
    return Math.min(Math.max(x, 0.0), 1.0);
  }

  modifyMesh(g) {
    const positionAttribute = g.getAttribute("position");
    let nodes = positionAttribute.count;
    function createNoise(nodes) {
      let gridata = [];
      for (let i = 0; i <= nodes; i++) {
        let v = Math.random() * (0 - -1) + -1;
        gridata.push(v);
      }
      return gridata;
    }
    let grid = createNoise(nodes);


    const v = new THREE.Vector3();

    for (let i = 0; i < nodes; i++) {
      v.fromBufferAttribute(positionAttribute, i); // read vertex
        let dist = new THREE.Vector2(v.x, v.y).distanceTo(new THREE.Vector2(0,0));
        let h = this.sat(dist / 250.0) * 50;
        v.z = h;

              if(v.x == 250 || v.y == 250 || v.x == -250 || v.y == -250) {
            v.z = -60.0;
          } 
      positionAttribute.setXYZ(i, v.x, v.y, v.z+grid[i]); // write coordinates
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
  }



  async create() {
    let { camera, lights, orbitalControls } = await this.warpSpeed("-ground");
  // this.physics.debug.enable();

    // const bumpimg = await this.load.texture("/static/grayscale.png");
    const planewidth = 500;
    const planeheight = 500;
    const widthSegments = 150;
    const heightSegments = 150;

      const planeTexture = await this.load.texture("/static/rock.webp");
     // const planeTexture = await this.load.texture("/static/ground.jpg");
  //  const planeTexture = await this.load.texture("/static/heightmap.png");

    const geometry = new THREE.PlaneBufferGeometry(
      planewidth,
      planeheight,
      widthSegments,
      heightSegments
    );
  //  const totalPoints = geometry.getAttribute("position").count;
  //  const zvertex = this.createNoise(totalPoints);
    this.modifyMesh(geometry);

    const material = new THREE.MeshStandardMaterial({
  //    color: 0x0000ff,
      map: planeTexture,
      // displacementMap: planeTexture,
      // displacementScale: 1,
    //  wireframe: true,
    side: THREE.DoubleSide
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



    const sea = new ExtendedMesh(new THREE.PlaneGeometry(500,500,50,50), new THREE.MeshStandardMaterial( { color: 0x0000ff}));
    sea.position.set(0, -40,0);
    sea.rotation.x = -Math.PI / 2;
    sea.castShadow = true;
    sea.receiveShadow = true;
    this.scene.add(sea);



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
   // this.phyicsbox2.body.applyForceX(1);
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
