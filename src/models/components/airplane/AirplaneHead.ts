import * as THREE from "three";
import type { CylinderConfig } from "../../../types/params";
import { createCylinder } from "../trivial/Cylinder";

function createFirstHead(config: CylinderConfig = {}) {
	const {
		position = new THREE.Vector3(-(2 + 2 / 3), 15, 0),
		rotation = new THREE.Euler(0, 0, Math.PI / 2),
		radialSegments = 32,
		radiusBottom = 1,
		radiusTop = 0.5,
		height = 4 / 3,
		heightSegments = 1,
		color = "#f0f0f0",
		openEnded = true,
		thetaLength = Math.PI * 2,
		thetaStart = 0,
	} = config;

	return createCylinder({
		color,
		height,
		heightSegments,
		openEnded,
		position,
		radialSegments,
		radiusBottom,
		radiusTop,
		rotation,
		thetaLength,
		thetaStart,
	});
}

function createSecondHead(config: CylinderConfig = {}) {
	const {
		position = new THREE.Vector3(-(2 + 4 / 3 + 2 / 9), 15, 0),
		rotation = new THREE.Euler(0, 0, Math.PI / 2),
		radialSegments = 32,
		radiusBottom = 0.5,
		radiusTop = 0.25,
		height = 4 / 9,
		heightSegments = 1,
		color = "#f0f0f0",
		openEnded = false,
		thetaLength = Math.PI * 2,
		thetaStart = 0,
	} = config;

	return createCylinder({
		color,
		height,
		heightSegments,
		openEnded,
		position,
		radialSegments,
		radiusBottom,
		radiusTop,
		rotation,
		thetaLength,
		thetaStart,
	});
}

export function createAirplaneHead() {
	const group = new THREE.Group();
	const first = createFirstHead();
	const second = createSecondHead();

	group.add(first, second);

	return group;
}
