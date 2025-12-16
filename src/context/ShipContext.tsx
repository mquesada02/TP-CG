import { type ReactNode, useState } from "react";
import { ShipContext } from "./shipContext";

export const ShipProvider = ({ children }: { children: ReactNode }) => {
	const [shipSpeed, setShipSpeed] = useState(0.1);
	const [shipRadius, setShipRadius] = useState(60);

	return (
		<ShipContext.Provider
			value={{
				setShipRadius,
				setShipSpeed,
				shipRadius,
				shipSpeed,
			}}
		>
			{children}
		</ShipContext.Provider>
	);
};
