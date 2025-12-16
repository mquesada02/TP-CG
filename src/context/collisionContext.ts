import { createContext } from "react";
import type { CollisionDetector } from "../utils/CollisionDetector";

export interface CollisionContextType {
	collisionDetector: CollisionDetector | null;
	setCollisionDetector: (detector: CollisionDetector | null) => void;
}

export const CollisionContext = createContext<CollisionContextType | undefined>(
	undefined,
);
