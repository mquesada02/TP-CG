import type { ReactNode } from "react";
import { createContext, useCallback, useState } from "react";
import type * as THREE from "three";

export type CameraType =
	| "general"
	| "airplane-chase"
	| "airplane-wing"
	| "ship-orbital"
	| "ship-chase"
	| "ship-cannon"
	| "tower-orbital"
	| "runway"
	| "free-roam";

export interface MovementState {
	forward: boolean;
	backward: boolean;
	left: boolean;
	right: boolean;
	up: boolean;
	down: boolean;
}

interface CameraContextType {
	currentCamera: CameraType;
	setCurrentCamera: (camera: CameraType) => void;
	cameraRef: React.RefObject<THREE.PerspectiveCamera | null> | null;
	setCameraRef: (ref: React.RefObject<THREE.PerspectiveCamera | null>) => void;
	movementState: MovementState;
	setMovementState: (state: MovementState) => void;
}

export const CameraContext = createContext<CameraContextType | undefined>(
	undefined,
);

export const CameraProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [currentCamera, setCurrentCamera] = useState<CameraType>("general");
	const [cameraRef, setCameraRefState] =
		useState<React.RefObject<THREE.PerspectiveCamera | null> | null>(null);
	const [movementState, setMovementState] = useState<MovementState>({
		backward: false,
		down: false,
		forward: false,
		left: false,
		right: false,
		up: false,
	});

	const setCameraRef = useCallback(
		(ref: React.RefObject<THREE.PerspectiveCamera | null>) => {
			setCameraRefState(ref);
		},
		[],
	);

	return (
		<CameraContext.Provider
			value={{
				cameraRef,
				currentCamera,
				movementState,
				setCameraRef,
				setCurrentCamera,
				setMovementState,
			}}
		>
			{children}
		</CameraContext.Provider>
	);
};
