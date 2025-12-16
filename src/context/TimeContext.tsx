import { type ReactNode, useState } from "react";
import { TimeContext } from "./timeContext";

export const TimeProvider = ({ children }: { children: ReactNode }) => {
	const [currentTime, setCurrentTime] = useState(12);
	const [timeSpeed, setTimeSpeed] = useState(1);
	const [isTimePlaying, setIsTimePlaying] = useState(false);

	return (
		<TimeContext.Provider
			value={{
				currentTime,
				isTimePlaying,
				setCurrentTime,
				setIsTimePlaying,
				setTimeSpeed,
				timeSpeed,
			}}
		>
			{children}
		</TimeContext.Provider>
	);
};
