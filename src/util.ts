import { Vector3 } from "three";
import AstronomicalObject, {
	AstronomicalObjectType,
} from "./AstronomicalObject";

export const GRAVITY_CONSTANT = 6.67428e-11;
export const DAYSEC = 24.0 * 60 * 60;
export const MAX_ORBIT_PATH_LENGTH = 1000;

type AOProperties = AstronomicalObjectType & {
};

const SUN: AOProperties = {
	planetName: "Sun",
	mass: 1.9e30,
	radius: 696340,
	initialPosition: new Vector3(),
	initialVelocity: new Vector3(),
    orbitalInclination: 0,
    rotationPeriod: 27 * 24 * 60 * 60,
    skipUpdate: true,
};

const MERCURY: AOProperties = {
	planetName: "Mercury",
	mass: 3.3e23,
	radius: 2439.7,
	initialPosition: new Vector3(69.8e9, 0, 0),
	initialVelocity: new Vector3(0, 38.86e3, 0),
    orbitalInclination: 7.0,
    rotationPeriod: 1407.6 * 60
};

const VENUS: AOProperties = {
	planetName: "Venus",
	mass: 4.8673e24,
	radius: 6051.8, 
	initialPosition: new Vector3(108.941e9, 0, 0),
	initialVelocity: new Vector3(0, 34.79e3, 0),
    orbitalInclination: 3.4,
    rotationPeriod: - 5832.5 * 60
};

const EARTH: AOProperties = {
	planetName: "Earth",
	mass: 5.97e24,
	radius: 6371,
	initialPosition: new Vector3(152e9, 0, 0),
	initialVelocity: new Vector3(0, 29290, 0),
    orbitalInclination: 0,
    rotationPeriod: 23.9 * 60
};

const MARS: AOProperties = {
	planetName: "Mars",
	mass: 6.39e23,
	radius: 3389.5,
	initialPosition: new Vector3(249.3e9, 0, 0),
	initialVelocity: new Vector3(0, 21970, 0),
    orbitalInclination: 1.8,
    rotationPeriod: 24.6 * 60
};

const JUPITER: AOProperties = {
	planetName: "Jupiter",
	mass: 1.9e27,
	radius: 69911,
	initialPosition: new Vector3(816.363e9, 0, 0),
	initialVelocity: new Vector3(0, 12.44e3, 0),
    orbitalInclination: 1.3,
    rotationPeriod: 9.9 * 60
};

const SATURN: AOProperties = {
	planetName: "Saturn",
	mass: 568.32e24,
	radius: 58232,
	initialPosition: new Vector3(1506.527e9, 0, 0),
	initialVelocity: new Vector3(0, 9.09e3, 0),
    orbitalInclination: 2.5,
    rotationPeriod: 10.7 * 60
}

const URANUS: AOProperties = {
	planetName: "Uranus",
	mass: 86.811e24,
	radius: 25362,
	initialPosition: new Vector3(3001.390e9, 0, 0),
	initialVelocity: new Vector3(0, 6.49e3, 0),
    orbitalInclination: 0.8,
    rotationPeriod: - 17.2 * 60
}

const NEPTUNE: AOProperties = {
	planetName: "Neptune",
	mass: 102.409e24,
	radius: 24622,
	initialPosition: new Vector3(4558.857e9, 0, 0),
	initialVelocity: new Vector3(0, 5.37e3, 0),
    orbitalInclination: 1.8,
    rotationPeriod: 16.1 * 60
}

const PLANETS = [SUN, MERCURY, VENUS, EARTH, MARS, JUPITER, SATURN, URANUS, NEPTUNE];

function convertRadius(radius: number) {
	let maxRadius = Math.max(...PLANETS.filter(p => p.planetName != "Sun").map((p) => p.radius));
	let scale = 10 / maxRadius;
	return Math.max(1, radius * scale);
}

function convertVector(v: Vector3) {
	let maxDistance = Math.max(
		...PLANETS.map((p) => SUN.initialPosition.distanceTo(p.initialPosition))
	);
	let scale = 750 / maxDistance;
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

    //console.log(planetA.planetName, "distance to", planetB.planetName, distance)
	if (distance > 1) {
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
	PLANETS,
	convertRadius,
	convertVector,
	calculateGravitationalForce,
};