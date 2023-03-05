import {
	Vector3,
    Mesh,
    SphereGeometry,
    MeshPhongMaterial
} from 'three'

export default class AstronomicalObject extends Mesh
{
    public planetName?: string
	public velocity: Vector3
    public readonly weight: number
    public readonly radius: number

	private isDead = false

	constructor(weight: number, radius: number, initialVelocity = new Vector3())
	{
        const geometry = new SphereGeometry(radius)
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

	update(speed = 1)
	{
        if(this.planetName !== undefined)
            console.log(this.planetName, "Current Velocity:", this.velocity)
        this.position.add(this.velocity.clone().multiplyScalar(speed))
	}
}