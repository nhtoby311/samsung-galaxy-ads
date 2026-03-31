import { create } from 'zustand';
import * as THREE from 'three';

type PhoneSize = { width: number; height: number };

interface AppStore {
	phoneSize: PhoneSize | null;
	loadingProgress: number;
	loaded: boolean;
	sceneVisible: boolean;
	currentPhoneColor: string;
	nextPhoneColor: string;
	isTransitioning: boolean;
	isPrivacyDisplay: boolean;
	materialTransitionRef: any;
	/** The live THREE.Color on Samsung's MetalFrame material, registered on mount. */
	frameColorObject: THREE.Color | null;
	/** Stable THREE.Color objects for background — mutated in-place by the transition hook. */
	bgColorObjects: THREE.Color[];
	setPhoneSize: (size: PhoneSize) => void;
	setLoadingProgress: (progress: number) => void;
	setLoaded: (loaded: boolean) => void;
	setSceneVisible: (visible: boolean) => void;
	setCurrentPhoneColor: (color: string) => void;
	setNextPhoneColor: (color: string) => void;
	setIsTransitioning: (v: boolean) => void;
	togglePrivacyDisplay: () => void;
	setMaterialTransitionRef: (ref: any) => void;
	setFrameColorObject: (color: THREE.Color) => void;
}

export const useAppStore = create<AppStore>((set) => ({
	phoneSize: null,
	loadingProgress: 0,
	loaded: false,
	sceneVisible: false,
	currentPhoneColor: '#8977c1',
	nextPhoneColor: '#8977c1',
	isTransitioning: false,
	isPrivacyDisplay: false,
	materialTransitionRef: null,
	frameColorObject: null,
	bgColorObjects: ['#4b38ab', '#5e77c1', '#8077e5', '#b9beff'].map(
		(h) => new THREE.Color(h),
	),
	setPhoneSize: (phoneSize) => set({ phoneSize }),
	setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
	setLoaded: (loaded) => set({ loaded }),
	setSceneVisible: (sceneVisible) => set({ sceneVisible }),
	setCurrentPhoneColor: (currentPhoneColor) => set({ currentPhoneColor }),
	setNextPhoneColor: (nextPhoneColor) => set({ nextPhoneColor }),
	setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
	togglePrivacyDisplay: () =>
		set((s) => ({ isPrivacyDisplay: !s.isPrivacyDisplay })),
	setMaterialTransitionRef: (materialTransitionRef) =>
		set({ materialTransitionRef }),
	setFrameColorObject: (frameColorObject) => set({ frameColorObject }),
}));
