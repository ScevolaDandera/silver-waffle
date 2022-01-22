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

  

// map(value, istart, istop, ostart, ostop) {
//     return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
// }


  modifyMesh(g, zvertex) {
    const positionAttribute = g.getAttribute( 'position' );
    const vertex = new THREE.Vector3();
    // console.log(zvertex);
    // console.log(positionAttribute.count);
     // let t = this.getPixel();

    for ( let i = 0; i < positionAttribute.count; i++ ) {
  vertex.fromBufferAttribute( positionAttribute, i ); // read vertex
  // do something with vertex
  // vertex.x = Math.random() * (20 - -10) + -10;
  // vertex.y = Math.random() * (20 - -10) + -10;
  vertex.z = zvertex[i];
  positionAttribute.setXYZ( i, vertex.x, vertex.y, vertex.z ); // write coordinates
    }
    g.attributes.position.needsUpdate = true
    g.computeVertexNormals();
  }
  
  createNoise(nodes) {
    let grid = [];
    for (let i=0; i<=nodes; i++) {
       let v = Math.random() * (0 - -1) + -1;
        grid.push(v)
    }
    return grid;
  }

getImageData( image ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, image.width, image.height );

}


getPixel( imagedata, x, y ) {
    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    console.log(position);
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

}


  async create() {
   let { camera, lights, orbitalControls } = await this.warpSpeed('-ground')
  //this.physics.debug.enable();
  //console.log(this.getPixels());
   
   const planeTexture = await this.load.texture("/static/rock.webp");
 //   const heightmap = await this.load.texture("/static/heightmap.png");

// messing with texture
const loader = new THREE.TextureLoader();
loader.load("/static/grayscale.png", (texture) => {
//https://jsfiddle.net/e4Lr5xzp/1/
//http://www.adrianboeing.com/demoscene/test/particleimage/canvas_particles_image.html
	console.log(this.getImageData(texture.image));

	});
//end of texture messing

  // const bumpimg = await this.load.texture("/static/grayscale.png");
    const widthSegments = 2;
    const heightSegments = 2;

    const geometry = new THREE.PlaneBufferGeometry( 100, 100, widthSegments, heightSegments);
    const totalPoints =  geometry.getAttribute( 'position' ).count;
          const zvertex = this.createNoise(totalPoints);
          this.modifyMesh(geometry, zvertex);

       //   const imagedata = this.getPixel(totalPoints);
     //     console.log(imagedata);




    const material = new THREE.MeshStandardMaterial( {
     map: planeTexture,
      // displacementMap: heightmap,
      // displacementScale: 8,
      wireframe: true
      });

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
