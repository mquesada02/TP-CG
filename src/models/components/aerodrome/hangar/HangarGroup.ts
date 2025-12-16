import * as THREE from "three";
import { createHangar } from "./Hangar";

type HangarGroupConfig = {
	amount?: number;
	spacing?: number;
	direction?: "x" | "y" | "z";
	start?: THREE.Vector3;
};

export function createHangarGroup(config: HangarGroupConfig = {}) {
	const {
		amount = 7,
		spacing = 2.75,
		direction = "x",
		start = new THREE.Vector3(-12, 8.3, 2),
	} = config;

	const group = new THREE.Group();

	for (let i = 0; i < amount; i++) {
		const position = start.clone();
		position[direction] = start[direction] + spacing * i;
		const hangar = createHangar({
			position,
		});

		group.add(hangar);
	}

	group.position.z += 0.75;

	return group;
}
