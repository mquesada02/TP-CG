import * as THREE from "three";

export const AIRPLANE_KEYS = {
	BANK_LEFT: "ArrowLeft",
	BANK_RIGHT: "ArrowRight",
	PITCH_DOWN: "ArrowDown",
	PITCH_UP: "ArrowUp",
	THROTTLE_DN: "PageDown",
	THROTTLE_UP: "PageUp",
};

export class AirplaneController {
	obj: THREE.Object3D;
	maxSpeed: number;
	accelResponse: number;
	drag: number;
	pitchLimit: number;
	bankLimit: number;
	pitchCmdRate: number;
	bankCmdRate: number;
	pitchResponse: number;
	bankResponse: number;
	pitchCentering: number;
	bankCentering: number;
	turnRateGain: number;
	yawTaxiRate: number;
	stallSpeed: number;
	ctrlVRange: number;
	minY: number;
	gravity: number;
	verticalDampingWhenPowered: number;
	collisionObjects: THREE.Object3D[];

	throttle: number;
	speed: number;
	verticalVelocity: number;
	heading: number;
	pitch: number;
	bank: number;
	pitchTarget: number;
	bankTarget: number;

	private _keys: Record<string, boolean>;
	private _fwd: THREE.Vector3;

	constructor(
		object3D: THREE.Object3D,
		{
			maxSpeed = 120,
			accelResponse = 2.0,
			drag = 0.01,
			pitchLimit = THREE.MathUtils.degToRad(45),
			bankLimit = THREE.MathUtils.degToRad(60),
			pitchCmdRateDeg = 60,
			bankCmdRateDeg = 90,
			pitchResponse = 4.0,
			bankResponse = 5.0,
			pitchCentering = 0.8,
			bankCentering = 1.2,
			turnRateGain = 1.2,
			yawTaxiRate = Math.PI * 1.2,
			stallSpeed = 12,
			ctrlVRange = 25,
			minY = 0,
			gravity = 9.81,
			verticalDampingWhenPowered = 2.5,
			collisionObjects = [],
		}: {
			maxSpeed?: number;
			accelResponse?: number;
			drag?: number;
			pitchLimit?: number;
			bankLimit?: number;
			pitchCmdRateDeg?: number;
			bankCmdRateDeg?: number;
			pitchResponse?: number;
			bankResponse?: number;
			pitchCentering?: number;
			bankCentering?: number;
			turnRateGain?: number;
			yawTaxiRate?: number;
			stallSpeed?: number;
			ctrlVRange?: number;
			minY?: number;
			gravity?: number;
			verticalDampingWhenPowered?: number;
			collisionObjects?: THREE.Object3D[];
		} = {},
	) {
		this.obj = object3D;

		this._keys = {
			[AIRPLANE_KEYS.PITCH_UP]: false,
			[AIRPLANE_KEYS.PITCH_DOWN]: false,
			[AIRPLANE_KEYS.BANK_LEFT]: false,
			[AIRPLANE_KEYS.BANK_RIGHT]: false,
		};

		this.maxSpeed = maxSpeed;
		this.accelResponse = accelResponse;
		this.drag = drag;

		this.pitchLimit = pitchLimit;
		this.bankLimit = bankLimit;

		this.pitchCmdRate = THREE.MathUtils.degToRad(pitchCmdRateDeg);
		this.bankCmdRate = THREE.MathUtils.degToRad(bankCmdRateDeg);

		this.pitchResponse = pitchResponse;
		this.bankResponse = bankResponse;

		this.pitchCentering = pitchCentering;
		this.bankCentering = bankCentering;

		this.turnRateGain = turnRateGain;
		this.yawTaxiRate = yawTaxiRate;

		this.stallSpeed = stallSpeed;
		this.ctrlVRange = ctrlVRange;

		this.minY = minY;
		this.gravity = gravity;
		this.verticalDampingWhenPowered = verticalDampingWhenPowered;
		this.collisionObjects = collisionObjects;

		this.throttle = 0;
		this.speed = 0;
		this.verticalVelocity = 0;

		this._fwd = new THREE.Vector3(1, 0, 0);

		const e = new THREE.Euler().setFromQuaternion(this.obj.quaternion, "YXZ");
		this.heading = e.y;
		this.pitch = e.x;
		this.bank = e.z;

		this.pitchTarget = this.pitch;
		this.bankTarget = 0;

		window.addEventListener("keydown", this._onKeyDown.bind(this), {
			passive: false,
		});
		window.addEventListener("keyup", this._onKeyUp.bind(this), {
			passive: false,
		});
		window.addEventListener("blur", this._onBlur.bind(this));
	}

	dispose() {
		window.removeEventListener("keydown", this._onKeyDown.bind(this));
		window.removeEventListener("keyup", this._onKeyUp.bind(this));
		window.removeEventListener("blur", this._onBlur.bind(this));
	}

	private _onKeyDown(e: KeyboardEvent) {
		if (Object.values(AIRPLANE_KEYS).includes(e.code)) e.preventDefault();

		if (e.code in this._keys) this._keys[e.code] = true;
		if (e.code === AIRPLANE_KEYS.THROTTLE_UP)
			this.throttle = Math.min(1, this.throttle + 0.05);
		if (e.code === AIRPLANE_KEYS.THROTTLE_DN)
			this.throttle = Math.max(0, this.throttle - 0.05);
	}

	private _onKeyUp(e: KeyboardEvent) {
		if (e.code in this._keys) this._keys[e.code] = false;
	}

	private _onBlur() {
		for (const k in this._keys) this._keys[k] = false;
	}

	private _authority() {
		const a = THREE.MathUtils.clamp(
			(this.speed - this.stallSpeed) / this.ctrlVRange,
			0,
			1,
		);
		return a * a * (3 - 2 * a);
	}

	setTransform({
		position,
		quaternion,
		euler,
		throttle,
	}: {
		position?: THREE.Vector3;
		quaternion?: THREE.Quaternion;
		euler?: THREE.Euler;
		throttle?: number;
	} = {}) {
		if (position) this.obj.position.copy(position);
		if (quaternion) {
			this.obj.quaternion.copy(quaternion);
		} else if (euler) {
			this.obj.quaternion.setFromEuler(euler);
		}

		if (typeof throttle === "number") {
			this.throttle = THREE.MathUtils.clamp(throttle, 0, 1);
			this.speed = this.throttle * this.maxSpeed;
		}

		const eul = new THREE.Euler().setFromQuaternion(this.obj.quaternion, "YXZ");
		this.heading = eul.y;
		this.pitch = eul.x;
		this.bank = eul.z;

		this.pitchTarget = this.pitch;
		this.bankTarget = this.bank;

		if (this.obj.position.y < this.minY) this.obj.position.y = this.minY;
		this.verticalVelocity = 0;
	}

	getEnginePower() {
		return this.throttle;
	}

	update(dt: number) {
		const up = this._keys[AIRPLANE_KEYS.PITCH_UP] ? 1 : 0;
		const dn = this._keys[AIRPLANE_KEYS.PITCH_DOWN] ? 1 : 0;
		const rt = this._keys[AIRPLANE_KEYS.BANK_RIGHT] ? 1 : 0;
		const lt = this._keys[AIRPLANE_KEYS.BANK_LEFT] ? 1 : 0;

		const pitchCmd = (dn - up) * this.pitchCmdRate;
		const bankCmd = (lt - rt) * this.bankCmdRate;

		this.pitchTarget = THREE.MathUtils.clamp(
			this.pitchTarget + pitchCmd * dt,
			-this.pitchLimit,
			this.pitchLimit,
		);
		this.bankTarget = THREE.MathUtils.clamp(
			this.bankTarget + bankCmd * dt,
			-this.bankLimit,
			this.bankLimit,
		);

		if (!up && !dn) {
			const k = 1 - Math.exp(-this.pitchCentering * dt);
			this.pitchTarget = THREE.MathUtils.lerp(this.pitchTarget, 0, k);
		}
		if (!rt && !lt) {
			const k = 1 - Math.exp(-this.bankCentering * dt);
			this.bankTarget = THREE.MathUtils.lerp(this.bankTarget, 0, k);
		}

		const A = this._authority();
		const kp = 1 - Math.exp(-(this.pitchResponse * (0.4 + 0.6 * A)) * dt);
		const kb = 1 - Math.exp(-(this.bankResponse * (0.4 + 0.6 * A)) * dt);
		this.pitch += (this.pitchTarget - this.pitch) * kp;
		this.bank += (this.bankTarget - this.bank) * kb;

		const lr = lt - rt;
		if (A < 0.15) {
			this.heading += this.yawTaxiRate * lr * dt;
		} else {
			const speedNorm = THREE.MathUtils.clamp(
				this.speed / Math.max(this.maxSpeed, 1e-3),
				0,
				1,
			);
			this.heading += this.turnRateGain * Math.tan(this.bank) * speedNorm * dt;
		}

		const e = new THREE.Euler(this.pitch, this.heading, this.bank, "YXZ");
		this.obj.quaternion.setFromEuler(e);

		const targetSpeed = this.throttle * this.maxSpeed;
		const alpha = 1 - Math.exp(-this.accelResponse * dt);
		this.speed += (targetSpeed - this.speed) * alpha;
		this.speed = Math.max(0, this.speed - this.drag * this.speed * dt);

		const fwd = this._fwd.clone().applyQuaternion(this.obj.quaternion);

		this.obj.position.addScaledVector(fwd, this.speed * dt);

		const airborne = this.obj.position.y > this.minY + 1e-4;

		if (airborne) {
			if (this.throttle <= 0.001) {
				this.verticalVelocity -= this.gravity * dt;
			} else {
				const damp = Math.exp(-this.verticalDampingWhenPowered * dt);
				this.verticalVelocity *= damp;
			}
			this.obj.position.y += this.verticalVelocity * dt;
		}

		if (this.obj.position.y <= this.minY) {
			this.obj.position.y = this.minY;
			this.verticalVelocity = 0;
		}

		/*
		const airplaneBBox = new THREE.Box3().setFromObject(this.obj);

		for (const collisionObj of this.collisionObjects) {
			const objBBox = new THREE.Box3().setFromObject(collisionObj);

			if (airplaneBBox.intersectsBox(objBBox)) {
								this.obj.position.copy(prevPosition);
				this.speed *= 0.5;
				this.verticalVelocity = prevVelocity > 0 ? prevVelocity * 0.5 : 0;
				break;
			}
		}
		*/
	}

	getStatus() {
		return {
			bankDeg: THREE.MathUtils.radToDeg(this.bank),
			pitchDeg: THREE.MathUtils.radToDeg(this.pitch),
			speed: this.speed,
			throttle: this.throttle,
		};
	}
}
