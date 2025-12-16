import * as THREE from "three";
import type { BoxConfig } from "../../../types/params";

interface RoadMaterialConfig extends Required<BoxConfig> {
	diffuseMap?: THREE.DataTexture;
	normalMap?: THREE.DataTexture;
	repeatY?: number;
}

export function createBox(config: RoadMaterialConfig): THREE.Mesh {
	const {
		width,
		height,
		depth,
		position,
		rotation,
		color,
		diffuseMap,
		normalMap,
		repeatY = 1,
	} = config;

	const geom = new THREE.BoxGeometry(width, height, depth);

	if (diffuseMap && normalMap) {
		diffuseMap.repeat.set(1, repeatY);
		normalMap.repeat.set(1, repeatY);

		const material = new THREE.MeshStandardMaterial({
			map: diffuseMap,
			metalness: 0.0,
			normalMap: normalMap,
			normalScale: new THREE.Vector2(1, 1),
			roughness: 0.85,
		});

		const mesh = new THREE.Mesh(geom, material);
		mesh.position.add(position);
		mesh.setRotationFromEuler(rotation);
		return mesh;
	} else {
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
}
