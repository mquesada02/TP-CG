import * as THREE from "three";
import { HANGAR_TOWER_COLOR } from "../../../../constants/color";
import type { CylinderConfig } from "../../../../types/params";
import { createCylinder } from "../../trivial/Cylinder";

export function createTowerTop(config: CylinderConfig = {}) {
	const {
		radiusTop = 1,
		radiusBottom = 1.5,
		height = 0.75,
		position = new THREE.Vector3(0, 1.75, 0),
		rotation = new THREE.Euler(0, 0, 0),
		color = HANGAR_TOWER_COLOR,
		...rest
	} = config;

	const mesh = createCylinder({
		...rest,
		color,
		height,
		heightSegments: 1,
		openEnded: false,
		position,
		radialSegments: 4,
		radiusBottom: radiusBottom / Math.SQRT2,
		radiusTop: radiusTop / Math.SQRT2,
		rotation,
		thetaLength: Math.PI * 2,
		thetaStart: 0,
	});

	mesh.geometry.rotateY(Math.PI / 4);
	mesh.geometry.rotateX(Math.PI);

	return mesh;
}
