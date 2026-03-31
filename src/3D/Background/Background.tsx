import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls, folder } from 'leva';
import vertexShader from './meshGradient.vert.glsl?raw';
import fragmentShader from './meshGradient.frag.glsl?raw';
import { useAppStore } from '../../store';

/** Stable THREE.Color[] from the store — mutated in-place by the transition hook. */
export default function Background() {
	const matRef = useRef<THREE.ShaderMaterial>(null);
	const bgColorObjects = useAppStore((s) => s.bgColorObjects);

	const { colorsCount, distortion, swirl, grainMixer, grainOverlay } =
		useControls('Background', {
			Effects: folder({
				colorsCount: { value: 4, min: 1, max: 10, step: 1 },
				distortion: { value: 0.4, min: 0, max: 1, step: 0.01 },
				swirl: { value: 0.1, min: 0, max: 1, step: 0.01 },
				grainMixer: { value: 0, min: 0, max: 1, step: 0.01 },
				grainOverlay: { value: 0.0, min: 0, max: 1, step: 0.01 },
			}),
			Colors: folder({
				bgColor1: {
					value: '#4b38ab',
					onChange: (v) =>
						useAppStore.getState().bgColorObjects[0].set(v),
				},
				bgColor2: {
					value: '#5e77c1',
					onChange: (v) =>
						useAppStore.getState().bgColorObjects[1].set(v),
				},
				bgColor3: {
					value: '#8077e5',
					onChange: (v) =>
						useAppStore.getState().bgColorObjects[2].set(v),
				},
				bgColor4: {
					value: '#b9beff',
					onChange: (v) =>
						useAppStore.getState().bgColorObjects[3].set(v),
				},
			}),
		});

	const uniforms = useMemo(
		() => ({
			u_time: { value: 0 },
			u_colors: {
				value: Array.from(
					{ length: 10 },
					() => new THREE.Vector4(0, 0, 0, 0),
				),
			},
			u_colorsCount: { value: 4 },
			u_distortion: { value: 0.4 },
			u_swirl: { value: 0.1 },
			u_grainMixer: { value: 0.0 },
			u_grainOverlay: { value: 0.0 },
		}),
		[],
	);

	useFrame(({ clock }) => {
		if (!matRef.current) return;
		const u = matRef.current.uniforms;
		u.u_time.value = clock.getElapsedTime();

		for (let i = 0; i < 10; i++) {
			if (i < bgColorObjects.length) {
				const c = bgColorObjects[i];
				u.u_colors.value[i].set(c.r, c.g, c.b, 1.0);
			} else {
				u.u_colors.value[i].set(0, 0, 0, 0);
			}
		}
		u.u_colorsCount.value = colorsCount;
		u.u_distortion.value = distortion;
		u.u_swirl.value = swirl;
		u.u_grainMixer.value = grainMixer;
		u.u_grainOverlay.value = grainOverlay;
	});

	return (
		<mesh frustumCulled={false} renderOrder={-1}>
			<planeGeometry args={[2, 2]} />
			<shaderMaterial
				ref={matRef}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				depthTest={false}
				depthWrite={false}
			/>
		</mesh>
	);
}
