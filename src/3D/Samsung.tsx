import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

type GLTFResult = any & {
	nodes: {
		Mesh057: THREE.Mesh;
		Mesh057_1: THREE.Mesh;
		Mesh057_2: THREE.Mesh;
		Mesh057_3: THREE.Mesh;
		Mesh057_4: THREE.Mesh;
		Mesh057_5: THREE.Mesh;
		Mesh057_6: THREE.Mesh;
		Mesh057_7: THREE.Mesh;
		Mesh057_8: THREE.Mesh;
		Mesh057_9: THREE.Mesh;
		Mesh057_10: THREE.Mesh;
		Mesh057_11: THREE.Mesh;
		Mesh057_12: THREE.Mesh;
		Mesh057_13: THREE.Mesh;
		Mesh057_14: THREE.Mesh;
		Mesh057_15: THREE.Mesh;
		Mesh057_16: THREE.Mesh;
		Mesh057_17: THREE.Mesh;
		Mesh057_18: THREE.Mesh;
		Mesh057_19: THREE.Mesh;
		Mesh057_20: THREE.Mesh;
		Mesh057_21: THREE.Mesh;
		Mesh057_22: THREE.Mesh;
		Mesh057_23: THREE.Mesh;
		Mesh057_24: THREE.Mesh;
		Mesh057_25: THREE.Mesh;
		Mesh057_26: THREE.Mesh;
		Mesh057_27: THREE.Mesh;
		Mesh057_28: THREE.Mesh;
		M2_Backcover_Glass_In: THREE.Mesh;
		M2_Display_Activearea: THREE.Mesh;
	};
	materials: {
		['BackCam_Glass_AO.001']: THREE.MeshPhysicalMaterial;
		['USB_1.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Ring.001']: THREE.MeshPhysicalMaterial;
		['Samsung_Logo.001']: THREE.MeshPhysicalMaterial;
		['Front_Bezel.001']: THREE.MeshPhysicalMaterial;
		['Backcover_Glass.001']: THREE.MeshPhysicalMaterial;
		['Flash_Glass.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Case.001']: THREE.MeshPhysicalMaterial;
		['USB_2.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Frame_2.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Frame_Edge.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Case_Side.001']: THREE.MeshPhysicalMaterial;
		['FrontCam_Glass.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Frame.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Frame_Inside.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Case_Side_2.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Case_2.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Case_Side_3.001']: THREE.MeshPhysicalMaterial;
		['Blackhole.001']: THREE.MeshPhysicalMaterial;
		['Antenna_Plastic.001']: THREE.MeshPhysicalMaterial;
		['Antenna_Plastic_light.001']: THREE.MeshPhysicalMaterial;
		['Rearcase.001']: THREE.MeshPhysicalMaterial;
		['Rearcase_hole.001']: THREE.MeshPhysicalMaterial;
		['Rearcase_light.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Case_3.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Lense.001']: THREE.MeshStandardMaterial;
		['Flash.001']: THREE.MeshStandardMaterial;
		['BackCam_Body.001']: THREE.MeshPhysicalMaterial;
		['BackCam_Glass.001']: THREE.MeshPhysicalMaterial;
		['Backcover_Glass_In.001']: THREE.MeshPhysicalMaterial;
		['Display_Activearea.001']: THREE.MeshPhysicalMaterial;
	};
};

export function Samsung(props: any) {
	const { nodes, materials } = useGLTF('/3d/samsung.glb') as GLTFResult;
	return (
		<group {...props} dispose={null}>
			<group position={[0, 0.161, 0.048]}>
				<group position={[-0.014, 0.052, 0.025]}>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057.geometry}
						material={materials['BackCam_Glass_AO.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_1.geometry}
						material={materials['USB_1.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_2.geometry}
						material={materials['BackCam_Ring.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_3.geometry}
						material={materials['Samsung_Logo.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_4.geometry}
						material={materials['Front_Bezel.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_5.geometry}
						material={materials['Backcover_Glass.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_6.geometry}
						material={materials['Flash_Glass.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_7.geometry}
						material={materials['BackCam_Case.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_8.geometry}
						material={materials['USB_2.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_9.geometry}
						material={materials['BackCam_Frame_2.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_10.geometry}
						material={materials['BackCam_Frame_Edge.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_11.geometry}
						material={materials['BackCam_Case_Side.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_12.geometry}
						material={materials['FrontCam_Glass.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_13.geometry}
						material={materials['BackCam_Frame.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_14.geometry}
						material={materials['BackCam_Frame_Inside.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_15.geometry}
						material={materials['BackCam_Case_Side_2.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_16.geometry}
						material={materials['BackCam_Case_2.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_17.geometry}
						material={materials['BackCam_Case_Side_3.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_18.geometry}
						material={materials['Blackhole.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_19.geometry}
						material={materials['Antenna_Plastic.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_20.geometry}
						material={materials['Antenna_Plastic_light.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_21.geometry}
						material={materials['Rearcase.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_22.geometry}
						material={materials['Rearcase_hole.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_23.geometry}
						material={materials['Rearcase_light.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_24.geometry}
						material={materials['BackCam_Case_3.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_25.geometry}
						material={materials['BackCam_Lense.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_26.geometry}
						material={materials['Flash.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_27.geometry}
						material={materials['BackCam_Body.001']}
					/>
					<mesh
						castShadow
						receiveShadow
						geometry={nodes.Mesh057_28.geometry}
						material={materials['BackCam_Glass.001']}
					/>
				</group>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.M2_Backcover_Glass_In.geometry}
					material={materials['Backcover_Glass_In.001']}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.M2_Display_Activearea.geometry}
					material={materials['Display_Activearea.001']}
					position={[-0.003, 0.001, -0.005]}
				/>
			</group>
		</group>
	);
}

useGLTF.preload('/samsung.glb');
