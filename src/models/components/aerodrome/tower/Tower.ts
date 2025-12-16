import * as THREE from "three";
import { createTowerBottom } from "./TowerBottom";
import { createTowerTop } from "./TowerTop";

export function createTower() {
	const towerTop = createTowerTop();
	const towerBottom = createTowerBottom();

	const group = new THREE.Group();

	group.add(towerTop, towerBottom);

	const v = new THREE.Vector3(7, 10, 4.25);

	group.position.add(v);

	return group;
}
