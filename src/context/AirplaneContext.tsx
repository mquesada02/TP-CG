import type { ReactNode } from "react";
import { createContext, useCallback, useRef, useState } from "react";
import * as THREE from "three";
import type { AirplaneController } from "../controllers/AirplaneController";
import type { AirplaneContextType } from "./airplaneContext";

const AirplaneContext = createContext<AirplaneContextType | undefined>(
	undefined,
);

export const AirplaneProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [controller, setController] = useState<AirplaneController | null>(null);
	const propellerLeftRef = useRef<THREE.Group>(null);
	const propellerRightRef = useRef<THREE.Group>(null);

	const resetPosition = useCallback(() => {
		if (controller) {
			controller.setTransform({
				euler: new THREE.Euler(0, 0, 0, "YXZ"),
				position: new THREE.Vector3(3, 8, -10),
				throttle: 0,
			});
		}
	}, [controller]);

	return (
		<AirplaneContext.Provider
			value={{
				controller,
				propellerLeftRef,
				propellerRightRef,
				resetPosition,
				setController,
			}}
		>
			{children}
		</AirplaneContext.Provider>
	);
};

export { AirplaneContext };
