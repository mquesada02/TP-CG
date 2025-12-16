import * as THREE from "three";
import type { CylinderConfig } from "../../../types/params";

export function createCylinder(config: Required<CylinderConfig>): THREE.Mesh {
	const {
		radiusTop,
		radiusBottom,
		height,
		radialSegments,
		heightSegments,
		openEnded,
		thetaStart,
		thetaLength,
		position,
		rotation,
		color,
	} = config;

	const geom = new THREE.CylinderGeometry(
		radiusTop,
		radiusBottom,
		height,
		radialSegments,
		heightSegments,
		openEnded,
		thetaStart,
		thetaLength,
	);
	const material = new THREE.MeshPhongMaterial({
		color: color,
		opacity: 1.0,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geom, material);
	mesh.position.add(position);
	mesh.setRotationFromEuler(rotation);
	return mesh;
}
