import {
	Vector3,
    Mesh,
    SphereGeometry,
    MeshPhongMaterial
} from 'three'

export default class AstronomicalObject extends Mesh
{
	private readonly velocity: Vector3
    public readonly weight: number
    public readonly radius: number

	private isDead = false

	constructor(weight: number, radius: number, initialVelocity = new Vector3())
	{
        const geometry = new SphereGeometry(1)
        const mesh = new MeshPhongMaterial({ color: "orange" })

        super(geometry, mesh)

        this.weight = weight
        this.radius = radius
        this.velocity = initialVelocity

        console.log("starting velocity:", this.velocity)
	}

	get shouldRemove()
	{
		return this.isDead
	}

	setVelocity(x: number, y: number, z: number)
	{
		this.velocity.set(x, y, z)
	}

    addVelocity(velocity: Vector3) {
        this.velocity.add(velocity)
    }

	update(speed = 1)
	{
        this.position.add(this.velocity.clone().multiplyScalar(speed))
	}
}