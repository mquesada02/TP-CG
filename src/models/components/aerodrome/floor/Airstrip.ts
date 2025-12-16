import * as THREE from "three";
import { HANGAR_FLOOR_COLOR } from "../../../../constants/color";
import type { BoxConfig } from "../../../../types/params";
import { createBox } from "../../trivial/Box";
import { createRoadTextures, type RoadTextures } from "./FloorTexture";
export function createAirstrip(config: BoxConfig = {}): THREE.Mesh {
	const {
		width = 5,
		height = 1,
		depth = 35,
		position = new THREE.Vector3(0, 8.2, 10),
		rotation = new THREE.Euler(0, Math.PI / 2, 0),
		color = HANGAR_FLOOR_COLOR,
	} = config;

	const roadTextures: RoadTextures = createRoadTextures(1024, 1024);

	const textureRepeatY = depth;

	return createBox({
		color,
		depth,

		diffuseMap: roadTextures.diffuseMap,
		height,
		normalMap: roadTextures.normalMap,
		position,
		repeatY: textureRepeatY,
		rotation,
		width,
	});
}
