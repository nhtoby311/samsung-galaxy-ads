import { create } from 'zustand';
import * as THREE from 'three';
import type { ColorValue } from './3D/TransitionMaterial/useColorTransition';

type PhoneSize = { width: number; height: number };

interface AppStore {
	phoneSize: PhoneSize | null;
	loadingProgress: number;
	loaded: boolean;
	sceneVisible: boolean;
	currentPhoneColor: ColorValue;
	nextPhoneColor: ColorValue;
	isTransitioning: boolean;
	isPrivacyDisplay: boolean;
	isVideoPlaying: boolean;
	materialTransitionRef: any;
	/** The live THREE.Color on Samsung's MetalFrame material, registered on mount. */
	frameColorObject: THREE.Color | null;
	/** Stable THREE.Color objects for background — mutated in-place by the transition hook. */
	bgColorObjects: THREE.Color[];
	toastMessage: string | null;
	showToast: (message: string, duration?: number) => void;
	hideToast: () => void;
	setPhoneSize: (size: PhoneSize) => void;
	setLoadingProgress: (progress: number) => void;
	setLoaded: (loaded: boolean) => void;
	setSceneVisible: (visible: boolean) => void;
	setCurrentPhoneColor: (color: ColorValue) => void;
	setNextPhoneColor: (color: ColorValue) => void;
	setIsTransitioning: (v: boolean) => void;
	togglePrivacyDisplay: () => void;
	setIsVideoPlaying: (v: boolean) => void;
	setMaterialTransitionRef: (ref: any) => void;
	setFrameColorObject: (color: THREE.Color) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useAppStore = create<AppStore>((set) => ({
	phoneSize: null,
	loadingProgress: 0,
	loaded: false,
	sceneVisible: false,
	currentPhoneColor: '#6e5da4',
	nextPhoneColor: '#1a1a2e',
	isTransitioning: false,
	isPrivacyDisplay: false,
	isVideoPlaying: false,
	materialTransitionRef: null,
	frameColorObject: null,
	bgColorObjects: ['#4b38ab', '#5e77c1', '#8077e5', '#b9beff'].map(
		(h) => new THREE.Color(h),
	),
	toastMessage: null,
	showToast: (message, duration = 2000) => {
		if (toastTimer) clearTimeout(toastTimer);
		set({ toastMessage: message });
		toastTimer = setTimeout(() => {
			set({ toastMessage: null });
			toastTimer = null;
		}, duration);
	},
	hideToast: () => {
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = null;
		set({ toastMessage: null });
	},
	setPhoneSize: (phoneSize) => set({ phoneSize }),
	setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
	setLoaded: (loaded) => set({ loaded }),
	setSceneVisible: (sceneVisible) => set({ sceneVisible }),
	setCurrentPhoneColor: (currentPhoneColor) => set({ currentPhoneColor }),
	setNextPhoneColor: (nextPhoneColor) => set({ nextPhoneColor }),
	setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
	togglePrivacyDisplay: () =>
		set((s) => ({ isPrivacyDisplay: !s.isPrivacyDisplay })),
	setIsVideoPlaying: (isVideoPlaying) => set({ isVideoPlaying }),
	setMaterialTransitionRef: (materialTransitionRef) =>
		set({ materialTransitionRef }),
	setFrameColorObject: (frameColorObject) => set({ frameColorObject }),
}));
