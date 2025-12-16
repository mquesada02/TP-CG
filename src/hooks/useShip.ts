import { useContext } from "react";
import { ShipContext } from "../context/shipContext";

export const useShip = () => {
	const context = useContext(ShipContext);
	if (!context) {
		throw new Error("useShip must be used within ShipProvider");
	}
	return context;
};
