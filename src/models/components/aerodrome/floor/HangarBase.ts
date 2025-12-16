import * as THREE from "three";
import { HANGAR_FLOOR_COLOR } from "../../../../constants/color";
import type { BoxConfig } from "../../../../types/params";
import { createBox } from "../../trivial/Box";

export function createHangarBase(config: BoxConfig = {}) {
	const {
		width = 8,
		height = 1,
		depth = 26,
		position = new THREE.Vector3(-2.5, 8.2, 3.5),
		rotation = new THREE.Euler(0, Math.PI / 2, 0),
		color = HANGAR_FLOOR_COLOR,
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
