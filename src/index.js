import { THREE, Project, Scene3D, PhysicsLoader, ExtendedMesh } from "enable3d";

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
    const loader = new THREE.TextureLoader();
    this.imagedata;
    const loadimage = await loader.load("/static/grayscale.png", (texture) => {
      //https://jsfiddle.net/e4Lr5xzp/1/
      //http://www.adrianboeing.com/demoscene/test/particleimage/canvas_particles_image.html
      this.imagedata = this.getImageData(texture.image);
    });

    //end of texture messing
  }

  // map(value, istart, istop, ostart, ostop) {
  //     return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  // }

  modifyMesh(g, zvertex, fromnoise) {
    const positionAttribute = g.getAttribute("position");
    const vertex = new THREE.Vector3();
    // console.log(zvertex);
   //  console.log(positionAttribute.count);
    // let t = this.getPixel();
 let count = 2;
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i); // read vertex
      // do something with vertex
      // vertex.x = Math.random() * (20 - -10) + -10;
      // vertex.y = Math.random() * (20 - -10) + -10;

      vertex.z = zvertex[count];
   //   vertex.z = fromnoise[i]/1000;
      count += 3;
      positionAttribute.setXYZ(i, vertex.x, vertex.y, -vertex.z); // write coordinates
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
  }

  createNoise(nodes) {
    // let grid = [];
    // for (let i = 0; i <= nodes; i++) {
    //   let v = Math.random() * (0 - -1) + -1;
    //   grid.push(v);
    // }
    // return grid;
    let permutation= [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 
      103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 
      26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 
      87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 
      77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 
      46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 
      187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 
      198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 
      255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 
      170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 
      172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 
      104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 
      241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 
      157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 
      93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
      return permutation;
  }

  getImageData(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);
  }

  getPixel(imagedata, x, y) {
    let position = (x * y) * 4,
      data = imagedata.data[position];
    //  console.log(position);
    // return {
    //   r: data[position],
    //   g: data[position + 1],
    //   b: data[position + 2],
    //   a: data[position + 3],
    // };
    return data;
  }

  async create() {
    let { camera, lights, orbitalControls } = await this.warpSpeed("-ground");
 //   this.physics.debug.enable();

    // const bumpimg = await this.load.texture("/static/grayscale.png");
    const widthSegments = 200;
    const heightSegments = 200;

  //  const planeTexture = await this.load.texture("/static/rock.webp");
    const planeTexture = await this.load.texture("/static/heightmap.png");
    //   const heightmap = await this.load.texture("/static/heightmap.png");


    function returnRequiredXYSet(imgd, f) {
     // console.log(imgd);
      let point = [];
      let ww = 511
      let hh = 511
      let segmentedw = Math.floor(ww/widthSegments);
      let segmentedh = Math.floor(hh/heightSegments);
      console.log(segmentedw, segmentedh);
      for (let i=0; i<=widthSegments; i++) {
          for(let j=0; j<=heightSegments; j++) {
           // console.log(ww,hh);
           let pixel=  f(imgd,ww,hh);
          // console.log(ww,hh, pixel);
            point.push(ww, hh, pixel/160);
            hh -= segmentedh;

          }
          ww -= segmentedw;
          hh = imgd.height;
      }
      return point;
    }

    const pointarray = returnRequiredXYSet(this.imagedata, this.getPixel);

    const geometry = new THREE.PlaneBufferGeometry(
      200,
      200,
      widthSegments,
      heightSegments
    );
    const totalPoints = geometry.getAttribute("position").count;
    const noisedata = this.createNoise(totalPoints);
  //  this.modifyMesh(geometry, zvertex);
    this.modifyMesh(geometry, pointarray, noisedata); //optionaldata noisedata

    const material = new THREE.MeshStandardMaterial({
      map: planeTexture,
      // displacementMap: heightmap,
      // displacementScale: 8,
      // wireframe: true,
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
