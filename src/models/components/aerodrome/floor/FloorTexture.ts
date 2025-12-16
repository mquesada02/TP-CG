import * as THREE from "three";

export interface RoadTextures {
	diffuseMap: THREE.DataTexture;
	normalMap: THREE.DataTexture;
}

export function createRoadTextures(
	width: number = 1024,
	height: number = 1024,
): RoadTextures {
	const size = width * height;

	const diffuseData = new Uint8Array(4 * size);
	const normalData = new Uint8Array(4 * size);

	const asphaltBaseColor = { b: 50, g: 50, r: 50 };
	const lineBaseColor = { b: 220, g: 230, r: 230 };

	for (let i = 0; i < size; i++) {
		const stride = i * 4;

		const x = (i % width) / width;

		const isLine = (x > 0.47 && x < 0.49) || (x > 0.51 && x < 0.53);

		const clamp = (num: number) => Math.max(0, Math.min(255, num));

		if (isLine) {
			const lineGrit = (Math.random() - 0.5) * 10;
			diffuseData[stride] = clamp(lineBaseColor.r + lineGrit);
			diffuseData[stride + 1] = clamp(lineBaseColor.g + lineGrit);
			diffuseData[stride + 2] = clamp(lineBaseColor.b + lineGrit);
			diffuseData[stride + 3] = 255;

			normalData[stride] = 128;
			normalData[stride + 1] = 128;
			normalData[stride + 2] = 255;
			normalData[stride + 3] = 255;
		} else {
			const asphaltGrit = (Math.random() - 0.5) * 30;
			diffuseData[stride] = clamp(asphaltBaseColor.r + asphaltGrit);
			diffuseData[stride + 1] = clamp(asphaltBaseColor.g + asphaltGrit);
			diffuseData[stride + 2] = clamp(asphaltBaseColor.b + asphaltGrit);
			diffuseData[stride + 3] = 255;

			const normalNoise = 35;
			const randomX = (Math.random() - 0.5) * normalNoise;
			const randomY = (Math.random() - 0.5) * normalNoise;

			normalData[stride] = clamp(128 + randomX);
			normalData[stride + 1] = clamp(128 + randomY);
			normalData[stride + 2] = 255;
			normalData[stride + 3] = 255;
		}
	}

	const diffuseMap = new THREE.DataTexture(
		diffuseData,
		width,
		height,
		THREE.RGBAFormat,
	);
	setupRoadTextureConfig(diffuseMap);

	const normalMap = new THREE.DataTexture(
		normalData,
		width,
		height,
		THREE.RGBAFormat,
	);
	setupRoadTextureConfig(normalMap);

	return { diffuseMap, normalMap };
}

function setupRoadTextureConfig(texture: THREE.DataTexture) {
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = 16;
	texture.needsUpdate = true;
}
