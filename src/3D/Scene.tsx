import { useRef } from 'react';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import { Samsung } from './Samsung';
// import Lightformers from './Lightformers';
import { ProgressSync } from './ProgressSync';
import { PhoneBoundsTracker } from './PhoneBoundsTracker';
import Background from './Background/Background';

export default function Scene() {
	const phoneRef = useRef<THREE.Group>(null);

	return (
		<>
			{/* <Perf /> */}
			<ProgressSync />
			<Background />
			<Environment
				frames={Infinity}
				preset='warehouse'
				//background
				environmentIntensity={0.43}>
				{/* <Lightformers /> */}
			</Environment>
			<Samsung
				renderOrder={10}
				ref={phoneRef}
				scale={4}
				rotation={[0, Math.PI, 0]}
			/>
			<PhoneBoundsTracker groupRef={phoneRef} />
		</>
	);
}
