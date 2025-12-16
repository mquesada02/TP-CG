import { useEffect } from "react";
import { useCannon } from "../hooks/useCannon";

export function CannonControls() {
	const { rotateLeft, rotateRight, rotateUp, rotateDown, fire } = useCannon();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key.toLowerCase()) {
				case "j":
					rotateLeft();
					break;
				case "l":
					rotateRight();
					break;
				case "i":
					rotateUp();
					break;
				case "k":
					rotateDown();
					break;
				case " ":
					event.preventDefault();
					fire();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [rotateLeft, rotateRight, rotateUp, rotateDown, fire]);

	return null;
}
