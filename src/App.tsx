import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AirplaneControls } from "./components/AirplaneControls";
import { CameraControls } from "./components/CameraControls";
import { CannonControls } from "./components/CannonControls";
import { SettingsPanel } from "./components/SettingsPanel";
import { AirplaneProvider } from "./context/AirplaneContext";
import { CameraProvider } from "./context/CameraContext";
import { CannonProvider } from "./context/CannonContext";
import { CollisionProvider } from "./context/CollisionContext";
import { ShipProvider } from "./context/ShipContext";
import { TimeProvider } from "./context/TimeContext";
import { AirplaneController } from "./controllers/AirplaneController";
import { useAirplane } from "./hooks/useAirplane";
import { useCamera } from "./hooks/useCamera";
import { useCannon } from "./hooks/useCannon";
import { useShip } from "./hooks/useShip";
import { useTime } from "./hooks/useTime";
import { createAerodrome } from "./models/Aerodrome";
import { createAirplane } from "./models/Airplane";
import { createIsland } from "./models/components/Island";
import { createOcean } from "./models/Ocean";
import { createShip } from "./models/Ship";
import { updateCameraPosition } from "./utils/cameraManager";

const DEBUG = true;

const Scene = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { currentTime, setCurrentTime, timeSpeed, isTimePlaying } = useTime();
	const { shipSpeed, shipRadius } = useShip();
	const { currentCamera, movementState } = useCamera();
	const {
		turretRef,
		cannonRef,
		projectilesRef,
		gravity,
		updateProjectileCount,
	} = useCannon();
	const { setController, propellerLeftRef, propellerRightRef } = useAirplane();
	const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
	const hemisphereLightRef = useRef<THREE.HemisphereLight | null>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const shipRef = useRef<THREE.Group | null>(null);
	const airplaneRef = useRef<THREE.Group | null>(null);
	const shipAngleRef = useRef(0);
	const shipSpeedRef = useRef(shipSpeed);
	const shipRadiusRef = useRef(shipRadius);
	const lightsInitialized = useRef(false);
	const previousCameraRef = useRef<typeof currentCamera>(currentCamera);
	const currentCameraRef = useRef<typeof currentCamera>(currentCamera);
	const movementStateRef = useRef(movementState);
	const sunRef = useRef<THREE.Mesh | null>(null);

	useEffect(() => {
		currentCameraRef.current = currentCamera;
	}, [currentCamera]);

	useEffect(() => {
		movementStateRef.current = movementState;
	}, [movementState]);

	useEffect(() => {
		shipSpeedRef.current = shipSpeed;
	}, [shipSpeed]);

	useEffect(() => {
		shipRadiusRef.current = shipRadius;
	}, [shipRadius]);

	useEffect(() => {
		if (!isTimePlaying) return;

		let lastTime = Date.now();
		const interval = setInterval(() => {
			const now = Date.now();
			const delta = (now - lastTime) / 1000;
			lastTime = now;

			setCurrentTime((prev) => (prev + (delta * timeSpeed) / 60) % 24);
		}, 16);

		return () => clearInterval(interval);
	}, [isTimePlaying, timeSpeed, setCurrentTime]);

	useEffect(() => {
		if (!canvasRef.current) return;

		let islandGroup: THREE.Group | null = null;
		let oceanMesh: THREE.Mesh | null = null;
		let renderer: THREE.WebGLRenderer | null = null;
		let controls: OrbitControls | null = null;
		let animationId: number | null = null;
		let scene: THREE.Scene | null = null;
		let camera: THREE.PerspectiveCamera | null = null;
		let axesCamera: THREE.OrthographicCamera | null = null;
		let axesScene: THREE.Scene | null = null;
		let airplaneController: AirplaneController | null = null;
		const collisionObjects: THREE.Object3D[] = [];

		const init = async () => {
			if (!canvasRef.current) return;

			scene = new THREE.Scene();
			sceneRef.current = scene;
			scene.background = new THREE.Color(0x87ceeb);

			camera = new THREE.PerspectiveCamera(
				75,
				window.innerWidth / window.innerHeight,
				0.1,
				1000,
			);
			camera.position.set(50, 40, 50);
			camera.lookAt(0, 0, 0);

			renderer = new THREE.WebGLRenderer({
				antialias: true,
				canvas: canvasRef.current,
			});
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setPixelRatio(window.devicePixelRatio);

			controls = new OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true;
			controls.dampingFactor = 0.05;

			const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
			scene.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
			directionalLight.position.set(100, 80, 50);
			directionalLight.castShadow = true;
			scene.add(directionalLight);
			directionalLightRef.current = directionalLight;

			const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
			const sunMaterial = new THREE.MeshBasicMaterial({
				color: 0xffff00,
			});
			const sun = new THREE.Mesh(sunGeometry, sunMaterial);
			sun.position.copy(directionalLight.position);
			scene.add(sun);
			sunRef.current = sun;

			const hemisphereLight = new THREE.HemisphereLight(
				0x87ceeb,
				0x8b7355,
				0.5,
			);
			scene.add(hemisphereLight);
			hemisphereLightRef.current = hemisphereLight;
			lightsInitialized.current = true;

			if (DEBUG) {
				axesScene = new THREE.Scene();
				const axesHelper = new THREE.AxesHelper(50);
				axesScene.add(axesHelper);

				axesCamera = new THREE.OrthographicCamera(-100, 100, 100, -100, 1, 200);
				axesCamera.position.set(100, 100, 100);
				axesCamera.lookAt(0, 0, 0);
			}

			oceanMesh = createOcean(200);
			scene.add(oceanMesh);

			const aerodrome = createAerodrome();
			aerodrome.position.x += 15;
			aerodrome.position.z -= 20;
			aerodrome.position.y -= 3;
			scene.add(aerodrome);
			collisionObjects.push(aerodrome);

			const ship = await createShip();
			scene.add(ship.wrapper);
			shipRef.current = ship.wrapper;
			turretRef.current = ship.turret;
			cannonRef.current = ship.cannon;
			collisionObjects.push(ship.wrapper);

			const aircraft = createAirplane();
			scene.add(aircraft.wrapper);
			airplaneRef.current = aircraft.wrapper;
			if (propellerLeftRef) {
				propellerLeftRef.current = aircraft.propellerLeft;
			}
			if (propellerRightRef) {
				propellerRightRef.current = aircraft.propellerRight;
			}

			airplaneController = new AirplaneController(aircraft.wrapper, {
				collisionObjects: collisionObjects,
				maxSpeed: 120,
				minY: 6,
			});
			setController(airplaneController);

			const projectiles = new THREE.Group();
			scene.add(projectiles);
			projectilesRef.current = projectiles;

			try {
				islandGroup = createIsland();
				scene.add(islandGroup);
				collisionObjects.push(islandGroup);
			} catch (error) {
				console.error("Error loading island:", error);
			}

			const animate = () => {
				animationId = requestAnimationFrame(animate);

				if (camera && controls) {
					const currentCam = currentCameraRef.current;
					const cameraChanged = previousCameraRef.current !== currentCam;

					if (cameraChanged) {
						previousCameraRef.current = currentCam;

						if (currentCam === "free-roam") {
							camera.position.set(30, 30, 30);
							controls.target.set(0, 0, 0);
						}

						updateCameraPosition({
							airplaneRef: airplaneRef.current,
							camera,
							cameraType: currentCam,
							cannonRef: cannonRef.current,
							controls,
							movementState: movementStateRef.current,
							shipRef: shipRef.current,
							towerPosition: new THREE.Vector3(-1.5, 0, 0),
						});
					}
					if (!cameraChanged) {
						updateCameraPosition({
							airplaneRef: airplaneRef.current,
							camera,
							cameraType: currentCam,
							cannonRef: cannonRef.current,
							controls,
							movementState: movementStateRef.current,
							shipRef: shipRef.current,
							towerPosition: new THREE.Vector3(-1.5, 0, 0),
						});
					}
				}

				if (controls?.enabled) {
					controls.update();
				}

				if (airplaneController) {
					const dt = 1 / 60;
					airplaneController.update(dt);

					const enginePower = airplaneController.getEnginePower();
					if (propellerLeftRef?.current) {
						propellerLeftRef.current.rotation.x += enginePower * 0.5;
					}
					if (propellerRightRef?.current) {
						propellerRightRef.current.rotation.x += enginePower * 0.5;
					}
				}

				if (shipRef.current) {
					shipAngleRef.current += shipSpeedRef.current * 0.01;
					shipRef.current.position.x =
						Math.cos(shipAngleRef.current) * shipRadiusRef.current;
					shipRef.current.position.z =
						Math.sin(shipAngleRef.current) * shipRadiusRef.current;
					shipRef.current.rotation.y =
						-shipAngleRef.current + Math.PI / 2 + Math.PI;
				}

				if (projectilesRef.current && scene) {
					const projectilesToRemove: THREE.Mesh[] = [];
					const raycaster = new THREE.Raycaster();
					const dt = 1 / 60;
					const sceneForExplosion = scene;

					projectilesRef.current.children.forEach((projectile) => {
						if (projectile instanceof THREE.Mesh) {
							const velocity = projectile.userData.velocity as THREE.Vector3;

							velocity.y -= gravity * dt;

							const displacement = velocity.clone().multiplyScalar(dt);

							raycaster.set(
								projectile.position,
								displacement.clone().normalize(),
							);

							raycaster.far = displacement.length() * 1.5;

							const intersects = raycaster.intersectObjects(
								sceneForExplosion.children,
								true,
							);
							let hitSomething = intersects.some((hit) => {
								return (
									hit.object !== projectile &&
									hit.object.parent !== projectilesRef.current &&
									hit.distance <= displacement.length()
								);
							});

							if (!hitSomething && islandGroup) {
								const checkPos = projectile.position.clone().add(displacement);
								raycaster.set(
									new THREE.Vector3(checkPos.x, 50, checkPos.z),
									new THREE.Vector3(0, -1, 0),
								);
								raycaster.far = 100;

								const surfaceIntersects = raycaster.intersectObject(
									islandGroup,
									true,
								);

								if (surfaceIntersects.length > 0) {
									const surfaceY = surfaceIntersects[0].point.y;
									if (checkPos.y <= surfaceY) {
										hitSomething = true;
									}
								}
							}

							if (hitSomething) {
								const explosion = new THREE.Mesh(
									new THREE.SphereGeometry(0.1, 16, 16),
									new THREE.MeshBasicMaterial({ color: 0xffffff }),
								);
								explosion.position.copy(projectile.position);
								explosion.userData.scale = 0.1;
								explosion.userData.maxScale = 3;
								explosion.userData.isExplosion = true;
								sceneForExplosion.add(explosion);

								const animateExplosion = () => {
									if (explosion.userData.scale < explosion.userData.maxScale) {
										explosion.userData.scale += 0.3;
										explosion.scale.setScalar(explosion.userData.scale);
										requestAnimationFrame(animateExplosion);
									} else {
										sceneForExplosion.remove(explosion);
										explosion.geometry.dispose();
										(explosion.material as THREE.Material).dispose();
									}
								};
								animateExplosion();

								projectilesToRemove.push(projectile);
							} else {
								projectile.position.add(displacement);
								projectile.userData.lifetime += 1;

								if (
									projectile.position.y < 0 ||
									projectile.userData.lifetime > 600
								) {
									projectilesToRemove.push(projectile);
								}
							}
						}
					});

					projectilesToRemove.forEach((p) => {
						projectilesRef.current?.remove(p);
						p.geometry.dispose();
						(p.material as THREE.Material).dispose();
					});

					if (projectilesToRemove.length > 0) {
						updateProjectileCount();
					}
				}

				if (renderer && scene && camera) {
					renderer.render(scene, camera);

					if (DEBUG && axesScene && axesCamera) {
						axesCamera.position.copy(camera.position);
						axesCamera.position.setLength(200);
						axesCamera.lookAt(0, 0, 0);

						const size = 128;
						const x = window.innerWidth - size - 16;
						const y = window.innerHeight - size - 16;
						renderer.setViewport(x, y, size, size);
						renderer.setScissor(x, y, size, size);
						renderer.setScissorTest(true);
						renderer.render(axesScene, axesCamera);
						renderer.setScissorTest(false);
						renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
					}
				}
			};
			animate();

			const handleResize = () => {
				if (!camera || !renderer) return;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			};
			window.addEventListener("resize", handleResize);

			return () => {
				window.removeEventListener("resize", handleResize);
			};
		};

		let cleanup: (() => void) | undefined;
		init().then((cleanupFn) => {
			cleanup = cleanupFn;
		});

		return () => {
			cleanup?.();
			if (animationId !== null) cancelAnimationFrame(animationId);
			airplaneController?.dispose();
			renderer?.dispose();
			oceanMesh?.geometry.dispose();
			(oceanMesh?.material as THREE.Material)?.dispose();

			if (islandGroup) {
				islandGroup.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.geometry?.dispose();
						if (child.material) {
							if (Array.isArray(child.material)) {
								child.material.forEach((mat) => {
									mat.dispose();
								});
							} else {
								child.material.dispose();
							}
						}
					}
				});
			}

			controls?.dispose();
		};
	}, [
		turretRef,
		cannonRef,
		projectilesRef,
		gravity,
		updateProjectileCount,
		setController,
		propellerLeftRef,
		propellerRightRef,
	]);
	useEffect(() => {
		if (!lightsInitialized.current) return;

		const directionalLight = directionalLightRef.current;
		const hemisphereLight = hemisphereLightRef.current;
		const scene = sceneRef.current;

		if (!directionalLight || !hemisphereLight || !scene) return;

		const normalizedTime = currentTime / 24;
		const sunAngle = normalizedTime * Math.PI * 2 - Math.PI / 2;

		const sunHeight = Math.sin(sunAngle);
		const sunDistance = 300;

		const sunPosition = new THREE.Vector3(
			Math.cos(sunAngle) * sunDistance,
			sunHeight * sunDistance,
			50,
		);

		directionalLight.position.copy(sunPosition);

		if (sunRef.current) {
			sunRef.current.position.copy(sunPosition);

			const material = sunRef.current.material as THREE.MeshBasicMaterial;
			if (sunHeight > 0) {
				sunRef.current.visible = true;
				if (currentTime >= 6 && currentTime < 8) {
					const t = (currentTime - 6) / 2;
					material.color.lerpColors(
						new THREE.Color(0xff6b35),
						new THREE.Color(0xffff00),
						t,
					);
				} else if (currentTime >= 18 && currentTime < 20) {
					const t = (currentTime - 18) / 2;
					material.color.lerpColors(
						new THREE.Color(0xffff00),
						new THREE.Color(0xff6b35),
						t,
					);
				} else {
					material.color.set(0xffff00);
				}
			} else {
				sunRef.current.visible = false;
			}
		}

		let skyColor: THREE.Color;
		let dirIntensity: number;
		let hemiIntensity: number;
		let dirColor: THREE.Color;

		if (currentTime >= 6 && currentTime < 8) {
			const t = (currentTime - 6) / 2;
			skyColor = new THREE.Color().lerpColors(
				new THREE.Color(0x1a1a2e),
				new THREE.Color(0x87ceeb),
				t,
			);
			dirIntensity = 0.3 + t * 0.9;
			hemiIntensity = 0.2 + t * 0.3;
			dirColor = new THREE.Color().lerpColors(
				new THREE.Color(0xff6b35),
				new THREE.Color(0xfff4e6),
				t,
			);
		} else if (currentTime >= 8 && currentTime < 18) {
			skyColor = new THREE.Color(0x87ceeb);
			dirIntensity = 1.2;
			hemiIntensity = 0.5;
			dirColor = new THREE.Color(0xfff4e6);
		} else if (currentTime >= 18 && currentTime < 20) {
			const t = (currentTime - 18) / 2;
			skyColor = new THREE.Color().lerpColors(
				new THREE.Color(0x87ceeb),
				new THREE.Color(0xff6b35),
				t,
			);
			dirIntensity = 1.2 - t * 0.9;
			hemiIntensity = 0.5 - t * 0.3;
			dirColor = new THREE.Color().lerpColors(
				new THREE.Color(0xfff4e6),
				new THREE.Color(0xff6b35),
				t,
			);
		} else {
			skyColor = new THREE.Color(0x1a1a2e);
			dirIntensity = 0.3;
			hemiIntensity = 0.2;
			dirColor = new THREE.Color(0x4a5568);
		}

		scene.background = skyColor;
		directionalLight.intensity = dirIntensity;
		directionalLight.color = dirColor;
		hemisphereLight.intensity = hemiIntensity;
	}, [currentTime]);

	return (
		<>
			<canvas ref={canvasRef} />
			<SettingsPanel />
			<CannonControls />
			<AirplaneControls />
			<CameraControls />
		</>
	);
};

export const App = () => (
	<TimeProvider>
		<ShipProvider>
			<CannonProvider>
				<CollisionProvider>
					<AirplaneProvider>
						<CameraProvider>
							<Scene />
						</CameraProvider>
					</AirplaneProvider>
				</CollisionProvider>
			</CannonProvider>
		</ShipProvider>
	</TimeProvider>
);
