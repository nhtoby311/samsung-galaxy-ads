import * as THREE from 'three';
import { useCallback, useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { usePrivacyDisplay } from './usePrivacyDisplay';
import { useControls, folder } from 'leva';
import { useAppStore } from '../store';
import type { GLTF } from 'three-stdlib';
import TransitionMaterial from './TransitionMaterial/TransitionMaterial';
import { COLOR_SCHEMES } from './TransitionMaterial/useColorTransition';

type GLTFResult = GLTF & {
	nodes: {
		BackPanel: THREE.Mesh;
		DisplayScreen: THREE.Mesh;
		GlassBackPanel: THREE.Mesh;
		Mesh088: THREE.Mesh;
		Mesh088_1: THREE.Mesh;
		Mesh088_2: THREE.Mesh;
		Mesh088_3: THREE.Mesh;
		Mesh088_4: THREE.Mesh;
		Mesh088_5: THREE.Mesh;
		Mesh088_6: THREE.Mesh;
		Mesh088_7: THREE.Mesh;
		Mesh088_8: THREE.Mesh;
		Mesh088_9: THREE.Mesh;
		Mesh088_10: THREE.Mesh;
		Mesh088_11: THREE.Mesh;
		Mesh088_12: THREE.Mesh;
		Mesh088_13: THREE.Mesh;
		Mesh088_14: THREE.Mesh;
		Mesh088_15: THREE.Mesh;
		Mesh088_16: THREE.Mesh;
		Mesh088_17: THREE.Mesh;
		Mesh088_18: THREE.Mesh;
		Mesh088_19: THREE.Mesh;
		Mesh088_20: THREE.Mesh;
		Mesh088_21: THREE.Mesh;
		Mesh088_22: THREE.Mesh;
		MetalFrame: THREE.Mesh;
	};
	materials: {
		['Backcover_Glass_In.001']: THREE.MeshStandardMaterial;
		['Display_Activearea.001']: THREE.MeshStandardMaterial;
		['Backcover_Glass.001']: THREE.MeshStandardMaterial;
		['Flash.001']: THREE.MeshStandardMaterial;
		['BackCam_Case_3.001']: THREE.MeshStandardMaterial;
		['BackCam_Body.001']: THREE.MeshStandardMaterial;
		['BackCam_Glass.001']: THREE.MeshStandardMaterial;
		['BackCam_Glass_AO.001']: THREE.MeshStandardMaterial;
		['USB_1.001']: THREE.MeshStandardMaterial;
		['BackCam_Ring.001']: THREE.MeshStandardMaterial;
		['Samsung_Logo.001']: THREE.MeshStandardMaterial;
		['Front_Bezel.001']: THREE.MeshStandardMaterial;
		['Flash_Glass.001']: THREE.MeshStandardMaterial;
		['BackCam_Case.001']: THREE.MeshStandardMaterial;
		['USB_2.001']: THREE.MeshStandardMaterial;
		['BackCam_Frame_2.001']: THREE.MeshStandardMaterial;
		['BackCam_Frame_Edge.001']: THREE.MeshStandardMaterial;
		['FrontCam_Glass.001']: THREE.MeshStandardMaterial;
		['BackCam_Frame.001']: THREE.MeshStandardMaterial;
		['BackCam_Frame_Inside.001']: THREE.MeshStandardMaterial;
		['BackCam_Case_Side_2.001']: THREE.MeshStandardMaterial;
		['BackCam_Case_Side_3.001']: THREE.MeshStandardMaterial;
		['Blackhole.001']: THREE.MeshStandardMaterial;
		['Antenna_Plastic.001']: THREE.MeshStandardMaterial;
		['Antenna_Plastic_light.001']: THREE.MeshStandardMaterial;
		['Rearcase_hole.001']: THREE.MeshStandardMaterial;
		['Rearcase.001']: THREE.MeshStandardMaterial;
	};
};

export function Samsung({
	ref,
	...props
}: { ref?: React.Ref<THREE.Group> } & Record<string, any>) {
	const { nodes, materials, animations } = useGLTF(
		'/3d/samsung.glb',
	) as unknown as GLTFResult;

	// useAnimations MUST receive a ref to the rendered scene object so the
	// AnimationMixer can find target nodes by name inside the GLB hierarchy.
	const groupRef = useRef<THREE.Group>(null);
	const { actions } = useAnimations<any>(animations, groupRef);
	const sceneVisible = useAppStore((s) => s.sceneVisible);
	const currentPhoneColor = useAppStore((s) => s.currentPhoneColor);
	const setFrameColorObject = useAppStore((s) => s.setFrameColorObject);

	const screenMeshRef = usePrivacyDisplay(
		materials['Display_Activearea.001'],
	);

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

	//Trick: This would force Leva to get the latest material ref when onChange, while
	//useAppStore would cause stale ref, since Leva not re-render on change
	const mat = () => useAppStore.getState().materialTransitionRef;

	useControls('Transition', {
		transitionProgress: {
			value: 0,
			min: 0,
			max: 1,
			step: 0.001,
			onChange: (v) => {
				if (mat()?.uniforms) mat().uniforms.uProgress.value = v;
			},
		},
		DotEdges: folder({
			dotDensity: {
				value: 324,
				min: 1,
				max: 800,
				onChange: (v) => {
					if (mat()?.uniforms) mat().uniforms.uDotDensity.value = v;
				},
			},
			noiseScale: {
				value: 1.28,
				min: 0,
				max: 10,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms) mat().uniforms.uNoiseScale.value = v;
				},
			},
			noiseSpeed: {
				value: 0.2,
				min: 0,
				max: 5,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms) mat().uniforms.uNoiseSpeed.value = v;
				},
			},
			noisePositionX: {
				value: -0.4,
				min: -1,
				max: 1,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uNoisePosition.value.x = v;
				},
			},
			noisePositionY: {
				value: 0.08,
				min: -1,
				max: 1,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uNoisePosition.value.y = v;
				},
			},
			noisePositionZ: {
				value: -0.04,
				min: -1,
				max: 1,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uNoisePosition.value.z = v;
				},
			},
			edgeThickness: {
				value: 0.03,
				min: 0.001,
				max: 0.3,
				step: 0.001,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uEdgeThickness.value = v;
				},
			},
			maskMinY: {
				value: -1.0,
				min: -2,
				max: 2,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uMinMaxGradientMaskY.value.x = v;
				},
			},
			maskMaxY: {
				value: 1.0,
				min: -2,
				max: 2,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uMinMaxGradientMaskY.value.y = v;
				},
			},
		}),
		EdgeColor: folder({
			edgeColor1: {
				value: '#ffffff',
				onChange: (v) => mat()?.uniforms.uEdgeColor1.value.set(v),
			},
			edgeColor2: {
				value: '#0dfffa',
				onChange: (v) => mat()?.uniforms.uEdgeColor2.value.set(v),
			},
			edgeColor3: {
				value: '#2d90fa',
				onChange: (v) => mat()?.uniforms.uEdgeColor3.value.set(v),
			},
			edgeColor4: {
				value: '#193ef4',
				onChange: (v) => mat()?.uniforms.uEdgeColor4.value.set(v),
			},
			edgeColorStop1: {
				value: 0.16,
				min: 0,
				max: 1,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uEdgeColorStop1.value = v;
				},
			},
			edgeColorStop2: {
				value: 0.26,
				min: 0,
				max: 1,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uEdgeColorStop2.value = v;
				},
			},
			edgeColorStop3: {
				value: 0.39,
				min: 0,
				max: 1,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uEdgeColorStop3.value = v;
				},
			},
			edgeColorStop4: {
				value: 0.56,
				min: 0,
				max: 1,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uEdgeColorStop4.value = v;
				},
			},
			edgeColorWidth: {
				value: 0.07,
				min: 0,
				max: 1,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uEdgeColorWidth.value = v;
				},
			},
		}),
		OverlayDot: folder({
			overlayDotColor: {
				value: '#457de4',
				onChange: (v) => mat()?.uniforms.uOverlayDotColor.value.set(v),
			},
			overlayDotSize: {
				value: 0.15,
				min: 0,
				max: 1,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uOverlayDotSize.value = v;
				},
			},
			overlayDotDensity: {
				value: 385,
				min: 1,
				max: 800,
				step: 1,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uOverlayDotDensity.value = v;
				},
			},
			overlayMaskWidth: {
				value: 1.13,
				min: 0,
				max: 2,
				step: 0.01,
				onChange: (v) => {
					if (mat()?.uniforms)
						mat().uniforms.uOverlayMaskWidth.value = v;
				},
			},
		}),
	});

	// Register the MetalFrame material's live color object in the store so the
	// transition hook can animate it directly — no hex-string round-trips.
	useEffect(() => {
		const scheme =
			COLOR_SCHEMES[currentPhoneColor] ?? COLOR_SCHEMES['#8977c1'];
		materials['Rearcase.001'].color.set(scheme.frameColor);
		setFrameColorObject(materials['Rearcase.001'].color);

		// Adjust emissive intensity of the screen
		const screenMat = materials['Display_Activearea.001'];
		if (screenMat) {
			screenMat.emissive = new THREE.Color(1, 1, 1);
		}
	}, [materials, setFrameColorObject]); // eslint-disable-line react-hooks/exhaustive-deps

	// Unpause when the loading screen has fully exited.
	useEffect(() => {
		if (!sceneVisible) return;
		if (actions['EmptyAction']) {
			actions['EmptyAction'].paused = false;
		}
	}, [sceneVisible, actions]);

	return (
		<group ref={mergedRef} {...props} dispose={null}>
			<group name='Scene'>
				<group name='Empty'>
					<mesh
						name='BackPanel'
						castShadow
						receiveShadow
						geometry={nodes.BackPanel.geometry}>
						{/* <meshStandardMaterial
							color={backcoverColor}
							roughness={0.25}
							metalness={0.9}
						/> */}
						<TransitionMaterial />
					</mesh>
					<mesh
						name='MetalFrame'
						castShadow
						receiveShadow
						geometry={nodes.MetalFrame.geometry}
						material={materials['Rearcase.001']}
					/>
					<group name='M1_BackCam_Glass_AO001'>
						<mesh
							name='Mesh088'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088.geometry}
							material={materials['Flash.001']}
						/>
						<mesh
							name='Mesh088_1'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_1.geometry}
							material={materials['BackCam_Case_3.001']}
						/>
						<mesh
							name='Mesh088_2'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_2.geometry}
							material={materials['BackCam_Body.001']}
						/>
						<mesh
							name='Mesh088_3'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_3.geometry}
							material={materials['BackCam_Glass.001']}
						/>
						<mesh
							name='Mesh088_4'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_4.geometry}
							material={materials['BackCam_Glass_AO.001']}
						/>
						<mesh
							name='Mesh088_5'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_5.geometry}
							material={materials['USB_1.001']}
						/>
						<mesh
							name='Mesh088_6'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_6.geometry}
							material={materials['BackCam_Ring.001']}
						/>
						<mesh
							name='Mesh088_7'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_7.geometry}
							material={materials['Samsung_Logo.001']}
						/>
						<mesh
							name='Mesh088_8'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_8.geometry}
							material={materials['Front_Bezel.001']}
						/>
						<mesh
							name='Mesh088_9'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_9.geometry}
							material={materials['Flash_Glass.001']}
						/>
						<mesh
							name='Mesh088_10'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_10.geometry}
							material={materials['BackCam_Case.001']}
						/>
						<mesh
							name='Mesh088_11'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_11.geometry}
							material={materials['USB_2.001']}
						/>
						<mesh
							name='Mesh088_12'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_12.geometry}
							material={materials['BackCam_Frame_2.001']}
						/>
						<mesh
							name='Mesh088_13'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_13.geometry}
							material={materials['BackCam_Frame_Edge.001']}
						/>
						<mesh
							name='Mesh088_14'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_14.geometry}
							material={materials['FrontCam_Glass.001']}
						/>
						<mesh
							name='Mesh088_15'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_15.geometry}
							material={materials['BackCam_Frame.001']}
						/>
						<mesh
							name='Mesh088_16'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_16.geometry}
							material={materials['BackCam_Frame_Inside.001']}
						/>
						<mesh
							name='Mesh088_17'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_17.geometry}
							material={materials['BackCam_Case_Side_2.001']}
						/>
						<mesh
							name='Mesh088_18'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_18.geometry}
							material={materials['BackCam_Case_Side_3.001']}
						/>
						<mesh
							name='Mesh088_19'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_19.geometry}
							material={materials['Blackhole.001']}
						/>
						<mesh
							name='Mesh088_20'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_20.geometry}
							material={materials['Antenna_Plastic.001']}
						/>
						<mesh
							name='Mesh088_21'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_21.geometry}
							material={materials['Antenna_Plastic_light.001']}
						/>
						<mesh
							name='Mesh088_22'
							castShadow
							receiveShadow
							geometry={nodes.Mesh088_22.geometry}
							material={materials['Rearcase_hole.001']}
						/>
					</group>

					<mesh
						name='GlassBackPanel'
						castShadow
						receiveShadow
						geometry={nodes.GlassBackPanel.geometry}
						material={materials['Backcover_Glass.001']}
					/>

					<mesh
						ref={screenMeshRef}
						name='DisplayScreen'
						castShadow
						receiveShadow
						geometry={nodes.DisplayScreen.geometry}
						material={materials['Display_Activearea.001']}
					/>
				</group>
			</group>
		</group>
	);
}

useGLTF.preload('/3d/samsung.glb');
