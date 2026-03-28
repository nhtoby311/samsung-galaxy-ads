import { Environment } from '@react-three/drei';
import { Samsung } from './Samsung';
import Lightformers from './Lightformers';

export default function Scene() {
	return (
		<>
			<Environment
				frames={Infinity}
				preset='studio'
				// background
				environmentIntensity={0.53}>
				<Lightformers />
			</Environment>
			<Samsung scale={5} />
		</>
	);
}
