import { Vector3 } from "three";
import AstronomicalObject, {
	AstronomicalObjectType,
} from "./AstronomicalObject";

export const GRAVITY_CONSTANT = 6.67428e-11;
export const AU = 1.5e11;
export const DAYSEC = 24.0 * 60 * 60;

type AOProperties = AstronomicalObjectType & {
	// TODO mesh path
};

const SUN: AOProperties = {
	planetName: "Sun",
	mass: 1.9e30,
	radius: 1, //696340,
	initialPosition: new Vector3(),
	initialVelocity: new Vector3(),
	skipUpdate: true,
};

const MERCURY: AOProperties = {
	planetName: "Mercury",
	mass: 3.3e23,
	radius: 2439.7,
	initialPosition: new Vector3(),
	initialVelocity: new Vector3(),
};

const EARTH: AOProperties = {
	planetName: "Earth",
	mass: 5.97e24,
	radius: 1, //6371,
	initialPosition: new Vector3(1.0167 * AU, 0, 0),
	initialVelocity: new Vector3(0, 29290, 0),
};

const MARS: AOProperties = {
	planetName: "Mars",
	mass: 6.39e23,
	radius: 1,
	initialPosition: new Vector3(1.666 * AU, 0, 0),
	initialVelocity: new Vector3(0, 21970, 0),
};

const JUPITER: AOProperties = {
	planetName: "Jupiter",
	mass: 1.9e27,
	radius: 69911,
	initialPosition: new Vector3(7.02e8, 2.3e8, -1.7e7),
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

	let dir = posA.clone().sub(posB);
	let distance = posA.distanceTo(posB);

	let force = 0;

	if (distance > 1 && distance < Math.pow(10, 12)) {
        // No idea why this works but it does https://github.com/xhinker/orbit/blob/main/solar_orbit_3d_plt.py
        let gravConst = -gravityConstant * massA * massB
        let mod3_e = distance ** 3
		force = gravConst / mod3_e;
	}

	let forceVector = dir.multiplyScalar(force);

	// update quantities F = ma -> a = F/m, v = a * s
	return forceVector.divideScalar(massA).multiplyScalar(DAYSEC);
	// return forceVector
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
	calculateGravitationalForce,
};
