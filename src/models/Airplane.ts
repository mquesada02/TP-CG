import * as THREE from "three";
import { createAircraft } from "./components/new/AircraftBase";

interface AirplaneParts {
	wrapper: THREE.Group;
	propellerLeft: THREE.Group;
	propellerRight: THREE.Group;
}

export function createAirplane(): AirplaneParts {
	const airplane = createAircraft();

	let leftProp: THREE.Group | null = null;
	let rightProp: THREE.Group | null = null;

	airplane.traverse((child) => {
		if (child.userData.propeller) {
			if (!leftProp) {
				leftProp = child.userData.propeller;
			} else if (!rightProp) {
				rightProp = child.userData.propeller;
			}
		}
	});

	const wrapper = new THREE.Group();
	wrapper.add(airplane);
	wrapper.position.set(3, 8, -10);

	return {
		propellerLeft: leftProp || new THREE.Group(),
		propellerRight: rightProp || new THREE.Group(),
		wrapper,
	};
}
