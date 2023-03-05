import * as THREE from 'three'
import PlanetarySystemScene from './PlanetarySystemScene'

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("app") as HTMLCanvasElement });
renderer.setSize( window.innerWidth, window.innerHeight );

const scene = new PlanetarySystemScene(camera, renderer)
scene.initialize()

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    scene.update()
}

animate();