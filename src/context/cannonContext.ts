import { createContext } from "react";
import type * as THREE from "three";

export interface CannonContextType {
	rotateLeft: () => void;
	rotateRight: () => void;
	rotateUp: () => void;
	rotateDown: () => void;
	fire: () => void;
	turretRef: React.RefObject<THREE.Mesh | null>;
	cannonRef: React.RefObject<THREE.Mesh | null>;
	projectilesRef: React.RefObject<THREE.Group | null>;
	projectileSpeed: number;
	setProjectileSpeed: (speed: number) => void;
	gravity: number;
	setGravity: (gravity: number) => void;
	projectileCount: number;
	updateProjectileCount: () => void;
}

export const CannonContext = createContext<CannonContextType | undefined>(
	undefined,
);
