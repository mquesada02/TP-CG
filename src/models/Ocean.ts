import * as THREE from "three";

export function createOcean(size: number = 200): THREE.Mesh {
	const textureLoader = new THREE.TextureLoader();

	const normalMap = textureLoader.load("/src/maps/water/water_normal.jpeg");

	const geometry = new THREE.PlaneGeometry(size, size);
	const material = new THREE.MeshStandardMaterial({
		color: 0x1e90ff,
		normalMap: normalMap,
		opacity: 0.8,
		side: THREE.DoubleSide,
		transparent: true,
	});

	const mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = -0.5;

	return mesh;
}
