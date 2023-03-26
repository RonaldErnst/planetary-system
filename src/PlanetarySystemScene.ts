import {
	DirectionalLight,
	DirectionalLightHelper,
	Group,
	LineBasicMaterial,
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

    private readonly lineMat: Material;
	private systemAOs: AstronomicalObject[] = [];
    private solarsystem: Group;

	constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {
		super();

		this.camera = camera;
		this.controls = new OrbitControls(camera, renderer.domElement);
		this.solarsystem = new Group();
        this.lineMat = new LineBasicMaterial( { color: 0xffffff } );
	}

	async initialize() {
        this.setupSolarSystem();
        this.setupLight();
        this.setupCamera();
	}

    private setupSolarSystem() {
        PLANETS.forEach(planet => {
            let geo = this.setupAstroObject(planet)
            this.solarsystem.add(geo)
        })

		this.add(this.solarsystem);
    }

    private setupAstroObject(planet: AstronomicalObjectType) {
        let name = planet.planetName || null;
        let mat = this.initMat(name);
        let geo = this.initGeo(name, mat, convertRadius(planet.radius));
        const ao = new AstronomicalObject(geo, this.lineMat, planet);
        this.systemAOs.push(ao)

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
		this.camera.position.set(0, 0, 500);
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
                return new Mesh(new SphereGeometry(8), mat);
			default:
				return new Mesh(new SphereGeometry(radius), mat);
		}
	}

	private updateInput() {
		if (!this.systemAOs) {
			return;
		}

		const dir = this.directionVector;

		this.camera.getWorldDirection(dir);

		this.updatePlanetPositions();
	}

	private updatePlanetPositions() {
		for (let i = 0; i < this.systemAOs.length; i++) {
			let planetA = this.systemAOs[i];
			let totalForce = new Vector3();

			for (let j = 0; j < this.systemAOs.length; j++) {
                if(i == j)
                    continue

				let planetB = this.systemAOs[j];
				let force = calculateGravitationalForce(
					planetA,
					planetB,
					GRAVITY_CONSTANT
				);
				totalForce.add(force);
			}

			planetA.updateVelocity(totalForce, this.speed);
		}

		this.systemAOs.forEach((planet) => {
            // Remove the path of the planet before updating

            if(planet.posLine)
                this.solarsystem.remove(planet.posLine)

            planet.update(this.speed)

            if(planet.posLine)
                this.solarsystem.add(planet.posLine)
        });
	}

	update() {
		// update
		this.updateInput();
		this.controls.update();
	}
}
