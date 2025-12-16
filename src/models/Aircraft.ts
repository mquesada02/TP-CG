import * as THREE from "three";
import { createAirplaneBack } from "./components/airplane/AirplaneBack";
import { createAirplaneBody } from "./components/airplane/AirplaneBody";
import { createAirplaneHead } from "./components/airplane/AirplaneHead";
import { createAirplaneMotors } from "./components/airplane/AirplaneMotors";
import { createAirplaneWheels } from "./components/airplane/AirplaneWheels";
import {
	createAirplaneBackWings,
	createAirplaneWings,
} from "./components/airplane/AirplaneWings";

interface AircraftParts {
	wrapper: THREE.Group;
	propellerLeft: THREE.Group;
	propellerRight: THREE.Group;
}

export function createAircraft(): AircraftParts {
	const mainBody = new THREE.Group();

	const body = createAirplaneBody();
	const head = createAirplaneHead();
	const back = createAirplaneBack();

	mainBody.add(body, head, back);

	const wings = new THREE.Group();

	const frontwings = createAirplaneWings();
	const backwings = createAirplaneBackWings();

	wings.add(frontwings, backwings);

	const motors = createAirplaneMotors();
	const wheels = createAirplaneWheels();

	const aircraft = new THREE.Group();

	aircraft.add(mainBody, wings, motors, wheels);

	aircraft.scale.multiplyScalar(0.5);
	aircraft.rotateY(Math.PI);

	const wrapper = new THREE.Group();
	wrapper.add(aircraft);
	wrapper.position.set(-12, 2, 9);

	const leftMotor = motors.children[0];
	const rightMotor = motors.children[1];
	const propellerLeft = leftMotor.userData.propeller as THREE.Group;
	const propellerRight = rightMotor.userData.propeller as THREE.Group;

	return {
		propellerLeft,
		propellerRight,
		wrapper,
	};
}
