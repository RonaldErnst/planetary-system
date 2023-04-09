import { BufferGeometry, Line, Material, Mesh, Vector3 } from "three";
import { convertVector, DAYSEC, MAX_ORBIT_PATH_LENGTH } from "./util";

export type AstronomicalObjectType = {
	planetName: string;
	mass: number;
	radius: number;
	initialPosition: Vector3;
	initialVelocity: Vector3;
    orbitalInclination: number;
    rotationPeriod: number;
    skipUpdate?: boolean;
};

export default class AstronomicalObject {
    public readonly geo: Mesh;
    private readonly lineMat: Material;

	public planetName?: string;
	private readonly velocity: Vector3;
    public readonly position: Vector3;
	public readonly mass: number;
	public readonly radius: number;
    private readonly orbitalInclination: number;
    public readonly rotationPeriod: number;

    private readonly skipUpdate?: boolean;

	public readonly prevPositions: Array<Vector3>;
    public posLine: Line | null;

	private isDead = false;

	constructor(geo: Mesh, lineMat: Material, {
		mass,
		radius,
		initialPosition = new Vector3(),
		initialVelocity = new Vector3(),
        orbitalInclination,
		planetName,
        skipUpdate,
        rotationPeriod
	}: AstronomicalObjectType) {
        this.geo = geo;
        this.lineMat = lineMat;

		this.planetName = planetName;
		this.mass = mass;
		this.radius = radius;
        this.skipUpdate = skipUpdate;
        this.orbitalInclination = orbitalInclination;
        this.rotationPeriod = rotationPeriod;

		this.velocity = initialVelocity.applyAxisAngle(new Vector3(0,1,0), Math.PI * this.orbitalInclination / 180);
        this.position = initialPosition.applyAxisAngle(new Vector3(0,-1,0), Math.PI * this.orbitalInclination / 180);
		this.prevPositions = new Array();
        this.posLine = null;

		initialPosition = initialPosition;
		this.position.set(
			initialPosition.x,
			initialPosition.y,
			initialPosition.z
		);

        this.geo.position.copy(convertVector(this.position))
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
        // console.log(this.planetName, "New velocity", this.velocity)
	}

	getPath() {
		return this.prevPositions;
	}

	update(speed = 1) {
        if(this.skipUpdate)
            return

        if(this.prevPositions.length > MAX_ORBIT_PATH_LENGTH)
            this.prevPositions.shift()

        this.prevPositions.push(this.geo.position.clone());
        let geoLine = new BufferGeometry().setFromPoints(this.prevPositions.filter((_,i ) => i % 5 == 0))
        this.posLine = new Line(geoLine, this.lineMat);

        let displacement = this.velocity.clone().multiplyScalar(DAYSEC).multiplyScalar(speed)
		this.position.add(displacement)
        //console.log(this.planetName, "Internal position", this.position)

        // Update Mesh position
        let scaledPos = convertVector(this.position)
        this.geo.position.copy(scaledPos)

        //console.log(this.planetName, "Mesh position", this.geo.position)
	}
}
