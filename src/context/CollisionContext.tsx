import { useState } from "react";
import type { CollisionDetector } from "../utils/CollisionDetector";
import { CollisionContext } from "./collisionContext";

export const CollisionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [collisionDetector, setCollisionDetector] =
		useState<CollisionDetector | null>(null);

	return (
		<CollisionContext.Provider
			value={{ collisionDetector, setCollisionDetector }}
		>
			{children}
		</CollisionContext.Provider>
	);
};
