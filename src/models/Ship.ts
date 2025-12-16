import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SHIP_COLOR } from "../constants/color";
import destructorModel from "./glb/destructor.glb?url";

interface ShipParts {
	wrapper: THREE.Group;
	turret: THREE.Mesh | null;
	cannon: THREE.Mesh | null;
}

export async function createShip(): Promise<ShipParts> {
	const loader = new GLTFLoader();

	return new Promise((resolve, reject) => {
		loader.load(
			destructorModel,
			(gltf) => {
				const ship = gltf.scene;

				let turret: THREE.Mesh | null = null;
				let cannon: THREE.Mesh | null = null;
				ship.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						if (child.name === "destructor") {
							child.material = new THREE.MeshPhongMaterial({
								color: SHIP_COLOR,
							});
						} else if (child.name === "torreta") {
							turret = child;
							child.material = new THREE.MeshPhongMaterial({
								color: SHIP_COLOR,
							});
						} else if (child.name === "canon") {
							cannon = child;
							child.material = new THREE.MeshPhongMaterial({
								color: SHIP_COLOR,
							});
						}
					}
				});

				const box = new THREE.Box3().setFromObject(ship);
				const center = box.getCenter(new THREE.Vector3());

				ship.position.set(-center.x, -center.y, -center.z);

				const wrapper = new THREE.Group();
				wrapper.add(ship);
				wrapper.scale.multiplyScalar(0.5);
				wrapper.position.set(0, 2.5, 50);

				resolve({ cannon, turret, wrapper });
			},
			undefined,
			(error) => {
				reject(error);
			},
		);
	});
}
