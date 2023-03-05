import AstronomicalObject from './AstronomicalObject'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Color, DirectionalLight, DirectionalLightHelper, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'

export default class PlanetarySystemScene extends Scene
{
	private readonly camera: PerspectiveCamera
    private readonly controls: OrbitControls
    private readonly gravityConstant: number

	private directionVector = new Vector3()

	private system: AstronomicalObject[] = []

	constructor(camera: PerspectiveCamera, renderer: WebGLRenderer)
	{
		super()

		this.camera = camera
        this.controls = new OrbitControls(camera, renderer.domElement)
        this.gravityConstant = 6.67 * Math.pow(10, -2)
	}

	async initialize()
	{
        // TODO Create Planets
        const planetA = new AstronomicalObject(0.33, 4879, new Vector3(0.1, 0.1, 0.1))
        const planetB = new AstronomicalObject(4.87, 12104, new Vector3())
        const planetC = new AstronomicalObject(2, 12104, new Vector3())

        this.system.push(planetA)
        this.system.push(planetB)
        this.system.push(planetC)

        planetA.position.x = 5
        planetB.position.x = -5
        planetC.position.z = 5

        this.add(planetA, planetB, planetC)

		const light = new DirectionalLight(0xFFFFFF, 1)
		light.position.set(0, 10, 1)
        const lightHelper = new DirectionalLightHelper(light)

		this.add(light)
        this.add(lightHelper)

        this.background = new Color('green')

        this.camera.position.set(0, 10, 0)
        this.controls.update()
	}

	private updateInput()
	{
		if (!this.system)
		{
			return
		}

		const dir = this.directionVector

		this.camera.getWorldDirection(dir)

        this.updatePlanetPositions()
	}

    private updatePlanetPositions() {
        for(let i = 0; i < this.system.length; i++) {
            let planetA = this.system[i]
            let totalForce = new Vector3()

            for (let j = 0; j < this.system.length; j++) {
                if(j == i)
                    continue

                let planetB = this.system[j]
                let force = this.calculateGravitationalForce(planetA, planetB, this.gravityConstant)
                totalForce.add(force)
            }

            planetA.addVelocity(totalForce)
            planetA.update(0.001)
        }
    }

    private calculateGravitationalForce(planetA: AstronomicalObject, planetB: AstronomicalObject, gravityConstant: number) {
        let weightA = planetA.weight
        let weightB = planetB.weight

        let posA = planetA.position.clone()
        let posB = planetB.position.clone()

        let dir = posB.sub(posA)
        let distance = posA.distanceToSquared(posB)

        let force = 0

        if(distance > 0)
            force = gravityConstant * weightA * weightB / distance

        return dir.multiplyScalar(force)
    }
    
	update()
	{
		// update
		this.updateInput()
        this.controls.update()
	}
}