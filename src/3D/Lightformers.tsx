import { Float, Lightformer } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { animate } from 'motion';

export default function Lightformers() {
	const group = useRef<any>(null);
	useFrame((state) => {
		group.current.position.x = Math.sin(state.clock.elapsedTime / 2) * 8;
		group.current.position.z = Math.cos(state.clock.elapsedTime / 2) * 8;
	});

	const ringLightRef = useRef<any>(null);

	useEffect(() => {
		console.log('ringLightRef', ringLightRef.current);
		animate(
			ringLightRef.current.material.color,
			//#72c1fe
			{ r: 0.447 * 3, g: 0.757 * 3, b: 0.996 * 3 },
			{ duration: 1 },
		);
	}, []);

	return (
		<>
			<Float speed={5} floatIntensity={10} rotationIntensity={1}>
				<Lightformer
					color={'#ffffff'}
					intensity={45}
					rotation={[0, Math.PI / 2, 0]}
					position={[-7.5, 1.7, 4.3]}
					scale={[7.4, 1, 1]}
				/>
			</Float>

			<Float
				speed={2}
				floatIntensity={4}
				rotationIntensity={6}
				rotation={[0, Math.PI / 2, 0]}>
				<Lightformer
					ref={ringLightRef}
					form='ring'
					color={'#fbecbd'}
					intensity={3}
					position={[4, -1, 3]}
					scale={10}
				/>
			</Float>

			{/* <Lightformer
				color={'#fddf73'}
				intensity={15}
				rotation={[Math.PI, Math.PI / 2, 0]}
				position={[16, -2, 3]}
				scale={[5, 2, 1]}
			/> */}

			{/* Ceiling */}
			{/* <Lightformer
				intensity={3.75}
				rotation-x={Math.PI / 2}
				position={[0, 5, -9]}
				scale={[10, 10, 1]}
			/> */}
			<group position={[-2, 0, 0]}>
				<group ref={group}>
					{[-2, 0].map((e, i) => (
						<Lightformer
							key={i}
							form='circle'
							intensity={4}
							rotation={[0, 0, Math.PI / 2]}
							position={[i * 5, e, 2]}
							scale={[8, 1.25, 1]}
						/>
					))}
				</group>
			</group>
		</>
	);
}
