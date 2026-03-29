import * as THREE from 'three';
import { useCallback, useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useAppStore } from '../store';

export function Samsung({
	ref,
	...props
}: { ref?: React.Ref<THREE.Group> } & Record<string, any>) {
	const { scene, animations } = useGLTF('/3d/samsung.glb');

	// useAnimations MUST receive a ref to the rendered scene object so the
	// AnimationMixer can find target nodes by name inside the GLB hierarchy.
	const groupRef = useRef<THREE.Group>(null);
	const { actions } = useAnimations<any>(animations, groupRef);
	const sceneVisible = useAppStore((s) => s.sceneVisible);

	// Merge the internal ref (needed by useAnimations) with the external ref
	// (needed by PhoneBoundsTracker in Scene.tsx).
	const mergedRef = useCallback(
		(node: THREE.Group | null) => {
			(groupRef as any).current = node;
			if (typeof ref === 'function') ref(node);
			else if (ref) (ref as any).current = node;
		},
		[ref],
	);

	// Pre-warm: advance to frame 0 and pause so the phone holds its initial pose.
	useEffect(() => {
		if (actions['EmptyAction']) {
			actions['EmptyAction'].setLoop(THREE.LoopOnce, 1);
			actions['EmptyAction'].clampWhenFinished = true;
			actions['EmptyAction'].reset().play().paused = true;
		}
	}, [actions]);

	// Unpause when the loading screen has fully exited.
	useEffect(() => {
		if (!sceneVisible) return;
		if (actions['EmptyAction']) {
			actions['EmptyAction'].paused = false;
		}
	}, [sceneVisible, actions]);

	// Swap all MeshPhysicalMaterial instances to MeshStandardMaterial
	useEffect(() => {
		scene.traverse((obj) => {
			const mesh = obj as THREE.Mesh;
			if (mesh.isMesh && (mesh.material as any).isMeshPhysicalMaterial) {
				const oldMat = mesh.material as THREE.MeshPhysicalMaterial;
				const newMat = new THREE.MeshStandardMaterial();
				THREE.MeshStandardMaterial.prototype.copy.call(newMat, oldMat);
				oldMat.dispose();
				mesh.material = newMat;
			}
		});

		// Audit: log every mesh material type after the swap
		scene.traverse((obj) => {
			const mesh = obj as THREE.Mesh;
			if (mesh.isMesh) {
				const mat = mesh.material as any;
				console.log(
					`[material audit] ${mesh.name}: ${mat.type} | isPhysical=${mat.isMeshPhysicalMaterial} | isStandard=${mat.isMeshStandardMaterial}`,
				);
			}
		});
	}, [scene]);

	return (
		<group ref={mergedRef} {...props} dispose={null}>
			{/* primitive preserves the full named GLB hierarchy so the
			    AnimationMixer can resolve every clip target by name. */}
			<primitive object={scene} />
		</group>
	);
}

useGLTF.preload('/3d/samsung.glb');
