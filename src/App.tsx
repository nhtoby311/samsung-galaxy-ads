import { Canvas } from '@react-three/fiber';
import Scene from './3D/Scene';
import { CameraControls } from '@react-three/drei';

function App() {
	return (
		<div className='background-canvas'>
			<Canvas
				camera={{
					fov: 25,
					near: 0.1,
					far: 100,
					position: [0, 0, 18],
				}}
				shadows>
				<Scene />

				<CameraControls />
			</Canvas>
		</div>
	);
}

export default App;
