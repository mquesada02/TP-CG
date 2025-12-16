import * as THREE from "three";
import { createHangarFloor } from "./components/aerodrome/floor/HangarFloor";
import { createHangarGroup } from "./components/aerodrome/hangar/HangarGroup";
import { createTower } from "./components/aerodrome/tower/Tower";

export function createAerodrome() {
	const floor = createHangarFloor();
	const hangars = createHangarGroup();
	const tower = createTower();

	const objectsOnTop = new THREE.Group();

	objectsOnTop.add(hangars, tower);

	const v = new THREE.Vector3(-1.5, 0, 0);

	objectsOnTop.position.add(v);

	const aerodrome = new THREE.Group();

	aerodrome.add(floor, objectsOnTop);

	return aerodrome;
}
