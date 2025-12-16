import * as THREE from "three";

type IslandConfig = {
	heightMapUrl: string;
	width?: number;
	height?: number;
	segmentsX?: number;
	segmentsY?: number;
	maxHeight?: number;
};

async function loadHeightMap(url: string): Promise<ImageData> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";

		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Could not get canvas context"));
				return;
			}

			ctx.drawImage(img, 0, 0);
			const imageData = ctx.getImageData(0, 0, img.width, img.height);
			resolve(imageData);
		};

		img.onerror = () => reject(new Error("Failed to load height map"));
		img.src = url;
	});
}

function getElevation(heightMap: ImageData, u: number, v: number): number {
	const x = Math.floor(u * (heightMap.width - 1));
	const y = Math.floor(v * (heightMap.height - 1));
	const index = (y * heightMap.width + x) * 4;
	const gray = heightMap.data[index] / 255;
	return gray;
}

function createTerrainGeometry(
	heightMap: ImageData,
	width: number,
	height: number,
	segmentsX: number,
	segmentsY: number,
	maxHeight: number,
): THREE.BufferGeometry {
	const geometry = new THREE.BufferGeometry();
	const vertices: number[] = [];
	const indices: number[] = [];
	const uvs: number[] = [];
	const colors: number[] = [];
	const segmentWidth = width / segmentsX;
	const segmentHeight = height / segmentsY;
	const seaThreshold = 0.1;

	for (let y = 0; y <= segmentsY; y++) {
		for (let x = 0; x <= segmentsX; x++) {
			const posX = x * segmentWidth - width / 2;
			const posZ = y * segmentHeight - height / 2;
			const elevation = getElevation(heightMap, x / segmentsX, y / segmentsY);
			const posY = elevation * maxHeight;

			vertices.push(posX, posY, posZ);
			uvs.push(x / segmentsX, y / segmentsY);

			if (elevation < seaThreshold) {
				colors.push(0, 0, 0);
			} else {
				colors.push(0.227, 0.549, 0.227);
			}
		}
	}

	for (let y = 0; y < segmentsY; y++) {
		for (let x = 0; x < segmentsX; x++) {
			const a = x + (segmentsX + 1) * y;
			const b = x + (segmentsX + 1) * (y + 1);
			const c = x + 1 + (segmentsX + 1) * (y + 1);
			const d = x + 1 + (segmentsX + 1) * y;

			const elevA = getElevation(heightMap, x / segmentsX, y / segmentsY);
			const elevB = getElevation(heightMap, x / segmentsX, (y + 1) / segmentsY);
			const elevC = getElevation(
				heightMap,
				(x + 1) / segmentsX,
				(y + 1) / segmentsY,
			);
			const elevD = getElevation(heightMap, (x + 1) / segmentsX, y / segmentsY);

			if (
				elevA >= seaThreshold ||
				elevB >= seaThreshold ||
				elevD >= seaThreshold
			) {
				indices.push(a, b, d);
			}

			if (
				elevB >= seaThreshold ||
				elevC >= seaThreshold ||
				elevD >= seaThreshold
			) {
				indices.push(b, c, d);
			}
		}
	}

	geometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(vertices, 3),
	);
	geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
	geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
	geometry.setIndex(indices);
	geometry.computeVertexNormals();

	return geometry;
}

export async function createIsland(config: IslandConfig): Promise<THREE.Mesh> {
	const {
		heightMapUrl,
		width = 100,
		height = 100,
		segmentsX = 128,
		segmentsY = 128,
		maxHeight = 20,
	} = config;

	const heightMap = await loadHeightMap(heightMapUrl);
	const geometry = createTerrainGeometry(
		heightMap,
		width,
		height,
		segmentsX,
		segmentsY,
		maxHeight,
	);

	const material = new THREE.MeshPhongMaterial({
		side: THREE.DoubleSide,
		vertexColors: true,
	});

	return new THREE.Mesh(geometry, material);
}
