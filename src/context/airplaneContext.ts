import type * as THREE from "three";
import type { AirplaneController } from "../controllers/AirplaneController";

export interface AirplaneContextType {
	controller: AirplaneController | null;
	setController: (controller: AirplaneController) => void;
	propellerLeftRef: React.RefObject<THREE.Group | null> | null;
	propellerRightRef: React.RefObject<THREE.Group | null> | null;
	resetPosition: () => void;
}
