import * as THREE from 'three';
import { useCallback, useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import { useAppStore } from '../store';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
	nodes: {
		BackPanel: THREE.Mesh;
		DisplayScreen: THREE.Mesh;
		GlassBackPanel: THREE.Mesh;
		Mesh061: THREE.Mesh;
		Mesh061_1: THREE.Mesh;
		Mesh061_2: THREE.Mesh;
		Mesh061_3: THREE.Mesh;
		Mesh061_4: THREE.Mesh;
		Mesh061_5: THREE.Mesh;
		Mesh061_6: THREE.Mesh;
		Mesh061_7: THREE.Mesh;
		Mesh061_8: THREE.Mesh;
		Mesh061_9: THREE.Mesh;
		Mesh061_10: THREE.Mesh;
		Mesh061_11: THREE.Mesh;
		Mesh061_12: THREE.Mesh;
		Mesh061_13: THREE.Mesh;
		Mesh061_14: THREE.Mesh;
		Mesh061_15: THREE.Mesh;
		Mesh061_16: THREE.Mesh;
		Mesh061_17: THREE.Mesh;
		Mesh061_18: THREE.Mesh;
		Mesh061_19: THREE.Mesh;
		Mesh061_20: THREE.Mesh;
		Mesh061_21: THREE.Mesh;
		Mesh061_22: THREE.Mesh;
		Mesh061_23: THREE.Mesh;
		MetalFrame: THREE.Mesh;
	};
	materials: {
		['Backcover_Glass_In.001']: THREE.MeshStandardMaterial;
		['Display_Activearea.001']: THREE.MeshStandardMaterial;
		['Backcover_Glass.001']: THREE.MeshStandardMaterial;
		['Flash.001']: THREE.MeshStandardMaterial;
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
		['Rearcase_light.001']: THREE.MeshStandardMaterial;
		['BackCam_Case_3.001']: THREE.MeshStandardMaterial;
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

	const { backcoverColor } = useControls('Phone', {
		backcoverColor: '#8977c1',
		metalFrameColor: {
			value: '#' + materials['Rearcase.001'].color.getHexString(),
			onChange: (v: string) => materials['Rearcase.001'].color.set(v),
		},
	});

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
						<meshStandardMaterial
							color={backcoverColor}
							roughness={0.25}
							metalness={0.9}
						/>
					</mesh>
					<mesh
						name='MetalFrame'
						castShadow
						receiveShadow
						geometry={nodes.MetalFrame.geometry}
						material={materials['Rearcase.001']}
					/>
					<group name='M1_BackCam_Glass_AO028'>
						<mesh
							name='Mesh061'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061.geometry}
							material={materials['Flash.001']}
						/>
						<mesh
							name='Mesh061_1'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_1.geometry}
							material={materials['BackCam_Body.001']}
						/>
						<mesh
							name='Mesh061_2'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_2.geometry}
							material={materials['BackCam_Glass.001']}
						/>
						<mesh
							name='Mesh061_3'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_3.geometry}
							material={materials['BackCam_Glass_AO.001']}
						/>
						<mesh
							name='Mesh061_4'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_4.geometry}
							material={materials['USB_1.001']}
						/>
						<mesh
							name='Mesh061_5'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_5.geometry}
							material={materials['BackCam_Ring.001']}
						/>
						<mesh
							name='Mesh061_6'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_6.geometry}
							material={materials['Samsung_Logo.001']}
						/>
						<mesh
							name='Mesh061_7'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_7.geometry}
							material={materials['Front_Bezel.001']}
						/>
						<mesh
							name='Mesh061_8'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_8.geometry}
							material={materials['Flash_Glass.001']}
						/>
						<mesh
							name='Mesh061_9'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_9.geometry}
							material={materials['BackCam_Case.001']}
						/>
						<mesh
							name='Mesh061_10'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_10.geometry}
							material={materials['USB_2.001']}
						/>
						<mesh
							name='Mesh061_11'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_11.geometry}
							material={materials['BackCam_Frame_2.001']}
						/>
						<mesh
							name='Mesh061_12'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_12.geometry}
							material={materials['BackCam_Frame_Edge.001']}
						/>
						<mesh
							name='Mesh061_13'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_13.geometry}
							material={materials['FrontCam_Glass.001']}
						/>
						<mesh
							name='Mesh061_14'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_14.geometry}
							material={materials['BackCam_Frame.001']}
						/>
						<mesh
							name='Mesh061_15'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_15.geometry}
							material={materials['BackCam_Frame_Inside.001']}
						/>
						<mesh
							name='Mesh061_16'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_16.geometry}
							material={materials['BackCam_Case_Side_2.001']}
						/>
						<mesh
							name='Mesh061_17'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_17.geometry}
							material={materials['BackCam_Case_Side_3.001']}
						/>
						<mesh
							name='Mesh061_18'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_18.geometry}
							material={materials['Blackhole.001']}
						/>
						<mesh
							name='Mesh061_19'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_19.geometry}
							material={materials['Antenna_Plastic.001']}
						/>
						<mesh
							name='Mesh061_20'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_20.geometry}
							material={materials['Antenna_Plastic_light.001']}
						/>
						<mesh
							name='Mesh061_21'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_21.geometry}
							material={materials['Rearcase_hole.001']}
						/>
						<mesh
							name='Mesh061_22'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_22.geometry}
							material={materials['Rearcase_light.001']}
						/>
						<mesh
							name='Mesh061_23'
							castShadow
							receiveShadow
							geometry={nodes.Mesh061_23.geometry}
							material={materials['BackCam_Case_3.001']}
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
