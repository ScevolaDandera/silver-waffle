
        
function getImageData( image ) {

    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, image.width, image.height );

}

function getPixel( imagedata, x, y ) {

    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

}


        

			var container, stats;
			var camera, scene, renderer, group, particle;
			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
				camera.position.z = 1000;

				scene = new THREE.Scene();

				var PI2 = Math.PI * 2;
				var program = function ( context ) {

					context.beginPath();
					context.arc( 0, 0, 1, 0, PI2, true );
					context.closePath();
					context.fill();

				}

				group = new THREE.Object3D();
				scene.add( group );
/*
                var texture = THREE.ImageUtils.loadTexture( "textures/sprites/spark1.png" );
                var imagedata = getImageData( texture.image );
                */
                
                var imagedata;
                depthtex = THREE.ImageUtils.loadTexture( "out-depth-105.png");
                texture = THREE.ImageUtils.loadTexture( "out-rgb-105.png", new THREE.UVMapping(), function ( event ) {

                imagedata = getImageData( texture.image );

                depthdata = getImageData( depthtex.image );


                var img_w = imagedata.width;
                var img_h = imagedata.height;
                var x_mul = 1024/img_w;
                var y_mul = 1024/img_h;
                
                for (var y = 0; y < img_h;y++) 
                for (var x = 0; x < img_w;x++) {
                    var dep = getPixel(depthdata,x,y );
                    var col = getPixel(imagedata,x,y );
                    var cod = col.b+(col.g*256)+(col.r<<16);
					particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: cod, program: program } ) );
					particle.position.x = (x) * x_mul - 512;
					particle.position.y = (y) * x_mul - 512;
					particle.position.y *= -1;
                    if (dep.r > 0) {
                    particle.position.z = 0;
                    particle.scale.x = particle.scale.y = 1;
                    } else {
					particle.position.z = 2048-((dep.b+dep.g*256)*2);
                    particle.scale.x = particle.scale.y = 9;
					}
                    group.add( particle );
                }
} );
                

                

				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
			}

			//

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;
			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * 0.09;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.09;
				camera.lookAt( scene.position );
/*
				group.rotation.x += 0.01;
				group.rotation.y += 0.02;
*/
				renderer.render( scene, camera );

			}
