import * as THREE from 'three';
// import fragmentShader from './shaders/fragment.glsl';

import fragmentShader from './shaders/fragmentEdgeGlow.glsl?raw';
import vertexShader from './shaders/vertex.glsl?raw';
import CSM from 'three-custom-shader-material';
import { useAppStore } from '../../store';

const TransitionMaterial = (props: any) => {
	const setMaterialTransitionRef = useAppStore(
		(store) => store.setMaterialTransitionRef,
	);

	const uniforms = {
		uProgress: { value: 0 },
		uColor1: { value: new THREE.Color('#6e5da4') },
		uColor2: { value: new THREE.Color('#000000') },
		uTime: { value: 0 },
		uNoiseScale: { value: 3.0 },
		uNoiseSpeed: { value: 0.2 },
		uNoisePosition: { value: new THREE.Vector3(0, 0, 0) },
		uMinMaxGradientMaskY: { value: new THREE.Vector2(-1.0, 1.0) },
		uEdgeThickness: { value: 0.03 },
		uDotDensity: { value: 12.0 },
		uEdgeColor1: { value: new THREE.Color('#ffffff') },
		uEdgeColor2: { value: new THREE.Color('#4a90d9') },
		uEdgeColor3: { value: new THREE.Color('#00c8ff') },
		uEdgeColor4: { value: new THREE.Color('#000000') },
		uEdgeColorStop1: { value: 0.0 },
		uEdgeColorStop2: { value: 0.33 },
		uEdgeColorStop3: { value: 0.66 },
		uEdgeColorStop4: { value: 1.0 },
		uEdgeColorWidth: { value: 0.1 },
		uOverlayDotColor: { value: new THREE.Color('#ffffff') },
		uOverlayDotSize: { value: 0.3 },
		uOverlayDotDensity: { value: 80.0 },
		uOverlayMaskWidth: { value: 0.5 },
	};

	return (
		<CSM
			baseMaterial={THREE.MeshStandardMaterial}
			key={1}
			transparent={true}
			vertexShader={vertexShader}
			fragmentShader={fragmentShader}
			uniforms={uniforms}
			ref={setMaterialTransitionRef}
			{...props}
		/>
	);
};

export default TransitionMaterial;
