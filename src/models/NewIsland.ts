import * as THREE from "three";

export function createNewIsland() {
	const loader = new THREE.TextureLoader();
	const heightmap = loader.load("/src/maps/island/island3.png");

	const geometry = new THREE.PlaneGeometry(1000, 1000, 256, 256);
	const material = new THREE.MeshStandardMaterial({
		color: 0x88cc88,
		displacementMap: heightmap,
		displacementScale: 100,
		wireframe: false,
	});

	const terrain = new THREE.Mesh(geometry, material);
	terrain.rotation.x = -Math.PI / 2;
	return terrain;
}
