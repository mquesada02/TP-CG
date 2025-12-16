import * as THREE from "three";

function createEngineNacelle() {
	const points: THREE.Vector2[] = [];
	const segments = 20;
	const length = 2.5;

	for (let i = 0; i <= segments; i++) {
		const t = i / segments;
		const y = t * length - length / 2;
		let x: number;
		if (t < 0.1) {
			x = THREE.MathUtils.lerp(0.3, 0.75, t / 0.1);
		} else if (t < 0.85) {
			x = 0.75;
		} else {
			x = THREE.MathUtils.lerp(0.75, 0.55, (t - 0.85) / 0.15);
		}

		points.push(new THREE.Vector2(x, y));
	}

	const geometry = new THREE.LatheGeometry(points, 16);

	geometry.rotateZ(Math.PI / 2);

	const material = new THREE.MeshPhongMaterial({
		color: "#f0f0f0",
		flatShading: false,
		side: THREE.DoubleSide,
	});

	return new THREE.Mesh(geometry, material);
}

function createPropellerBlade() {
	const geometry = new THREE.BoxGeometry(0.08, 1.2, 0.15);

	geometry.translate(0, 0.6, 0);

	const material = new THREE.MeshPhongMaterial({
		color: 0x333333,
		flatShading: true,
	});

	const blade = new THREE.Mesh(geometry, material);

	return blade;
}

function createPropeller() {
	const propeller = new THREE.Group();

	const hubGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
	const hubMaterial = new THREE.MeshPhongMaterial({
		color: 0x888888,
	});

	const hub = new THREE.Mesh(hubGeometry, hubMaterial);
	hub.rotation.z = Math.PI / 2;
	propeller.add(hub);

	for (let i = 0; i < 4; i++) {
		const blade = createPropellerBlade();
		const angle = (i * Math.PI) / 2;
		blade.rotation.x = angle;

		propeller.add(blade);
	}

	propeller.rotateX(Math.PI / 4);

	return propeller;
}

function createMotor() {
	const motor = new THREE.Group();

	const nacelle = createEngineNacelle();
	motor.add(nacelle);

	const propeller = createPropeller();
	propeller.position.x = -1.5;
	motor.add(propeller);

	motor.userData.propeller = propeller;

	return motor;
}

export function createAirplaneMotors() {
	const motors = new THREE.Group();

	const leftMotor = createMotor();
	leftMotor.position.set(0, 19, -3);
	motors.add(leftMotor);

	const rightMotor = createMotor();
	rightMotor.position.set(0, 19, 3);
	motors.add(rightMotor);

	motors.scale.set(1, 0.75, 0.75);

	return motors;
}
