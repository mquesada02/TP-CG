import { useEffect } from "react";
import { useAirplane } from "../hooks/useAirplane";

export const AirplaneControls: React.FC = () => {
	const { resetPosition } = useAirplane();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "KeyR") {
				e.preventDefault();
				resetPosition();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [resetPosition]);

	return null;
};
