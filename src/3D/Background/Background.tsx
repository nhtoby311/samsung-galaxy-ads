import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls, folder } from 'leva';
import vertexShader from './meshGradient.vert.glsl?raw';
import fragmentShader from './meshGradient.frag.glsl?raw';

/** Hex color string → THREE.Vector4 with alpha = 1 */
function hexToVec4(hex: string): THREE.Vector4 {
	const c = new THREE.Color(hex);
	return new THREE.Vector4(c.r, c.g, c.b, 1.0);
}

const defaultColors = [
	'#4b38ab',
	'#5e77c1',
	'#8077e5',
	'#b9beff',
	'#dc93ff',
	'#e1beff',
];

export default function Background() {
	const matRef = useRef<THREE.ShaderMaterial>(null);

	const {
		color1,
		color2,
		color3,
		color4,
		color5,
		color6,
		colorsCount,
		distortion,
		swirl,
		grainMixer,
		grainOverlay,
	} = useControls('Background', {
		Colors: folder({
			color1: defaultColors[0],
			color2: defaultColors[1],
			color3: defaultColors[2],
			color4: defaultColors[3],
			color5: defaultColors[4],
			color6: defaultColors[5],
			colorsCount: { value: 4, min: 1, max: 10, step: 1 },
		}),
		Effects: folder({
			distortion: { value: 0.4, min: 0, max: 1, step: 0.01 },
			swirl: { value: 0.1, min: 0, max: 1, step: 0.01 },
			grainMixer: { value: 0, min: 0, max: 1, step: 0.01 },
			grainOverlay: { value: 0.0, min: 0, max: 1, step: 0.01 },
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

		const hexColors = [color1, color2, color3, color4, color5, color6];
		for (let i = 0; i < 10; i++) {
			if (i < hexColors.length) {
				const v = hexToVec4(hexColors[i]);
				u.u_colors.value[i].copy(v);
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
		<mesh frustumCulled={false} renderOrder={0}>
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
