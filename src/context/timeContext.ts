import { createContext } from "react";

interface TimeContextType {
	currentTime: number;
	setCurrentTime: (time: number | ((prev: number) => number)) => void;
	timeSpeed: number;
	setTimeSpeed: (speed: number) => void;
	isTimePlaying: boolean;
	setIsTimePlaying: (playing: boolean) => void;
}

export const TimeContext = createContext<TimeContextType | undefined>(
	undefined,
);
