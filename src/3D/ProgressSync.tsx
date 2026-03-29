import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useAppStore } from '../store';

export function ProgressSync() {
	const { progress, loaded } = useProgress();
	const setLoadingProgress = useAppStore((s) => s.setLoadingProgress);
	const setLoaded = useAppStore((s) => s.setLoaded);

	useEffect(() => {
		setLoadingProgress(progress);
	}, [progress, setLoadingProgress]);

	useEffect(() => {
		if (loaded) {
			setLoaded(true);
		}
	}, [loaded, setLoaded]);

	return null;
}
