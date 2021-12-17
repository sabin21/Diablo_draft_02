//import * as THREE from '../build/three.module.js';

    let container;
	let camera, scene, renderer, light, clock;
	let uniforms, diablo1, fire;

	init();
//-----------------


//-----------------
function init() {
  	container = document.getElementById( 'container' );

  	const aspect = container.clientWidth/container.clientHeight;
  	camera = new THREE.PerspectiveCamera(35, aspect, 0.01, 1000);
  	camera.position.z = 100;

  	scene = new THREE.Scene();
	light = new THREE.DirectionalLight(0xffffff, 1);

	light.position.set(-1, 0, 1);
	scene.add(light);
	scene.add(camera);

  	var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
  	
	uniforms = {
		iTime: { type: "f", value: 0.1 },
		iResolution: { type: "v2", value: new THREE.Vector2() },
		iFlameScale : { type: "f", value: 3. }
	};

	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		blending: THREE.AdditiveBlending,
		transparent: true
	} );

	var fireBall = new THREE.Mesh( geometry, material );
	fireBall.position.z = 1;
	scene.add( fireBall );

	// Diablo ------------
	var diabloGeo = new THREE.PlaneBufferGeometry( 7, 4.5);
	var diabloLoader1 = new THREE.TextureLoader();

	diabloLoader1.load('../img/diablo_trans_1.png', texture => {
		var diabloTexture1 = new THREE.MeshLambertMaterial({
         	map: texture,
          	transparent: true,
          	opacity: 1
		})
		diablo1 = new THREE.Mesh( diabloGeo, diabloTexture1);
		diablo1.position.z = 90;
		diablo1.position.y = -1.5; 
		scene.add( diablo1);
	});
	//-----------------------
	clock = new THREE.Clock();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
  	container.appendChild( renderer.domElement );

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );
}

// Fire-bottom

	VolumetricFire.texturePath = '../img/';

	var fireWidth  = 4;
	var fireHeight = 4;
	var fireDepth  = 2;
	var sliceSpacing = 1;

	fire = new VolumetricFire(
		fireWidth,
		fireHeight,
		fireDepth,
		sliceSpacing,
		camera
	);
    fire.mesh.position.x = 0;
    fire.mesh.position.y = -2;
    fire.mesh.position.z = 94;
    
    fire.mesh.rotation.x = Math.PI / 4;
    fire.mesh.rotation.z = Math.PI / 2;
    
	//fire.mesh.scale = 10;

	scene.add( fire.mesh );

function onWindowResize( event ) {
	renderer.setSize( window.innerWidth, window.innerHeight );
	uniforms.iResolution.value.x = renderer.domElement.width;
	uniforms.iResolution.value.y = renderer.domElement.height;
 
  	const windowWidth  = window.innerWidth;
    const windowHeight = window.innerHeight;
  
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
}

(function animate() {
    requestAnimationFrame( animate );
	var elapsed = clock.getElapsedTime();
    //camera.position.set( 0, 4, 10);
	camera.lookAt( scene.position );
	fire.update( elapsed );
    render();
})();

function render() {
  uniforms.iTime.value += 0.02;
  renderer.render( scene, camera );
}

//animate();