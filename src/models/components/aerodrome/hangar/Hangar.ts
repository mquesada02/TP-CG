import * as THREE from "three";
import { HANGAR_COLOR } from "../../../../constants/color";
import type { CylinderConfig } from "../../../../types/params";
import { createCylinder } from "../../trivial/Cylinder";

export function createHangar(config: CylinderConfig = {}) {
	const commonRadius = 1.25;

	const {
		radiusTop = commonRadius,
		radiusBottom = commonRadius,
		height = 4,
		radialSegments = 32,
		heightSegments = 1,
		openEnded = false,
		thetaStart = 0,
		thetaLength = Math.PI,
		position = new THREE.Vector3(0, 0, 0),
		rotation = new THREE.Euler(Math.PI / 2, Math.PI / 2, 0),
		color = HANGAR_COLOR,
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
