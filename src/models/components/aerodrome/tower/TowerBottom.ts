import * as THREE from "three";
import { HANGAR_TOWER_COLOR } from "../../../../constants/color";
import type { BoxConfig } from "../../../../types/params";
import { createBox } from "../../trivial/Box";

export function createTowerBottom(config: BoxConfig = {}) {
	const {
		width = 1,
		height = 3,
		depth = 1,
		position = new THREE.Vector3(0, 0, 0),
		rotation = new THREE.Euler(0, 0, 0),
		color = HANGAR_TOWER_COLOR,
	} = config;

	return createBox({
		color,
		depth,
		height,
		position,
		rotation,
		width,
	});
}
