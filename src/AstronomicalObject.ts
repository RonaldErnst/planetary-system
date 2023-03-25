import { Mesh, Vector3 } from "three";
import { convertVector, DAYSEC } from "./util";

export type AstronomicalObjectType = {
	planetName?: string;
	mass: number;
	radius: number;
	initialPosition: Vector3;
	initialVelocity: Vector3;
    skipUpdate?: boolean;
};

export default class AstronomicalObject {
    public readonly geo: Mesh;
	public planetName?: string;
	private readonly velocity: Vector3;
    public readonly position: Vector3;
	public readonly mass: number;
	public readonly radius: number;
    private readonly skipUpdate?: boolean;

	private readonly prevPositions: Array<number[]>;

	private isDead = false;

	constructor(geo: Mesh, {
		mass,
		radius,
		initialPosition = new Vector3(),
		initialVelocity = new Vector3(),
		planetName,
        skipUpdate,
	}: AstronomicalObjectType) {
        this.geo = geo;

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

	updateVelocity(v: Vector3, speed = 1) {
        if(this.skipUpdate)
            return
            
		this.velocity.add(v.clone().multiplyScalar(speed));
        console.log(this.planetName, "New velocity", this.velocity)
	}

	getPath() {
		return this.prevPositions;
	}

	update(speed = 1) {
        if(this.skipUpdate)
            return

        this.prevPositions.push(this.position.toArray());
        let displacement = this.velocity.clone().multiplyScalar(DAYSEC).multiplyScalar(speed)
		this.position.add(displacement)
        console.log(this.planetName, "Internal position", this.position)

        // Update Mesh position
        let scaledPos = convertVector(this.position)
        this.geo.position.copy(scaledPos)

        console.log(this.planetName, "Mesh position", this.geo.position)
	}
}
