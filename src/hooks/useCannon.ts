import { useContext } from "react";
import { CannonContext } from "../context/cannonContext";

export function useCannon() {
	const context = useContext(CannonContext);
	if (context === undefined) {
		throw new Error("useCannon must be used within a CannonProvider");
	}
	return context;
}
