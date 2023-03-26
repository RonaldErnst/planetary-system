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
import AstronomicalObject, { AstronomicalObjectType } from "./AstronomicalObject";
import { calculateGravitationalForce, convertRadius, GRAVITY_CONSTANT, PLANETS } from "./util";

export default class PlanetarySystemScene extends Scene {
	private readonly camera: PerspectiveCamera;
	private readonly controls: OrbitControls;
    private readonly speed = 1;

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
		const solarsystem = new Group();

        PLANETS.forEach(planet => {
            let geo = this.setupAstroObject(planet)
            solarsystem.add(geo)
        })

		this.add(solarsystem);
    }

    private setupAstroObject(planet: AstronomicalObjectType) {
        let name = planet.planetName || null;
        let mat = this.initMat(name);
        let geo = this.initGeo(name, mat, convertRadius(planet.radius));
        const ao = new AstronomicalObject(geo, planet);
        this.system.push(ao)

        return geo
    }

    private setupLight() {
        const light = new DirectionalLight(0xffffff, 20);
		light.position.set(0, 0, 10);
		const lightHelper = new DirectionalLightHelper(light);

		this.add(light);
		this.add(lightHelper);
    }

    private setupCamera() {
        this.camera.far = 10000
		this.camera.position.set(0, 0, 1000);
		this.controls.update();
    }

	private initMat(obj: string | null) {
		switch (obj) {
			default:
				return new MeshBasicMaterial({ color: "orange" });
		}
	}

	private initGeo(obj: string | null, mat: Material, radius: number) {
		switch (obj) {
            case "Sun":
                return new Mesh(new SphereGeometry(10), mat);
			default:
				return new Mesh(new SphereGeometry(radius), mat);
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
