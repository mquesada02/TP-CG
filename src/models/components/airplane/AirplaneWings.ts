import * as THREE from "three";

function createWing(
	length = 5,
	R0 = 0.75,
	r = 0.4,
	radialSegments = 24,
	Ysup = 1,
	ovalFactor = 0.3,
) {
	const tubularSegments = 100;
	const geometry = new THREE.BufferGeometry();
	const positions = [];
	const indices = [];

	for (let i = 0; i <= tubularSegments; i++) {
		const t = i / tubularSegments;
		const x = t * length;

		const radius = R0 - t * (R0 - r);
		const radiusY = radius;
		const radiusZ = radius * ovalFactor;

		for (let j = 0; j <= radialSegments; j++) {
			const theta = (j / radialSegments) * Math.PI * 2;
			const y = Ysup - radiusY + radiusY * Math.cos(theta);
			const z = radiusZ * Math.sin(theta);
			positions.push(x, y, z);
		}
	}

	for (let i = 0; i < tubularSegments; i++) {
		for (let j = 0; j < radialSegments; j++) {
			const a = i * (radialSegments + 1) + j;
			const b = a + radialSegments + 1;
			indices.push(a, b, a + 1);
			indices.push(b, b + 1, a + 1);
		}
	}

	geometry.setIndex(indices);
	geometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(positions, 3),
	);
	geometry.computeVertexNormals();

	const material = new THREE.MeshPhongMaterial({ color: "#f0f0f0" });
	material.side = THREE.DoubleSide;
	const mesh = new THREE.Mesh(geometry, material);

	const createCap = (radius: number, posX: number) => {
		const radiusY = radius;
		const radiusZ = radius * ovalFactor;
		const capShape = new THREE.Shape();
		for (let j = 0; j <= radialSegments; j++) {
			const theta = (j / radialSegments) * Math.PI * 2;
			const y = radiusY * Math.cos(theta);
			const z = radiusZ * Math.sin(theta);
			if (j === 0) capShape.moveTo(y, z);
			else capShape.lineTo(y, z);
		}
		const capGeometry = new THREE.ShapeGeometry(capShape, radialSegments);
		const capMesh = new THREE.Mesh(capGeometry, material);
		capMesh.rotation.y = Math.PI / 2;
		capMesh.position.set(posX, Ysup - radiusY, 0);
		return capMesh;
	};

	const startCap = createCap(R0, 0);
	startCap.rotateZ(Math.PI / 2);
	const endCap = createCap(r, length);
	endCap.rotateZ(Math.PI / 2);

	const group = new THREE.Group();
	group.add(mesh);
	group.add(startCap);
	group.add(endCap);

	return group;
}

export function createAirplaneWings() {
	const wings = new THREE.Group();
	const first = createWing();
	first.position.set(0, 15, -0.5);
	first.rotateY(Math.PI / 2);
	first.rotateX(Math.PI / 2);
	const second = createWing();
	second.position.set(0, 15, 0.5);
	second.rotateY(-Math.PI / 2);
	second.rotateX(-Math.PI / 2);

	wings.add(first, second);

	return wings;
}

export function createAirplaneBackWings() {
	const wings = new THREE.Group();
	const first = createWing(5 / 3, 1 / 4, 0.125);
	first.position.set(9, 16 - 0.12, -0.2);
	first.rotateY(Math.PI / 2);
	first.rotateX(Math.PI / 2);
	const second = createWing(5 / 3, 1 / 4, 0.125);
	second.position.set(9, 16 - 0.12, 0.2);
	second.rotateY(-Math.PI / 2);
	second.rotateX(-Math.PI / 2);

	const third = createWing(5 / 3, 1 / 4, 0.125);
	third.position.set(9, 16 - 0.12, 0);
	third.rotateZ(Math.PI / 2);
	third.scale.x = 0.5;
	third.position.add(new THREE.Vector3(1.5, 0, 0));

	wings.add(first, second, third);

	return wings;
}
