import { Vector3 } from "three";

export type AstronomicalObjectType = {
	planetName?: string;
	mass: number;
	radius: number;
	initialPosition: Vector3;
	initialVelocity: Vector3;
    skipUpdate?: boolean;
};

export default class AstronomicalObject {
	public planetName?: string;
	private readonly velocity: Vector3;
    public readonly position: Vector3;
	public readonly mass: number;
	public readonly radius: number;
    private readonly skipUpdate?: boolean;

	private readonly prevPositions: Array<number[]>;

	private isDead = false;

	constructor({
		mass,
		radius,
		initialPosition = new Vector3(),
		initialVelocity = new Vector3(),
		planetName,
        skipUpdate,
	}: AstronomicalObjectType) {

		this.planetName = planetName;
		this.mass = mass;
		this.radius = radius;
        this.skipUpdate = skipUpdate;
		this.velocity = initialVelocity;
        this.position = initialPosition;
		this.prevPositions = new Array();

		initialPosition = initialPosition;
		this.position.set(
			initialPosition.x,
			initialPosition.y,
			initialPosition.z
		);

		console.log(
			this.planetName,
			"initialPosition",
			this.position,
			"initialVelocity",
			this.velocity,
			"radius",
			this.radius
		);
	}

	get shouldRemove() {
		return this.isDead
	}

	setVelocity(v: Vector3) {
		this.velocity.copy(v);
	}

	addVelocity(v: Vector3) {
		this.velocity.add(v);
		//console.log(this.planetName, "new Velocity", this.velocity);
	}

	getPath() {
		return this.prevPositions;
	}

	update() {
        if(this.skipUpdate)
            return

		this.prevPositions.push(this.position.toArray());
		this.position.add(this.velocity);
		//console.log(this.planetName, "new Position", this.position);
	}
}
