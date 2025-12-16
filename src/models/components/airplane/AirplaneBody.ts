import * as THREE from "three";
import type { CylinderConfig } from "../../../types/params";
import { createCylinder } from "../trivial/Cylinder";

export function createAirplaneBody(config: CylinderConfig = {}) {
	const {
		position = new THREE.Vector3(0, 15, 0),
		rotation = new THREE.Euler(0, 0, Math.PI / 2),
		radialSegments = 32,
		radiusBottom = 1,
		radiusTop = 1,
		height = 4,
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
