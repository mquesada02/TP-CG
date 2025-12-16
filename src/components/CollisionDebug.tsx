import { useEffect } from "react";
import { useCollision } from "../hooks/useCollision";

export const CollisionDebug = () => {
	const { collisionDetector } = useCollision();

	useEffect(() => {
		if (!collisionDetector) return;

		const interval = setInterval(() => {
			console.log("Collision System Active");
		}, 5000);

		return () => clearInterval(interval);
	}, [collisionDetector]);

	return null;
};
