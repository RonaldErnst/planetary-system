import AstronomicalObject from "./AstronomicalObject";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
	DirectionalLight,
	DirectionalLightHelper,
	Group,
	Material,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	SphereGeometry,
	Vector3,
	WebGLRenderer,
} from "three";
import {
	AU,
	calculateGravitationalForce,
	EARTH,
	JUPITER,
	MARS,
	MERCURY,
	SUN,
} from "./util";

export default class PlanetarySystemScene extends Scene {
	private readonly camera: PerspectiveCamera;
	private readonly controls: OrbitControls;
	private readonly gravityConstant: number;

	private directionVector = new Vector3();

	private system: AstronomicalObject[] = [];

	constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {
		super();

		this.camera = camera;
		this.controls = new OrbitControls(camera, renderer.domElement);
		this.gravityConstant = 0.34;
	}

	async initialize() {
        const sunMat = this.initMat("sun");
        const sunGeo = this.initGeo("sun", sunMat);

		// Create Planets
		const sun = new AstronomicalObject(SUN);
		// const mercury = new AstronomicalObject(MERCURY)
		//const earth = new AstronomicalObject(EARTH);
		//const mars = new AstronomicalObject(MARS);
		// const jupiter = new AstronomicalObject(JUPITER);
		// TODO rest

		this.system.push(sun);
		// this.system.push(mercury)
		//this.system.push(earth);
		//this.system.push(mars);
		// this.system.push(jupiter)

		const solarsystem = new Group();

		solarsystem.add(sunGeo);
		// this.add(mercury)
		//solarsystem.add(earth);
		//solarsystem.add(mars);
		// this.add(jupiter);

		//let scale = 100 / Math.max(...this.system.map(o => o.position.distanceTo(sun.position)));
		//solarsystem.scale.set(scale, scale, scale);

		this.add(solarsystem);

		// Add light
		const light = new DirectionalLight(0xffffff, 1);
		light.intensity = 20;
		light.position.set(0, 1, 0);
		const lightHelper = new DirectionalLightHelper(light);

		this.add(light);
		this.add(lightHelper);

		// Change the background
		// this.background = new Color("green");
		// And camera
		this.camera.position.set(0, 50, 0);
		this.controls.update();
	}

    private initMat(obj: string) {
        switch(obj) {
            default:
                return new MeshBasicMaterial({ color: "orange" })
        }
    }

    private initGeo(obj:string, mat: Material) {
        switch(obj) {
            default:
                return new Mesh(new SphereGeometry(1), mat)
        }
    }

	private updateInput() {
		if (!this.system) {
			return;
		}

		const dir = this.directionVector;

		this.camera.getWorldDirection(dir);

		this.updatePlanetPositions();
	}

	private updatePlanetPositions() {
		for (let i = 0; i < this.system.length; i++) {
			let planetA = this.system[i];
			let totalForce = new Vector3();

			for (let j = 0; j < this.system.length; j++) {
				let planetB = this.system[j];
				let force = calculateGravitationalForce(
					planetA,
					planetB,
					this.gravityConstant
				);
				totalForce.add(force);
			}

			planetA.addVelocity(totalForce);
		}

		this.system.forEach((planet) => planet.update(0.001)); // TODO separate internal update from mesh update
	}

	update() {
		// update
		this.updateInput();
		this.controls.update();
	}
}
