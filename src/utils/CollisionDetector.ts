import * as THREE from "three";

export interface CollisionObject {
	mesh: THREE.Object3D;
	boundingBox?: THREE.Box3;
	boundingSphere?: THREE.Sphere;
	type: "island" | "ship" | "aerodrome" | "airplane" | "projectile";
	isStatic?: boolean;
}

export class CollisionDetector {
	private collisionObjects: Map<string, CollisionObject> = new Map();
	private octree: Map<string, CollisionObject[]> = new Map();
	private gridSize = 20;

	addObject(id: string, object: CollisionObject): void {
		if (
			object.boundingBox === undefined &&
			object.boundingSphere === undefined
		) {
			const box = new THREE.Box3().setFromObject(object.mesh);
			object.boundingBox = box;
		}

		this.collisionObjects.set(id, object);

		if (object.isStatic && object.boundingBox) {
			this.addToGrid(id, object);
		}
	}

	removeObject(id: string): void {
		const obj = this.collisionObjects.get(id);
		if (obj?.isStatic) {
			this.removeFromGrid(id);
		}
		this.collisionObjects.delete(id);
	}

	private addToGrid(_id: string, object: CollisionObject): void {
		if (!object.boundingBox) return;

		const min = object.boundingBox.min;
		const max = object.boundingBox.max;

		const minCell = this.worldToGrid(min);
		const maxCell = this.worldToGrid(max);

		for (let x = minCell.x; x <= maxCell.x; x++) {
			for (let y = minCell.y; y <= maxCell.y; y++) {
				for (let z = minCell.z; z <= maxCell.z; z++) {
					const key = `${x},${y},${z}`;
					if (!this.octree.has(key)) {
						this.octree.set(key, []);
					}
					this.octree.get(key)?.push(object);
				}
			}
		}
	}

	private removeFromGrid(id: string): void {
		for (const [key, objects] of this.octree.entries()) {
			const obj = this.collisionObjects.get(id);
			const index = obj ? objects.indexOf(obj) : -1;
			if (index !== -1) {
				objects.splice(index, 1);
			}
			if (objects.length === 0) {
				this.octree.delete(key);
			}
		}
	}

	private worldToGrid(position: THREE.Vector3): THREE.Vector3 {
		return new THREE.Vector3(
			Math.floor(position.x / this.gridSize),
			Math.floor(position.y / this.gridSize),
			Math.floor(position.z / this.gridSize),
		);
	}

	checkCollision(
		position: THREE.Vector3,
		radius: number,
		excludeTypes?: string[],
	): { collision: boolean; object?: CollisionObject; point?: THREE.Vector3 } {
		const gridPos = this.worldToGrid(position);
		const sphere = new THREE.Sphere(position, radius);

		for (let x = gridPos.x - 1; x <= gridPos.x + 1; x++) {
			for (let y = gridPos.y - 1; y <= gridPos.y + 1; y++) {
				for (let z = gridPos.z - 1; z <= gridPos.z + 1; z++) {
					const key = `${x},${y},${z}`;
					const objects = this.octree.get(key);

					if (objects) {
						for (const obj of objects) {
							if (excludeTypes?.includes(obj.type)) continue;

							if (obj.boundingBox && sphere.intersectsBox(obj.boundingBox)) {
								return {
									collision: true,
									object: obj,
									point: position.clone(),
								};
							}

							if (
								obj.boundingSphere &&
								sphere.intersectsSphere(obj.boundingSphere)
							) {
								return {
									collision: true,
									object: obj,
									point: position.clone(),
								};
							}
						}
					}
				}
			}
		}

		return { collision: false };
	}

	raycast(
		origin: THREE.Vector3,
		direction: THREE.Vector3,
		maxDistance: number,
		excludeTypes?: string[],
	): {
		hit: boolean;
		object?: CollisionObject;
		point?: THREE.Vector3;
		distance?: number;
	} {
		const raycaster = new THREE.Raycaster(origin, direction, 0, maxDistance);
		let closestHit: {
			object: CollisionObject;
			point: THREE.Vector3;
			distance: number;
		} | null = null;

		for (const [, obj] of this.collisionObjects) {
			if (excludeTypes?.includes(obj.type)) continue;

			const intersects = raycaster.intersectObject(obj.mesh, true);

			if (intersects.length > 0) {
				const hit = intersects[0];
				if (!closestHit || hit.distance < closestHit.distance) {
					closestHit = {
						distance: hit.distance,
						object: obj,
						point: hit.point,
					};
				}
			}
		}

		if (closestHit) {
			return {
				distance: closestHit.distance,
				hit: true,
				object: closestHit.object,
				point: closestHit.point,
			};
		}

		return { hit: false };
	}

	updateDynamicObject(id: string, newPosition?: THREE.Vector3): void {
		const obj = this.collisionObjects.get(id);
		if (!obj || obj.isStatic) return;

		if (newPosition) {
			const box = new THREE.Box3().setFromObject(obj.mesh);
			obj.boundingBox = box;

			const sphere = new THREE.Sphere();
			box.getBoundingSphere(sphere);
			obj.boundingSphere = sphere;
		}
	}

	getTerrainHeight(x: number, z: number): number | null {
		const island = Array.from(this.collisionObjects.values()).find(
			(obj) => obj.type === "island",
		);

		if (!island || !island.mesh) return null;

		const origin = new THREE.Vector3(x, 100, z);
		const direction = new THREE.Vector3(0, -1, 0);

		const result = this.raycast(origin, direction, 200, [
			"ship",
			"aerodrome",
			"airplane",
			"projectile",
		]);

		if (result.hit && result.point) {
			return result.point.y;
		}

		return null;
	}

	clear(): void {
		this.collisionObjects.clear();
		this.octree.clear();
	}
}
