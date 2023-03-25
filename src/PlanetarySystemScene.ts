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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import AstronomicalObject from "./AstronomicalObject";
import { calculateGravitationalForce, EARTH, GRAVITY_CONSTANT, SUN } from "./util";

export default class PlanetarySystemScene extends Scene {
	private readonly camera: PerspectiveCamera;
	private readonly controls: OrbitControls;
    private readonly speed = 0.1;

	private directionVector = new Vector3();

	private system: AstronomicalObject[] = [];

	constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {
		super();

		this.camera = camera;
		this.controls = new OrbitControls(camera, renderer.domElement);
	}

	async initialize() {
        this.setupSolarSystem();
        this.setupLight();
        this.setupCamera();
	}

    private setupSolarSystem() {
        const sunMat = this.initMat("sun");
		const sunGeo = this.initGeo("sun", sunMat);
        
        const earthMat = this.initMat("earth");
		const earthGeo = this.initGeo("earth", earthMat);

		// Create Planets
		const sun = new AstronomicalObject(sunGeo, SUN);
		// const mercury = new AstronomicalObject(MERCURY)
		const earth = new AstronomicalObject(earthGeo, EARTH);
		// const mars = new AstronomicalObject(MARS);
		// const jupiter = new AstronomicalObject(JUPITER);
		// TODO rest

		this.system.push(sun);
		// this.system.push(mercury)
		this.system.push(earth);
		//this.system.push(mars);
		// this.system.push(jupiter)

		const solarsystem = new Group();

		solarsystem.add(sunGeo);
		// this.add(mercury)
		solarsystem.add(earthGeo);
		//solarsystem.add(mars);
		// this.add(jupiter);

		this.add(solarsystem);
    }

    private setupLight() {
        const light = new DirectionalLight(0xffffff, 20);
		light.position.set(0, 0, 10);
		const lightHelper = new DirectionalLightHelper(light);

		this.add(light);
		this.add(lightHelper);
    }

    private setupCamera() {
		this.camera.position.set(0, 0, 50);
		this.controls.update();
    }

	private initMat(obj: string) {
		switch (obj) {
			default:
				return new MeshBasicMaterial({ color: "orange" });
		}
	}

	private initGeo(obj: string, mat: Material) {
		switch (obj) {
			default:
				return new Mesh(new SphereGeometry(1), mat);
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
                if(i == j)
                    continue

				let planetB = this.system[j];
				let force = calculateGravitationalForce(
					planetA,
					planetB,
					GRAVITY_CONSTANT
				);
				totalForce.add(force);
			}

			planetA.updateVelocity(totalForce, this.speed);
		}

		this.system.forEach((planet) => {
            planet.update(this.speed)
        });
	}

	update() {
		// update
		this.updateInput();
		this.controls.update();
	}
}
