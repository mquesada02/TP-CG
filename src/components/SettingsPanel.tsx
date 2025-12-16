import { useState } from "react";
import { useCannon } from "../hooks/useCannon";
import { ShipControls } from "./ShipControls";
import { TimeControls } from "./TimeControls";

export const SettingsPanel = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const {
		projectileSpeed,
		setProjectileSpeed,
		gravity,
		setGravity,
		projectileCount,
	} = useCannon();

	return (
		<section
			aria-label="Panel de configuración"
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
			style={{
				background: "rgba(0, 0, 0, 0.8)",
				borderRadius: "8px",
				boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
				color: "white",
				left: "16px",
				overflow: "hidden",
				position: "fixed",
				top: "16px",
				zIndex: 1000,
			}}
		>
			<div
				style={{
					alignItems: "center",
					background: "transparent",
					border: "none",
					color: "white",
					display: "flex",
					fontSize: "20px",
					gap: "8px",
					padding: "12px 16px",
					width: "100%",
				}}
			>
				<span>⚙️</span>
				<span style={{ fontSize: "14px", fontWeight: "bold" }}>
					Configuración
				</span>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateRows: isExpanded ? "1fr" : "0fr",
					transition: "grid-template-rows 0.3s ease-out",
				}}
			>
				<div style={{ overflow: "hidden" }}>
					<div
						style={{
							maxHeight: "70vh",
							overflowY: "auto",
							padding: "0 16px 16px",
						}}
					>
						<div
							style={{
								borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
								marginBottom: "16px",
								paddingBottom: "16px",
							}}
						>
							<h3
								style={{
									alignItems: "center",
									display: "flex",
									fontSize: "16px",
									gap: "8px",
									margin: "0 0 12px 0",
								}}
							>
								<span>Tiempo</span>
							</h3>
							<TimeControls />
						</div>

						<div
							style={{
								borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
								marginBottom: "16px",
								paddingBottom: "16px",
							}}
						>
							<h3
								style={{
									alignItems: "center",
									display: "flex",
									fontSize: "16px",
									gap: "8px",
									margin: "0 0 12px 0",
								}}
							>
								<span>Destructor</span>
							</h3>
							<ShipControls />
						</div>

						<div>
							<h3
								style={{
									alignItems: "center",
									display: "flex",
									fontSize: "16px",
									gap: "8px",
									margin: "0 0 12px 0",
								}}
							>
								<span>Cañón</span>
							</h3>

							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "12px",
								}}
							>
								<div style={{ color: "#999", fontSize: "12px" }}>
									Controles: J/L (horizontal), I/K (vertical), Espacio
									(disparar)
								</div>

								<div>
									<div
										style={{
											display: "block",
											fontSize: "14px",
											marginBottom: "4px",
										}}
									>
										Velocidad proyectil: {projectileSpeed.toFixed(1)} m/s
									</div>
									<input
										type="range"
										min="10"
										max="50"
										step="1"
										value={projectileSpeed}
										onChange={(e) => setProjectileSpeed(Number(e.target.value))}
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
										Gravedad: {gravity.toFixed(1)} m/s²
									</div>
									<input
										type="range"
										min="1"
										max="20"
										step="0.5"
										value={gravity}
										onChange={(e) => setGravity(Number(e.target.value))}
										style={{ width: "100%" }}
									/>
								</div>

								<div
									style={{
										background: "rgba(0, 0, 0, 0.3)",
										borderRadius: "4px",
										fontSize: "12px",
										padding: "8px",
									}}
								>
									<div>Debug Info:</div>
									<div>Proyectiles activos: {projectileCount}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
