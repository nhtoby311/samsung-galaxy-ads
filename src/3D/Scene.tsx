import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import { Samsung } from './Samsung';
import Lightformers from './Lightformers';
import { ProgressSync } from './ProgressSync';
import { PhoneBoundsTracker } from './PhoneBoundsTracker';

export default function Scene() {
	const phoneRef = useRef<THREE.Group>(null);

	return (
		<>
			<ProgressSync />
			<Environment
				frames={Infinity}
				preset='studio'
				// background
				environmentIntensity={0.53}>
				<Lightformers />
			</Environment>
			<Samsung ref={phoneRef} scale={5} rotation={[0, Math.PI, 0]} />
			<PhoneBoundsTracker groupRef={phoneRef} />
		</>
	);
}
