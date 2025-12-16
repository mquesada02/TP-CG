import { useContext } from "react";
import { CollisionContext } from "../context/collisionContext";

export const useCollision = () => {
	const context = useContext(CollisionContext);
	if (!context) {
		throw new Error("useCollision must be used within a CollisionProvider");
	}
	return context;
};
