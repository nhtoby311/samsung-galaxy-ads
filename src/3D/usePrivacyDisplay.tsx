import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls, folder } from 'leva';
import { animate } from 'motion';
import { useAppStore } from '../store';

// Pre-allocated vectors — reused every frame to avoid GC pressure
const _normal = new THREE.Vector3();
const _meshPos = new THREE.Vector3();
const _toCamera = new THREE.Vector3();

/**
 * Implements the Samsung S26 Privacy Display effect:
 * emissiveIntensity is driven by the angle between the camera and the screen
 * normal — full brightness head-on, dimming toward the sides.
 *
 * @returns a ref to attach to the display mesh
 */
export function usePrivacyDisplay(
	material: THREE.MeshStandardMaterial | undefined,
) {
	const meshRef = useRef<THREE.Mesh>(null);
	const baseIntensity = useRef(0);
	const sharpness = useRef(6);
	const sceneVisible = useAppStore((s) => s.sceneVisible);

	//For the initial animation spin, then the screen can turn on after.
	useEffect(() => {
		if (!sceneVisible) return;
		animate(baseIntensity, { current: 0.6 }, { delay: 1, duration: 1 });
	}, [sceneVisible]);

	useControls('Transition', {
		Phone: folder({
			screenEmissiveIntensity: {
				value: 0,
				min: 0,
				max: 1,
				step: 0.01,
				onChange: (v) => {
					baseIntensity.current = v;
				},
			},
			privacySharpness: {
				value: 6,
				min: 0.5,
				max: 20,
				step: 0.1,
				onChange: (v) => {
					sharpness.current = v;
				},
			},
		}),
	});

	useFrame(({ camera }) => {
		const mesh = meshRef.current;
		if (!material || !mesh) return;

		// Screen world-space normal (local +Z → world)
		_normal.set(0, 0, 1).transformDirection(mesh.matrixWorld);

		// Unit vector from screen centre to camera
		mesh.getWorldPosition(_meshPos);
		_toCamera.copy(camera.position).sub(_meshPos).normalize();

		// dot = 1 → head-on, dot = 0 → 90° side view
		const dot = Math.abs(_normal.dot(_toCamera));
		material.emissiveIntensity =
			baseIntensity.current * Math.pow(dot, sharpness.current);
	});

	return meshRef;
}
