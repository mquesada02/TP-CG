import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function buildGridGeometryXZ(
	sizeX: number,
	sizeZ: number,
	segmentsX: number,
	segmentsZ: number,
): THREE.BufferGeometry {
	const vertsX = segmentsX + 1;
	const vertsZ = segmentsZ + 1;

	const vertexCount = vertsX * vertsZ;
	const positions = new Float32Array(vertexCount * 3);
	const uvs = new Float32Array(vertexCount * 2);

	const dx = sizeX / segmentsX;
	const dz = sizeZ / segmentsZ;

	const x0 = -sizeX / 2;
	const z0 = -sizeZ / 2;

	let v = 0,
		t = 0;
	for (let j = 0; j < vertsZ; j++) {
		const z = z0 + j * dz;
		const vCoord = j / segmentsZ;
		for (let i = 0; i < vertsX; i++) {
			const x = x0 + i * dx;
			const uCoord = i / segmentsX;

			positions[v++] = x;
			positions[v++] = 0;
			positions[v++] = z;

			uvs[t++] = uCoord;
			uvs[t++] = vCoord;
		}
	}

	const indexCount = segmentsX * segmentsZ * 6;
	const IndexArray = vertexCount > 65535 ? Uint32Array : Uint16Array;
	const indices = new IndexArray(indexCount);

	let k = 0;
	for (let j = 0; j < segmentsZ; j++) {
		for (let i = 0; i < segmentsX; i++) {
			const a = j * vertsX + i;
			const b = a + 1;
			const c = (j + 1) * vertsX + i;
			const d = c + 1;

			indices[k++] = a;
			indices[k++] = b;
			indices[k++] = d;

			indices[k++] = a;
			indices[k++] = d;
			indices[k++] = c;
		}
	}

	const geom = new THREE.BufferGeometry();
	geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
	geom.setIndex(new THREE.BufferAttribute(indices, 1));
	geom.computeVertexNormals();
	geom.computeBoundingBox();
	return geom;
}

export function createIsland(): THREE.Group {
	const group = new THREE.Group();

	const geom = buildGridGeometryXZ(128, 128, 128, 128);
	geom.rotateX(Math.PI);

	const textureLoader = new THREE.TextureLoader();

	const displacementMap = textureLoader.load(
		"/src/maps/island/island2.png",
		(texture) => {
			const canvas = document.createElement("canvas");
			const img = texture.image;
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");

			if (ctx) {
				ctx.drawImage(img, 0, 0);
				const imageData = ctx.getImageData(0, 0, img.width, img.height);
				const positions = geom.attributes.position.array as Float32Array;
				const uvs = geom.attributes.uv.array as Float32Array;

				for (let i = 0; i < positions.length / 3; i++) {
					const u = uvs[i * 2];
					const v = uvs[i * 2 + 1];

					const px = Math.floor(u * (img.width - 1));
					const py = Math.floor((1 - v) * (img.height - 1));
					const idx = (py * img.width + px) * 4;

					const heightValue = imageData.data[idx] / 255.0;
					positions[i * 3 + 1] += heightValue * 12;
				}

				geom.attributes.position.needsUpdate = true;
				geom.computeVertexNormals();
				geom.computeBoundingBox();

				setTimeout(() => {
					addGrassAndRocksWithRaycast(group, mesh);
				}, 100);
			}
		},
	);

	const material = new THREE.MeshStandardMaterial({
		color: 0x70ff30,
		flatShading: false,
		map: displacementMap,
		wireframe: false,
	});

	const mesh = new THREE.Mesh(geom, material);
	mesh.position.y -= 3;
	group.add(mesh);

	return group;
}

function addGrassAndRocksWithRaycast(
	group: THREE.Group,
	islandMesh: THREE.Mesh,
): void {
	const raycaster = new THREE.Raycaster();
	const islandSize = 128;
	const loader = new GLTFLoader();

	loader.load("/src/models/glb/conifer_medium-poly.glb", (gltf) => {
		const treeModel = gltf.scene;

		for (let i = 0; i < 18; i++) {
			const x = (Math.random() - 0.5) * islandSize * 0.8;
			let z = (Math.random() - 0.5) * islandSize * 0.8;

			while (z > -22 && z < -8) {
				z = (Math.random() - 0.5) * islandSize * 0.8;
			}

			raycaster.set(new THREE.Vector3(x, 20, z), new THREE.Vector3(0, -1, 0));

			const intersects = raycaster.intersectObject(islandMesh, false);

			if (intersects.length > 0) {
				const point = intersects[0].point;

				if (point.y > -2) {
					const tree = treeModel.clone();
					tree.position.copy(point);
					tree.scale.setScalar(0.5 + Math.random() * 0.5);
					tree.rotation.y = Math.random() * Math.PI * 2;
					group.add(tree);
				}
			}
		}
	});

	const rockGeometry = new THREE.SphereGeometry(0.3, 6, 5);
	const rockMaterial = new THREE.MeshStandardMaterial({
		color: 0x666666,
		metalness: 0.1,
		roughness: 0.95,
	});

	for (let i = 0; i < 40; i++) {
		const x = (Math.random() - 0.5) * islandSize * 0.9;
		const z = (Math.random() - 0.5) * islandSize * 0.9;

		raycaster.set(new THREE.Vector3(x, 20, z), new THREE.Vector3(0, -1, 0));

		const intersects = raycaster.intersectObject(islandMesh, false);

		if (intersects.length > 0) {
			const point = intersects[0].point;

			if (point.y > -2.5) {
				const rock = new THREE.Mesh(rockGeometry, rockMaterial);
				rock.position.copy(point);
				rock.scale.set(
					0.5 + Math.random() * 0.8,
					0.4 + Math.random() * 0.6,
					0.5 + Math.random() * 0.8,
				);
				rock.rotation.y = Math.random() * Math.PI * 2;
				group.add(rock);
			}
		}
	}
}
