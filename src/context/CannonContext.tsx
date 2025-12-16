import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { CannonContext } from "./cannonContext";

interface CannonProviderProps {
	children: ReactNode;
}

export function CannonProvider({ children }: CannonProviderProps) {
	const turretRef = useRef<THREE.Mesh | null>(null);
	const cannonRef = useRef<THREE.Mesh | null>(null);
	const projectilesRef = useRef<THREE.Group | null>(null);

	const turretRotationRef = useRef(0);
	const cannonElevationRef = useRef(0);

	const [projectileSpeed, setProjectileSpeed] = useState(25);
	const [gravity, setGravity] = useState(9.8);
	const [projectileCount, setProjectileCount] = useState(0);
	const [canFire, setCanFire] = useState(true);

	const rotateLeft = useCallback(() => {
		if (turretRef.current) {
			turretRotationRef.current += 0.05;
			turretRef.current.rotation.y = turretRotationRef.current;
		}
	}, []);

	const rotateRight = useCallback(() => {
		if (turretRef.current) {
			turretRotationRef.current -= 0.05;
			turretRef.current.rotation.y = turretRotationRef.current;
		}
	}, []);

	const rotateUp = useCallback(() => {
		if (cannonRef.current) {
			const newElevation = cannonElevationRef.current + 0.05;
			if (newElevation <= Math.PI / 2) {
				cannonElevationRef.current = newElevation;
				const axis = new THREE.Vector3(0, 0, 1);
				cannonRef.current.rotateOnAxis(axis, 0.05);
			}
		}
	}, []);

	const rotateDown = useCallback(() => {
		if (cannonRef.current) {
			const newElevation = cannonElevationRef.current - 0.05;
			if (newElevation >= 0) {
				cannonElevationRef.current = newElevation;
				const axis = new THREE.Vector3(0, 0, 1);
				cannonRef.current.rotateOnAxis(axis, -0.05);
			}
		}
	}, []);

	const fire = useCallback(() => {
		if (!cannonRef.current || !projectilesRef.current || !canFire) return;

		const projectile = new THREE.Mesh(
			new THREE.SphereGeometry(0.3, 16, 16),
			new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0xff0000 }),
		);

		const cannonWorldPosition = new THREE.Vector3();
		cannonRef.current.getWorldPosition(cannonWorldPosition);

		const cannonWorldQuaternion = new THREE.Quaternion();
		cannonRef.current.getWorldQuaternion(cannonWorldQuaternion);

		const direction = new THREE.Vector3(0, 1, 0);
		direction.applyQuaternion(cannonWorldQuaternion);
		const muzzleOffset = direction.clone().multiplyScalar(3);
		projectile.position.copy(cannonWorldPosition).add(muzzleOffset);

		projectile.userData.velocity = direction.multiplyScalar(projectileSpeed);
		projectile.userData.lifetime = 0;
		projectile.userData.gravity = gravity;

		projectilesRef.current.add(projectile);
		setProjectileCount((prev) => prev + 1);

		setCanFire(false);
		setTimeout(() => {
			setCanFire(true);
		}, 250);
	}, [projectileSpeed, gravity, canFire]);

	const updateProjectileCount = useCallback(() => {
		if (projectilesRef.current) {
			setProjectileCount(projectilesRef.current.children.length);
		}
	}, []);

	const value = {
		cannonRef,
		fire,
		gravity,
		projectileCount,
		projectileSpeed,
		projectilesRef,
		rotateDown,
		rotateLeft,
		rotateRight,
		rotateUp,
		setGravity,
		setProjectileSpeed,
		turretRef,
		updateProjectileCount,
	};

	return (
		<CannonContext.Provider value={value}>{children}</CannonContext.Provider>
	);
}
