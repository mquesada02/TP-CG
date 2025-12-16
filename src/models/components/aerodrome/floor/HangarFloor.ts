import * as THREE from "three";
import { createAirstrip } from "./Airstrip";
import { createHangarBase } from "./HangarBase";

export function createHangarFloor() {
	const group = new THREE.Group();

	const hangarBase = createHangarBase();
	const airstrip = createAirstrip();

	group.add(hangarBase, airstrip);
	return group;
}
