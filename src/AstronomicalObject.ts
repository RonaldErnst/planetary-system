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
    public readonly size: number
    public readonly debug: boolean

	private isDead = false

	constructor(weight: number, size: number, initialVelocity = new Vector3(), debug = false)
	{
        const geometry = new SphereGeometry(1)
        const mesh = new MeshPhongMaterial({ color: "orange" })

        super(geometry, mesh)

        this.weight = weight
        this.size = size
        this.velocity = initialVelocity
        this.debug = debug

        console.log("starting velocity:", this.velocity)
	}

	get shouldRemove()
	{
		return this.isDead
	}

	setVelocity(x: number, y: number, z: number)
	{
		this.velocity.set(x, y, z)
        if(this.debug)
            console.log("Velocity set:", this.velocity)
	}

    addVelocity(velocity: Vector3) {
        this.velocity.add(velocity)
        if(this.debug)
            console.log("Added Velocity:", velocity, "New Velocity", this.velocity)
    }

	update(speed = 1)
	{
        this.position.add(this.velocity.clone().multiplyScalar(speed))
        if(this.debug)
            console.log("New Position:", this.position)
	}
}