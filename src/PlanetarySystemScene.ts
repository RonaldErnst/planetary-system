import {
    AmbientLight,
    Color,
	DirectionalLight,
	DirectionalLightHelper,
	Group,
	LineBasicMaterial,
	Material,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PerspectiveCamera,
	PointLight,
	Scene,
	SphereGeometry,
	SpotLight,
	SpotLightHelper,
	TextureLoader,
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
    private readonly textLoader: TextureLoader;
	private systemAOs: AstronomicalObject[] = [];
    private solarsystem: Group;

	constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {
		super();

		this.camera = camera;
		this.controls = new OrbitControls(camera, renderer.domElement);
		this.solarsystem = new Group();
        this.lineMat = new LineBasicMaterial( { color: 0xffffff } );
        this.textLoader = new TextureLoader();
	}

	async initialize() {
        this.setupSolarSystem();
        this.setupLight();
        this.setupCamera();
        this.setupBackground();
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
        const spotLight = new SpotLight(0x001199, 0.1);
        spotLight.position.set(1000,1000,1000);
        const spotLightHelper = new SpotLightHelper(spotLight);

        this.add(spotLight);
        this.add(spotLightHelper);

        const sunLight = new PointLight(0xffffff, 1);
		sunLight.position.set(0, 0, 0);

		this.add(sunLight);
    }

    private setupCamera() {
        this.camera.far = 10000
		this.camera.position.set(0, 0, 500);
		this.controls.update();
    }

    private setupBackground() {
        this.background = this.textLoader.load("/assets/background.jpg");
    }

	private initMat(obj: string | null) {
		switch (obj) {
            case "Sun":
                return new MeshBasicMaterial({
                    map: this.textLoader.load(`/assets/${obj.toLowerCase()}.jpg`)
                });
            case "Mercury":
            case "Venus":
            case "Earth":
            case "Mars":
            case "Jupiter":
            case "Saturn":
            case "Uranus":
            case "Neptune":
                return new MeshStandardMaterial({
                    map: this.textLoader.load(`/assets/${obj.toLowerCase()}.jpg`)
                });
			default:
				return new MeshBasicMaterial({ color: new Color("red") });
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
