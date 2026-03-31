import * as THREE from 'three';
import transitionFrag from './shaders/transitionMaterial.frag.glsl?raw';
import vertexShader from './shaders/vertex.glsl?raw';
import CSM from 'three-custom-shader-material';
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { useControls } from 'leva';
import { useAppStore } from '../../store';

const TransitionMaterial = forwardRef((props: any) => {
	const setMaterialRef = useAppStore((store) => store.setMaterialRef);
	const localRef = useRef<any>(null);

	const materialControls = useControls('Transition FX', {
		uProgress: {
			value: 0.4,
			min: -2.3,
			max: 0.8,
			step: 0.001,
			label: 'Progress (Top to Bottom)',
		},
		gradientMinY: {
			value: -1.0, // Set this to the bottom edge of your 3D model
			min: -10,
			max: 10,
			step: 0.1,
		},
		gradientMaxY: {
			value: 1.0, // Set this to the top edge of your 3D model
			min: -10,
			max: 10,
			step: 0.1,
		},
		uTransitionColor: { value: '#000000', label: 'Transition Color' },
		uDotColor: { value: '#ffffff', label: 'Dot Color' },
		uNoiseStrength: { value: 0.05, min: 0, max: 1, step: 0.01 },
		uDotMapping: {
			value: 1,
			min: 0,
			max: 1,
			step: 1,
			label: 'Dot Mapping (0=UV 1=Obj)',
		},
		uBigDotScale: { value: 300.0, min: 10, max: 1000, step: 1 },
		uSmallDotScale: { value: 800.0, min: 10, max: 1500, step: 1 },
		uEmissionStrength: { value: 12.0, min: 0, max: 50, step: 0.1 },
	});

	useEffect(() => {
		const mat = localRef.current;
		if (!mat?.uniforms) return;
		mat.uniforms.uProgress.value = materialControls.uProgress;
		mat.uniforms.uNoiseStrength.value = materialControls.uNoiseStrength;
		mat.uniforms.uMinMaxGradientMaskY.value.set(
			materialControls.gradientMinY,
			materialControls.gradientMaxY,
		);

		mat.uniforms.uDotMapping.value = materialControls.uDotMapping;
		mat.uniforms.uBigDotScale.value = materialControls.uBigDotScale;
		mat.uniforms.uSmallDotScale.value = materialControls.uSmallDotScale;
		mat.uniforms.uEmissionStrength.value =
			materialControls.uEmissionStrength;
		mat.uniforms.uTransitionColor.value.set(
			materialControls.uTransitionColor,
		);
		mat.uniforms.uDotColor.value.set(materialControls.uDotColor);
	}, [
		materialControls.uProgress,
		materialControls.uNoiseStrength,

		materialControls.uDotMapping,
		materialControls.uBigDotScale,
		materialControls.uSmallDotScale,
		materialControls.uEmissionStrength,
		materialControls.uTransitionColor,
		materialControls.uDotColor,
		materialControls.gradientMinY,
		materialControls.gradientMaxY,
	]);

	const handleRef = useCallback(
		(ref: any) => {
			localRef.current = ref;
			setMaterialRef(ref);
		},
		[setMaterialRef],
	);

	const uniforms = useMemo(
		() => ({
			uProgress: { value: 0.42 },
			uMinMaxGradientMaskY: { value: new THREE.Vector2(-1.0, 1.0) },
			uTransitionColor: { value: new THREE.Color('#ffffff') },
			uNoiseStrength: { value: 0.5 },
			uNoiseScale: { value: 3.0 },
			uNoiseScaleDetail: { value: 5.0 },
			uDotColor: { value: new THREE.Color('#ffffff') },
			uDotMapping: { value: 0.0 },
			uBigDotScale: { value: 5.0 },
			uSmallDotScale: { value: 15.0 },
			uEmissionStrength: { value: 1.0 },
			// kept for useColorTransition compatibility (not used by current shader)
			uColor1: { value: new THREE.Color('#8977c1') },
			uColor2: { value: new THREE.Color('#8977c1') },
		}),
		[],
	);

	return (
		<CSM
			baseMaterial={THREE.MeshStandardMaterial}
			key={1}
			transparent={true}
			vertexShader={vertexShader}
			fragmentShader={transitionFrag}
			uniforms={uniforms}
			ref={handleRef}
			{...props}
		/>
	);
});

export default TransitionMaterial;
