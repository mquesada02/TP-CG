import { useContext } from "react";
import { AirplaneContext } from "../context/AirplaneContext";

export const useAirplane = () => {
	const context = useContext(AirplaneContext);
	if (!context) {
		throw new Error("useAirplane must be used within AirplaneProvider");
	}
	return context;
};
