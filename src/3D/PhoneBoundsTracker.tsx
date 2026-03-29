import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store';

/**
 * Measures the phone's bounding box once loaded, then:
 * 1. Auto-centers the phone at the world origin (so camera looks straight at it)
 * 2. Computes the projected screen-space width/height and stores it
 *
 * Both the SVG (flex-centered in DOM) and the phone (centered at origin)
 * will naturally overlap at the center of the viewport.
 */
export function PhoneBoundsTracker({
	groupRef,
}: {
	groupRef: React.RefObject<THREE.Group | null>;
}) {
	const { camera, size } = useThree();
	const setPhoneSize = useAppStore((s) => s.setPhoneSize);
	const measured = useRef(false);
	const loaded = useAppStore((s) => s.loaded);

	useFrame(() => {
		if (!loaded || measured.current || !groupRef.current) return;

		const box = new THREE.Box3().setFromObject(groupRef.current);
		const center = box.getCenter(new THREE.Vector3());
		const boxSize = box.getSize(new THREE.Vector3());

		// Shift the phone so its visual center sits at the world origin
		groupRef.current.position.x -= center.x;
		groupRef.current.position.y -= center.y;

		// Compute projected screen size from camera FOV + distance
		const cam = camera as THREE.PerspectiveCamera;
		const vFov = cam.fov * (Math.PI / 180);
		const dist = cam.position.z;
		const worldHeight = 2 * Math.tan(vFov / 2) * dist;
		const worldWidth = worldHeight * (size.width / size.height);

		const projWidth = (boxSize.x / worldWidth) * size.width;
		const projHeight = (boxSize.y / worldHeight) * size.height;

		setPhoneSize({ width: projWidth, height: projHeight });
		measured.current = true;
	});

	return null;
}
