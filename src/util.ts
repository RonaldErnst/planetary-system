import { Vector3 } from "three";
import AstronomicalObject, { AstronomicalObjectType } from "./AstronomicalObject";

export const AU = 1.5e11
export const DAYSEC = 24.0*60*60

type AOProperties = AstronomicalObjectType & {
	// TODO mesh path
};

const SUN: AOProperties = {
	planetName: "Sun",
	mass: 1.9 * Math.pow(10, 30),
	radius: 1, //696340,
	initialPosition: new Vector3(),
	initialVelocity: new Vector3(),
    skipUpdate: true
};

const MERCURY: AOProperties = {
	planetName: "Mercury",
	mass: 3.3 * Math.pow(10, 23),
	radius: 2439.7,
	initialPosition: new Vector3(),
	initialVelocity: new Vector3(),
};

const EARTH: AOProperties = {
	planetName: "Earth",
	mass: 5.97 * Math.pow(10, 24),
	radius: 6371,
	initialPosition: new Vector3(1.0167*AU,0,0),
	initialVelocity: new Vector3(0, 29290, 0),
};

const MARS: AOProperties = {
    planetName: "Mars",
    mass: 6.39e23,
    radius: 1,
    initialPosition: new Vector3(1.666*AU,0,0),
    initialVelocity: new Vector3(0,21970,0)
}

const JUPITER: AOProperties = {
	planetName: "Jupiter",
	mass: 1.9 * Math.pow(10, 27),
	radius: 69911,
	initialPosition: new Vector3(
		7.02 * Math.pow(10, 8),
		2.3 * Math.pow(10, 8),
		-1.7 * Math.pow(10, 7)
	),
	initialVelocity: new Vector3(-4.22, 1.3, 4.04),
};

const planets = [SUN, MERCURY, EARTH, JUPITER];

/*
X = 7.023783148791234E+08 Y = 2.306040767522314E+08 Z =-1.667083210917461E+07
 VX=-4.222918038302398E+00 VY= 1.302744699751427E+01 VZ= 4.042291220205030E-02
*/

// TODO rest of the planets

function convertMass(mass: number) {
	let maxDistance = Math.max(
		...planets.map((p) => SUN.initialPosition.distanceTo(p.initialPosition))
	);
	let scale = 100 / maxDistance;
	return mass * scale;
}

function convertRadius(radius: number) {
	let maxRadius = Math.max(...planets.map((p) => p.radius));
	let scale = 8 / maxRadius;
	return radius * scale;
}

function convertVector(v: Vector3) {
	let maxDistance = Math.max(
		...planets.map((p) => SUN.initialPosition.distanceTo(p.initialPosition))
	);
	let scale = 100 / maxDistance;
	return v.clone().multiplyScalar(scale);
}

function calculateGravitationalForce(
    planetA: AstronomicalObject,
    planetB: AstronomicalObject,
    gravityConstant: number
) {
    let massA = planetA.mass;
    let massB = planetB.mass;

    let posA = planetA.position.clone();
    let posB = planetB.position.clone();

    let dir = posA.sub(posB);
    let distance = posA.distanceTo(posB);

    let force = 0;

    if (distance > 1 && distance < Math.pow(10, 12))
        force = (- gravityConstant * massA * massB) / (distance * distance);

    let forceVector = dir.multiplyScalar(force)

    // update quantities how is this calculated?  F = ma -> a = F/m
    let velocityVector = forceVector.multiplyScalar(DAYSEC).divideScalar(massA)
    return velocityVector.multiplyScalar(DAYSEC) // position Update Vector
}

export {
	SUN,
	MERCURY,
	EARTH,
    MARS,
	JUPITER,
	convertMass,
	convertRadius,
	convertVector,
    calculateGravitationalForce
};
