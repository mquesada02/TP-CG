import { useEffect } from "react";
import type { CameraType } from "../context/CameraContext";
import { useCamera } from "../hooks/useCamera";

const CAMERA_KEYS: Record<string, CameraType> = {
	Digit0: "free-roam",
	Digit1: "general",
	Digit2: "airplane-chase",
	Digit3: "airplane-wing",
	Digit4: "ship-orbital",
	Digit5: "ship-chase",
	Digit6: "ship-cannon",
	Digit7: "tower-orbital",
	Digit8: "runway",
};

export const CameraControls: React.FC = () => {
	const { setCurrentCamera, currentCamera, movementState, setMovementState } =
		useCamera();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const cameraType = CAMERA_KEYS[e.code];
			if (cameraType) {
				e.preventDefault();
				console.log("Camera key pressed:", e.code, "->", cameraType);
				setCurrentCamera(cameraType);
				return;
			}

			if (currentCamera === "free-roam") {
				switch (e.code) {
					case "KeyW":
						setMovementState({ ...movementState, forward: true });
						break;
					case "KeyS":
						setMovementState({ ...movementState, backward: true });
						break;
					case "KeyA":
						setMovementState({ ...movementState, left: true });
						break;
					case "KeyD":
						setMovementState({ ...movementState, right: true });
						break;
					case "Space":
						setMovementState({ ...movementState, up: true });
						break;
					case "ShiftLeft":
					case "ShiftRight":
						setMovementState({ ...movementState, down: true });
						break;
				}
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (currentCamera === "free-roam") {
				switch (e.code) {
					case "KeyW":
						setMovementState({ ...movementState, forward: false });
						break;
					case "KeyS":
						setMovementState({ ...movementState, backward: false });
						break;
					case "KeyA":
						setMovementState({ ...movementState, left: false });
						break;
					case "KeyD":
						setMovementState({ ...movementState, right: false });
						break;
					case "Space":
						setMovementState({ ...movementState, up: false });
						break;
					case "ShiftLeft":
					case "ShiftRight":
						setMovementState({ ...movementState, down: false });
						break;
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [setCurrentCamera, currentCamera, movementState, setMovementState]);

	return null;
};
