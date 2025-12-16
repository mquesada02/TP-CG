import { useContext } from "react";
import { TimeContext } from "../context/timeContext";

export const useTime = () => {
	const context = useContext(TimeContext);
	if (!context) {
		throw new Error("useTime must be used within TimeProvider");
	}
	return context;
};
