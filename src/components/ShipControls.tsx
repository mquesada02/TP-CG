import { useShip } from "../hooks/useShip";

export const ShipControls = () => {
	const { shipSpeed, setShipSpeed, shipRadius, setShipRadius } = useShip();

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
			<div>
				<div
					style={{
						display: "block",
						fontSize: "14px",
						marginBottom: "4px",
					}}
				>
					Velocidad: {shipSpeed.toFixed(1)}
				</div>
				<input
					type="range"
					min="0"
					max="2"
					step="0.1"
					value={shipSpeed}
					onChange={(e) => setShipSpeed(Number(e.target.value))}
					style={{ width: "100%" }}
				/>
			</div>

			<div>
				<div
					style={{
						display: "block",
						fontSize: "14px",
						marginBottom: "4px",
					}}
				>
					Radio: {shipRadius}
				</div>
				<input
					type="range"
					min="30"
					max="100"
					step="5"
					value={shipRadius}
					onChange={(e) => setShipRadius(Number(e.target.value))}
					style={{ width: "100%" }}
				/>
			</div>
		</div>
	);
};
