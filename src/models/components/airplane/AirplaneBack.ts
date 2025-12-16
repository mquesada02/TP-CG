import * as THREE from "three";

function createTailFlatTop(
	length = 5,
	R0 = 1,
	r = 0.75,
	radialSegments = 24,
	Ysup = 1,
	capEnd = false,
) {
	const tubularSegments = 100;
	const geometry = new THREE.BufferGeometry();

	const positions = [];
	const indices = [];

	for (let i = 0; i <= tubularSegments; i++) {
		const t = i / tubularSegments;
		const x = t * length;

		const radius = R0 - t * (R0 - r);

		for (let j = 0; j <= radialSegments; j++) {
			const theta = (j / radialSegments) * Math.PI * 2;

			const y = Ysup - radius + radius * Math.cos(theta);
			const z = radius * Math.sin(theta);

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

	if (capEnd) {
		const finalRadius = r;
		const capGeometry = new THREE.CircleGeometry(finalRadius, radialSegments);
		const capMesh = new THREE.Mesh(capGeometry, material);

		capMesh.position.set(length, Ysup - finalRadius, 0);

		capMesh.rotation.y = Math.PI / 2;

		const group = new THREE.Group();
		group.add(mesh);
		group.add(capMesh);

		return group;
	}

	return mesh;
}

function createFirstBack() {
	const first = createTailFlatTop(4, 1, 0.6, 24, 1);
	first.position.set(2, 15, 0);
	return first;
}

function createSecondBack() {
	const second = createTailFlatTop(4, 0.6, 0.2, 24, 1, true);
	second.position.set(6, 15, 0);
	return second;
}

export function createAirplaneBack() {
	const group = new THREE.Group();

	const first = createFirstBack();
	const second = createSecondBack();

	group.add(first, second);

	return group;
}
