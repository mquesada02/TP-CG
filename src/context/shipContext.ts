import { createContext } from "react";

interface ShipContextType {
	shipSpeed: number;
	setShipSpeed: (speed: number) => void;
	shipRadius: number;
	setShipRadius: (radius: number) => void;
}

export const ShipContext = createContext<ShipContextType | undefined>(
	undefined,
);
