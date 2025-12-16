import * as THREE from "three";

export function createAirplaneWheels() {
	const landingGear = new THREE.Group();

	const wheelRadius = 0.1;
	const wheelWidth = 0.08;
	const wheelSegments = 32;
	const wheelSpacing = 0.2;
	const sideOffset = 0.5;
	const height = -0.5;
	const barThickness = 0.05;
	const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
	const barMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });

	const wheelGroup = new THREE.Group();

	for (let i = 0; i < 3; i++) {
		const wheel = new THREE.Mesh(
			new THREE.CylinderGeometry(
				wheelRadius,
				wheelRadius,
				wheelWidth,
				wheelSegments,
			),
			wheelMaterial,
		);
		wheel.rotation.z = Math.PI / 2;
		wheel.position.z = i * wheelSpacing - wheelSpacing;
		wheel.position.y = height;
		wheelGroup.add(wheel);
	}

	const horizontalBarLength = wheelSpacing;
	const horizontalBar = new THREE.Mesh(
		new THREE.BoxGeometry(horizontalBarLength, barThickness, barThickness),
		barMaterial,
	);
	horizontalBar.position.y = height;
	horizontalBar.position.z = 0;
	wheelGroup.add(horizontalBar);

	wheelGroup.position.x = sideOffset;
	const leftWheelGroup = wheelGroup.clone();
	leftWheelGroup.position.x = sideOffset - 0.05;
	const rightWheelGroup = wheelGroup.clone();
	rightWheelGroup.position.x = sideOffset + 0.05;
	landingGear.add(leftWheelGroup, rightWheelGroup);

	const verticalBarHeight = 0.7;
	const verticalBar = new THREE.Mesh(
		new THREE.BoxGeometry(barThickness, verticalBarHeight, barThickness),
		barMaterial,
	);
	verticalBar.position.x = sideOffset;
	verticalBar.position.y = height + verticalBarHeight / 2;
	verticalBar.position.z = 0;
	landingGear.add(verticalBar);

	const group = new THREE.Group();

	const landingGearRight = landingGear.clone();
	landingGearRight.scale.x = -1;

	group.add(landingGear, landingGearRight);

	group.position.set(0.25, 14, 0);
	group.rotateY(Math.PI / 2);

	return group;
}
