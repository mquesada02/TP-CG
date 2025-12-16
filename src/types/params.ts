import type * as THREE from "three";

type BaseConfig = {
	position?: THREE.Vector3;
	rotation?: THREE.Euler;
	color?: THREE.ColorRepresentation;
};

export type BoxConfig = BaseConfig & {
	width?: number;
	height?: number;
	depth?: number;
};

export type CylinderConfig = BaseConfig & {
	radiusTop?: number;
	radiusBottom?: number;
	height?: number;
	radialSegments?: number;
	heightSegments?: number;
	openEnded?: boolean;
	thetaStart?: number;
	thetaLength?: number;
};
