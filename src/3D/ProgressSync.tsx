import { useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { useAppStore } from '../store';

export function ProgressSync() {
	const { progress } = useProgress();
	const setLoadingProgress = useAppStore((s) => s.setLoadingProgress);
	const setLoaded = useAppStore((s) => s.setLoaded);
	const fakeStarted = useRef(false);

	// Step 1: Real progress maps to 0–65% of displayed value
	useEffect(() => {
		if (!fakeStarted.current) {
			setLoadingProgress((progress / 100) * 65);
		}
	}, [progress, setLoadingProgress]);

	// Step 2: Once R3F reaches 100%, run fake sequence → 85% → 100%
	useEffect(() => {
		if (progress < 100 || fakeStarted.current) return;
		fakeStarted.current = true;

		setLoadingProgress(65);

		setTimeout(() => {
			setLoadingProgress(85);

			setTimeout(() => {
				setLoadingProgress(100);
				setLoaded(true);
			}, 1500);
		}, 1000);
	}, [progress, setLoadingProgress, setLoaded]);

	return null;
}
