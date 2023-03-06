import { Vector3 } from "three"
import { AstronomicalObjectType } from "./AstronomicalObject"

type AOProperties = AstronomicalObjectType & {
    // TODO mesh path
}

const SUN: AOProperties = {
    planetName: "Sun",
    weight: 1.9 * Math.pow(10, 30),
    radius: 696340,
    initialPosition: new Vector3(),
    initialVelocity: new Vector3()

}

const MERCURY: AOProperties = {
    planetName: "Mercury",
    weight: 3.3 * Math.pow(10, 23),
    radius: 2439.7,
    initialPosition: new Vector3(),
    initialVelocity: new Vector3()
}

const EARTH: AOProperties = {
    planetName: "Earth",
    weight: 5.97 * Math.pow(10,24),
    radius: 6371,
    initialPosition: new Vector3(),
    initialVelocity: new Vector3()
}

const JUPITER: AOProperties = {
    planetName: "Jupiter",
    weight: 1.9 * Math.pow(10, 27),
    radius: 69911,
    initialPosition: new Vector3(),
    initialVelocity: new Vector3()
}

// TODO rest of the planets

function convertMass(mass: number, scaling: number) {
    // TODO
}

function convertRadius(radius: number, scaling: number) {
    // TODO
}

export {
    SUN,
    MERCURY,
    EARTH,
    JUPITER,
    convertMass,
    convertRadius
}