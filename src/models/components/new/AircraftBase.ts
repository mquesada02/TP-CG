import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/Addons.js";
import { createAirplaneMotors } from "../airplane/AirplaneMotors";
import { createAirplaneWheels } from "../airplane/AirplaneWheels";
import { createAirplaneBackWings } from "../airplane/AirplaneWings";

const baseHeight = 4;
const baseRadius = 1;
const headHeight = baseHeight / 4;
const headRadius = baseRadius / 2;
const tipHeight = headHeight / 4;
const tipRadius = headRadius / 3;
const backHeight = baseHeight;
const backRadiusMax = baseRadius;
const backRadiusMin = headRadius;
const endHeight = backHeight;
const endRadiusMax = backRadiusMin;
const endRadiusMin = tipRadius / 8;
const endCenterOffset = endRadiusMax + endRadiusMin;

function createAircraftBase() {
	const parametricFunc = (
		u: number,
		v: number,
		target: THREE.Vector3,
	): void => {
		const theta = u * Math.PI * 2;
		const x = baseRadius * Math.cos(theta);
		const y = baseHeight * (v - 0.5);
		const z = baseRadius * Math.sin(theta);
		target.set(x, y, z);
	};

	const geom = new ParametricGeometry(parametricFunc, 64, 64);
	const material = new THREE.MeshPhongMaterial({
		color: "#f0f0f0",
		opacity: 1.0,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geom, material);

	mesh.rotateZ(THREE.MathUtils.degToRad(90));

	return mesh;
}

function createAircraftHead() {
	const parametricFunc = (
		u: number,
		v: number,
		target: THREE.Vector3,
	): void => {
		const theta = u * Math.PI * 2;
		const currentRadius = baseRadius + (headRadius - baseRadius) * v;
		const x = currentRadius * Math.cos(theta);
		const y = headHeight * (v - 0.5);
		const z = currentRadius * Math.sin(theta);
		target.set(x, y, z);
	};

	const geom = new ParametricGeometry(parametricFunc, 64, 64);
	const material = new THREE.MeshPhongMaterial({
		color: "#f0f0f0",
		opacity: 1.0,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geom, material);

	mesh.rotateZ(THREE.MathUtils.degToRad(-90));
	mesh.position.x += (baseHeight + headHeight) / 2;

	return mesh;
}

function createAircraftTip() {
	const parametricFunc = (
		u: number,
		v: number,
		target: THREE.Vector3,
	): void => {
		const theta = u * Math.PI * 2;
		const currentRadius = headRadius + (tipRadius - headRadius) * v;
		const x = currentRadius * Math.cos(theta);
		const y = tipHeight * (v - 0.5);
		const z = currentRadius * Math.sin(theta);
		target.set(x, y, z);
	};

	const geom = new ParametricGeometry(parametricFunc, 64, 64);
	const material = new THREE.MeshPhongMaterial({
		color: "#f0f0f0",
		opacity: 1.0,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geom, material);

	mesh.rotateZ(THREE.MathUtils.degToRad(-90));
	mesh.position.x += (baseHeight + tipHeight) / 2 + headHeight;

	return mesh;
}

function createAircraftTipTop() {
	const parametricFunc = (
		u: number,
		v: number,
		target: THREE.Vector3,
	): void => {
		const theta = u * Math.PI * 2;
		const r = tipRadius * v;
		const x = 0;
		const y = r * Math.cos(theta);
		const z = r * Math.sin(theta);
		target.set(x, y, z);
	};

	const geom = new ParametricGeometry(parametricFunc, 64, 64);
	const material = new THREE.MeshPhongMaterial({
		color: "#f0f0f0",
		opacity: 1.0,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geom, material);

	mesh.position.x = baseHeight / 2 + headHeight + tipHeight;

	return mesh;
}

function createAircraftBack() {
	const parametricFunc = (
		u: number,
		v: number,
		target: THREE.Vector3,
	): void => {
		const theta = u * Math.PI * 2;
		const taper = (1 - Math.cos(theta)) / 2;
		const currentRadius =
			backRadiusMax - (backRadiusMax - backRadiusMin) * v * taper;

		const x = currentRadius * Math.cos(theta);
		const y = backHeight * (v - 0.5);
		const z = currentRadius * Math.sin(theta);
		target.set(x, y, z);
	};

	const geom = new ParametricGeometry(parametricFunc, 64, 64);
	const material = new THREE.MeshPhongMaterial({
		color: "#f0f0f0",
		opacity: 1.0,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geom, material);

	mesh.rotateZ(THREE.MathUtils.degToRad(90));
	mesh.position.x -= baseHeight;

	return mesh;
}

function createAircraftEnd() {
	const parametricFunc = (
		u: number,
		v: number,
		target: THREE.Vector3,
	): void => {
		const theta = u * Math.PI * 2;
		const taper = (1 - Math.cos(theta)) / 2;

		const radiusAtStart =
			backRadiusMax - (backRadiusMax - backRadiusMin) * taper;
		const radiusAtEnd = endRadiusMax - (endRadiusMax - endRadiusMin) * taper;

		const currentRadius = radiusAtStart + (radiusAtEnd - radiusAtStart) * v;

		const x = currentRadius * Math.cos(theta) + endCenterOffset * v;
		const y = endHeight * (v - 0.5);
		const z = currentRadius * Math.sin(theta);
		target.set(x, y, z);
	};

	const geom = new ParametricGeometry(parametricFunc, 64, 64);
	const material = new THREE.MeshPhongMaterial({
		color: "#f0f0f0",
		opacity: 1.0,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geom, material);

	mesh.rotateZ(THREE.MathUtils.degToRad(90));
	mesh.position.x -= baseHeight + backHeight;

	return mesh;
}

function createAircraftEndRing() {
	const parametricFunc = (
		u: number,
		v: number,
		target: THREE.Vector3,
	): void => {
		const theta = u * Math.PI * 2;
		const taper = (1 - Math.cos(theta)) / 2;

		const radiusAtEnd = endRadiusMax - (endRadiusMax - endRadiusMin) * taper;

		const currentRadius = endRadiusMin + (radiusAtEnd - endRadiusMin) * v;

		const x = currentRadius * Math.cos(theta) + endCenterOffset;
		const y = endHeight / 2;
		const z = currentRadius * Math.sin(theta);
		target.set(x, y, z);
	};

	const geom = new ParametricGeometry(parametricFunc, 64, 8);
	const material = new THREE.MeshPhongMaterial({
		color: "#f0f0f0",
		opacity: 1.0,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geom, material);

	mesh.rotateZ(THREE.MathUtils.degToRad(90));
	mesh.position.x -= baseHeight + backHeight;

	return mesh;
}

interface WingParams {
	span: number;

	rootRightX: number;
	rootLeftX: number;
	rootZ: number;

	tipRightX: number;
	tipLeftX: number;
	tipZ: number;

	offsetX: number;
	tipBlend?: number;
}

export function createAircraftWing(params: WingParams): THREE.Mesh {
	const {
		span,
		rootRightX,
		rootLeftX,
		rootZ,
		tipRightX,
		tipLeftX,
		tipZ,
		offsetX,
		tipBlend = 0.2,
	} = params;

	const surface = (u: number, v: number, target: THREE.Vector3): void => {
		const theta = u * Math.PI * 2;

		const bodyV = Math.min(v, 1.0 - tipBlend) / (1.0 - tipBlend);
		const tipV = Math.max(0, (v - (1.0 - tipBlend)) / tipBlend);

		const rightX = THREE.MathUtils.lerp(rootRightX, tipRightX, bodyV);
		const leftX = THREE.MathUtils.lerp(rootLeftX, tipLeftX, bodyV);
		const radiusZ = THREE.MathUtils.lerp(rootZ, tipZ, bodyV);

		const sideBlend = (Math.cos(theta) + 1) * 0.5;
		const radiusX = THREE.MathUtils.lerp(leftX, rightX, sideBlend);

		const tipScale = tipV > 0 ? Math.cos(tipV * Math.PI * 0.5) : 1.0;

		const x = radiusX * tipScale * Math.cos(theta) + offsetX * bodyV;

		const y = (bodyV - 0.5) * span;

		const z = radiusZ * tipScale * Math.sin(theta);

		target.set(x, y, z);
	};

	const geometry = new ParametricGeometry(surface, 96, 48);
	geometry.computeVertexNormals();

	const material = new THREE.MeshStandardMaterial({
		color: 0xf0f0f0,
		side: THREE.DoubleSide,
	});

	const mesh = new THREE.Mesh(geometry, material);

	mesh.rotateX(THREE.MathUtils.degToRad(90));
	mesh.position.z += span / 2;
	mesh.rotateY(THREE.MathUtils.degToRad(180));

	return mesh;
}

export function createAircraft() {
	const group = new THREE.Group();

	const base = createAircraftBase();

	const leftWing = createAircraftWing({
		offsetX: 1.2,
		rootLeftX: 1.1,

		rootRightX: 1.6,
		rootZ: 0.45,
		span: 6,
		tipBlend: 0.22,
		tipLeftX: 0.55,

		tipRightX: 0.8,
		tipZ: 0.22,
	});

	const rightWing = leftWing.clone();
	rightWing.rotateX(THREE.MathUtils.degToRad(180));
	rightWing.position.z -= 6;

	const wheels = createAirplaneWheels();
	wheels.position.set(0, 0, 0);
	wheels.position.add(base.position);
	wheels.position.y -= baseRadius;

	const motors = createAirplaneMotors();
	motors.position.set(0, 0, 0);
	motors.position.add(base.position);
	motors.position.y -= 15;

	motors.rotateY(THREE.MathUtils.degToRad(180));

	const backWings = createAirplaneBackWings();
	backWings.position.set(0, 0, 0);
	backWings.position.add(base.position);
	backWings.position.y -= 15;
	backWings.position.x -= 19;

	group.add(
		base,
		createAircraftHead(),
		createAircraftTip(),
		createAircraftTipTop(),
		createAircraftBack(),
		createAircraftEnd(),
		createAircraftEndRing(),
		leftWing,
		rightWing,
		wheels,
		motors,
		backWings,
	);

	group.scale.multiplyScalar(0.5);

	return group;
}
