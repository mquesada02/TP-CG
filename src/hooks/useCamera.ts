import { useContext } from "react";
import { CameraContext } from "../context/CameraContext";

export const useCamera = () => {
	const context = useContext(CameraContext);
	if (!context) {
		throw new Error("useCamera must be used within CameraProvider");
	}
	return context;
};
