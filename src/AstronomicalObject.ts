import {
	Vector3,
    Mesh,
    SphereGeometry,
    MeshPhongMaterial
} from 'three'

export type AstronomicalObjectType = {
    planetName?: string;
    weight: number;
    radius: number;
    initialPosition: Vector3;
    initialVelocity: Vector3;
}

export default class AstronomicalObject extends Mesh
{
    public planetName?: string
	public velocity: Vector3
    public readonly weight: number
    public readonly radius: number

	private isDead = false

	constructor({weight, radius, initialPosition = new Vector3(), initialVelocity = new Vector3()}: AstronomicalObjectType)
	{
        const geometry = new SphereGeometry(radius)
        const mesh = new MeshPhongMaterial({ color: "orange" })

        super(geometry, mesh)

        this.weight = weight
        this.radius = radius
        this.velocity = initialVelocity

        this.position.set(initialPosition.x, initialPosition.y, initialPosition.z)
	}

	get shouldRemove()
	{
		return this.isDead
	}

	update(speed = 1)
	{
        this.position.add(this.velocity.clone().multiplyScalar(speed))
	}
}