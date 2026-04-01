import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hemisphere labels for each axis.
 *
 * Azimuth (horizontal orbit around Y-axis):
 *   - "front"  → camera faces the front  (azimuth ≈ 0)
 *   - "back"   → camera faces the back   (azimuth ≈ ±π)
 *   - "left"   → camera is on the left   (azimuth < 0, i.e. −π…0)
 *   - "right"  → camera is on the right  (azimuth > 0, i.e. 0…π)
 *
 * Polar (vertical orbit):
 *   - "top"    → camera is above the equator (polar < π/2)
 *   - "bottom" → camera is below the equator (polar > π/2)
 */
export interface CameraSide {
  /** "front" | "back" */
  frontBack: "front" | "back";
  /** "left" | "right" */
  leftRight: "left" | "right";
  /** "top" | "bottom" */
  topBottom: "top" | "bottom";
  /** Azimuthal angle in radians (−π … π). 0 = front, ±π = back */
  azimuth: number;
  /** Polar angle in radians (0 … π). 0 = top pole, π/2 = equator, π = bottom pole */
  polar: number;
}

const _v = new THREE.Vector3();
const _spherical = new THREE.Spherical();

/**
 * Runs every frame and returns a stable ref whose `.current` contains the
 * up-to-date `CameraSide` for the active camera relative to `target`.
 *
 * @param target – The orbit target (world-space). Defaults to (0, 0, 1.17)
 *                 to match the CameraControls target in App.tsx.
 */
export function useCameraSide(
  target: THREE.Vector3Like = { x: 0, y: 0, z: 1.17 },
) {
  const sideRef = useRef<CameraSide>({
    frontBack: "front",
    leftRight: "right",
    topBottom: "top",
    azimuth: 0,
    polar: 0,
  });

  useFrame(({ camera }) => {
    // Vector from target → camera
    _v.set(
      camera.position.x - target.x,
      camera.position.y - target.y,
      camera.position.z - target.z,
    );

    // Convert to spherical (Three.js convention: Y-up)
    _spherical.setFromVector3(_v);

    const azimuth = _spherical.theta; // −π … π
    const polar = _spherical.phi; // 0 … π

    const side = sideRef.current;
    side.azimuth = azimuth;
    side.polar = polar;

    // Front/Back – front when |azimuth| < π/2
    side.frontBack = Math.abs(azimuth) < Math.PI / 2 ? "front" : "back";

    // Left/Right – negative theta = camera moved to the left
    side.leftRight = azimuth < 0 ? "left" : "right";

    // Top/Bottom – polar < π/2 means above equator
    side.topBottom = polar < Math.PI / 2 ? "top" : "bottom";
  });

  return sideRef;
}
