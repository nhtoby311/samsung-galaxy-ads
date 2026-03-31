import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './3D/Scene';
import { CameraControls } from '@react-three/drei';
import { LoadingScreen } from './LoadingScreen';
import { useAppStore } from './store';
import { Leva } from 'leva';
import { ColorPicker } from './components/ColorPicker';
import BottomOverlay from './components/OverlayLayout/BottomOverlay';
//import { ColorPicker } from "./components/ColorPicker";

function App() {
	const controlsRef = useRef<CameraControls>(null);
	const sceneVisible = useAppStore((s) => s.sceneVisible);

	// HACK: Bc after .glb animated, object shift away from 0,0,0. So shift target to orbit obj
	useEffect(() => {
		if (!sceneVisible) return;
		controlsRef.current?.setTarget(0, 0, 1.17, true);
	}, [sceneVisible]);

	return (
		<>
			<div className='background-canvas'>
				<Canvas
					camera={{
						fov: 25,
						near: 0.1,
						far: 100,
						position: [0, 0, 3.2],
					}}
					shadows>
					<Scene />

					<CameraControls ref={controlsRef} />

					{/* <mesh position={[0, 0, 1.17]}>
					<boxGeometry args={[0.1, 0.1, 0.1]} />
					<meshBasicMaterial color='red' />
				</mesh> */}
				</Canvas>
				<Leva collapsed />
				<LoadingScreen />
			</div>

			<div className='fixed-overlay'>
				<div className='empty-overlay'></div>
				<div className='empty-overlay'></div>

				<div className='empty-overlay'>
					<div className='bottom'>
						<BottomOverlay />
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
