import * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { CameraType, MovementState } from "../context/CameraContext";

interface CameraUpdateParams {
	camera: THREE.PerspectiveCamera;
	controls: OrbitControls;
	cameraType: CameraType;
	airplaneRef: THREE.Group | null;
	shipRef: THREE.Group | null;
	towerPosition?: THREE.Vector3;
	cannonRef?: THREE.Object3D | null;
	movementState?: MovementState;
}

const DYNAMIC_CAMERAS: CameraType[] = [
	"airplane-chase",
	"airplane-wing",
	"ship-chase",
	"ship-cannon",
	"free-roam",
];

export function shouldUpdateCameraEveryFrame(cameraType: CameraType): boolean {
	return DYNAMIC_CAMERAS.includes(cameraType);
}

export function updateCameraPosition({
	camera,
	controls,
	cameraType,
	airplaneRef,
	shipRef,
	towerPosition = new THREE.Vector3(-1.5, 0, 0),
	cannonRef,
	movementState,
}: CameraUpdateParams): void {
	const isOrbitalCamera = [
		"general",
		"ship-orbital",
		"tower-orbital",
		"runway",
	].includes(cameraType);
	controls.enabled = isOrbitalCamera;

	controls.enableDamping = isOrbitalCamera;

	switch (cameraType) {
		case "general": {
			camera.position.set(50, 40, 50);
			controls.target.set(0, 0, 0);
			break;
		}

		case "airplane-chase": {
			if (airplaneRef) {
				const offset = new THREE.Vector3(-15, 8, 0);
				offset.applyQuaternion(airplaneRef.quaternion);
				camera.position.copy(airplaneRef.position).add(offset);

				const lookAtOffset = new THREE.Vector3(10, 0, 0);
				lookAtOffset.applyQuaternion(airplaneRef.quaternion);
				const lookAtPoint = airplaneRef.position.clone().add(lookAtOffset);
				camera.lookAt(lookAtPoint);
			}
			break;
		}

		case "airplane-wing": {
			if (airplaneRef) {
				const offset = new THREE.Vector3(0, 10, 10);
				offset.applyQuaternion(airplaneRef.quaternion);
				camera.position.copy(airplaneRef.position).add(offset);

				const lookAtOffset = new THREE.Vector3(10, 5, 0);
				lookAtOffset.applyQuaternion(airplaneRef.quaternion);
				const lookAtPoint = airplaneRef.position.clone().add(lookAtOffset);
				camera.lookAt(lookAtPoint);
			}
			break;
		}

		case "ship-orbital": {
			if (shipRef) {
				const distance = 30;
				const height = 20;
				const angle = Date.now() * 0.0005;
				camera.position.set(
					shipRef.position.x + Math.cos(angle) * distance,
					shipRef.position.y + height,
					shipRef.position.z + Math.sin(angle) * distance,
				);
				controls.target.copy(shipRef.position);
				controls.target.y += 5;
			}
			break;
		}

		case "ship-chase": {
			if (shipRef) {
				const offset = new THREE.Vector3(0, 15, 25);
				offset.applyQuaternion(shipRef.quaternion);
				camera.position.copy(shipRef.position).add(offset);

				const lookAtOffset = new THREE.Vector3(0, 8, -10);
				lookAtOffset.applyQuaternion(shipRef.quaternion);
				const lookAtPoint = shipRef.position.clone().add(lookAtOffset);
				camera.lookAt(lookAtPoint);
			}
			break;
		}

		case "ship-cannon": {
			if (cannonRef && shipRef) {
				const cannonWorldPos = new THREE.Vector3();
				cannonRef.getWorldPosition(cannonWorldPos);

				const backOffset = new THREE.Vector3(0, 1, -3);
				backOffset.applyQuaternion(
					cannonRef.getWorldQuaternion(new THREE.Quaternion()),
				);
				camera.position.copy(cannonWorldPos).add(backOffset);

				const forwardOffset = new THREE.Vector3(0, 0, 20);
				forwardOffset.applyQuaternion(
					cannonRef.getWorldQuaternion(new THREE.Quaternion()),
				);
				const lookAtPoint = cannonWorldPos.clone().add(forwardOffset);
				camera.lookAt(lookAtPoint);
				camera.rotateY(Math.PI / 2);
			}
			break;
		}

		case "tower-orbital": {
			const distance = 20;
			const height = 15;
			camera.position.set(
				towerPosition.x + distance,
				towerPosition.y + height,
				towerPosition.z + distance,
			);
			controls.target.copy(towerPosition);
			controls.target.y += 10;
			console.log("Tower-orbital camera:", {
				enabled: controls.enabled,
				position: camera.position.toArray(),
				target: controls.target.toArray(),
			});
			break;
		}

		case "runway": {
			const aerodromePosition = new THREE.Vector3(-1.5, 0, 0);
			camera.position.set(
				aerodromePosition.x + 40,
				aerodromePosition.y + 20,
				aerodromePosition.z + 40,
			);
			controls.target.copy(aerodromePosition);
			controls.target.y += 5;
			console.log("Runway camera:", {
				enabled: controls.enabled,
				position: camera.position.toArray(),
				target: controls.target.toArray(),
			});
			break;
		}

		case "free-roam": {
			if (movementState) {
				const moveSpeed = 0.5;
				const direction = new THREE.Vector3();
				const right = new THREE.Vector3();

				camera.getWorldDirection(direction);
				right.crossVectors(camera.up, direction).normalize();

				if (movementState.forward) {
					camera.position.addScaledVector(direction, moveSpeed);
				}
				if (movementState.backward) {
					camera.position.addScaledVector(direction, -moveSpeed);
				}
				if (movementState.left) {
					camera.position.addScaledVector(right, moveSpeed);
				}
				if (movementState.right) {
					camera.position.addScaledVector(right, -moveSpeed);
				}
				if (movementState.up) {
					camera.position.y += moveSpeed;
				}
				if (movementState.down) {
					camera.position.y -= moveSpeed;
				}
			}

			controls.enabled = true;
			controls.enableDamping = true;
			break;
		}
	}

	if (
		cameraType === "general" ||
		cameraType === "tower-orbital" ||
		cameraType === "runway"
	) {
		controls.update();
		controls.saveState();
	}

	if (cameraType === "free-roam") {
		controls.update();
	}
}
