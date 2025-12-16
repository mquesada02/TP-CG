import { useTime } from "../hooks/useTime";

export const TimeControls = () => {
	const {
		currentTime,
		setCurrentTime,
		timeSpeed,
		setTimeSpeed,
		isTimePlaying,
		setIsTimePlaying,
	} = useTime();

	const formatTime = (time: number) => {
		const hours = Math.floor(time);
		const minutes = Math.floor((time % 1) * 60);
		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
			<div
				style={{
					fontSize: "32px",
					fontWeight: "bold",
					textAlign: "center",
				}}
			>
				{formatTime(currentTime)}
			</div>

			<div
				style={{
					display: "flex",
					gap: "8px",
					justifyContent: "center",
				}}
			>
				<button
					type="button"
					onClick={() => setIsTimePlaying(!isTimePlaying)}
					style={{
						background: isTimePlaying ? "#ef4444" : "#22c55e",
						border: "none",
						borderRadius: "4px",
						color: "white",
						cursor: "pointer",
						fontSize: "14px",
						outline: "none",
						padding: "8px 16px",
						transition: "background 0.3s ease, transform 0.1s ease",
					}}
					onMouseDown={(e) => {
						e.currentTarget.style.transform = "scale(0.95)";
					}}
					onMouseUp={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
				>
					{isTimePlaying ? "⏸ Pausar" : "▶ Reproducir"}
				</button>
				<button
					type="button"
					onClick={() => setCurrentTime(12)}
					style={{
						background: "#3b82f6",
						border: "none",
						borderRadius: "4px",
						color: "white",
						cursor: "pointer",
						fontSize: "14px",
						outline: "none",
						padding: "8px 16px",
						transition: "background 0.3s ease, transform 0.1s ease",
					}}
					onMouseDown={(e) => {
						e.currentTarget.style.transform = "scale(0.95)";
					}}
					onMouseUp={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.transform = "scale(1)";
					}}
				>
					Mediodía
				</button>
			</div>

			<div>
				<div
					style={{
						display: "block",
						fontSize: "14px",
						marginBottom: "4px",
					}}
				>
					Hora: {formatTime(currentTime)}
				</div>
				<input
					type="range"
					min="0"
					max="24"
					step="0.1"
					value={currentTime}
					onChange={(e) => setCurrentTime(Number(e.target.value))}
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
					Velocidad: {timeSpeed}x
				</div>
				<input
					type="range"
					min="0.1"
					max="10"
					step="0.1"
					value={timeSpeed}
					onChange={(e) => setTimeSpeed(Number(e.target.value))}
					style={{ width: "100%" }}
				/>
			</div>

			<div
				style={{
					display: "flex",
					gap: "8px",
					justifyContent: "center",
				}}
			>
				{[0.5, 1, 2, 5].map((speed) => (
					<button
						key={speed}
						type="button"
						onClick={() => setTimeSpeed(speed)}
						style={{
							background: timeSpeed === speed ? "#3b82f6" : "#374151",
							border: "none",
							borderRadius: "4px",
							color: "white",
							cursor: "pointer",
							fontSize: "12px",
							outline: "none",
							padding: "4px 12px",
							transition: "background 0.3s ease, transform 0.1s ease",
						}}
						onMouseDown={(e) => {
							e.currentTarget.style.transform = "scale(0.95)";
						}}
						onMouseUp={(e) => {
							e.currentTarget.style.transform = "scale(1)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "scale(1)";
						}}
					>
						{speed}x
					</button>
				))}
			</div>
		</div>
	);
};
