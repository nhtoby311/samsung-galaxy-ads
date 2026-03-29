import { create } from 'zustand';

type PhoneSize = { width: number; height: number };

interface AppStore {
	phoneSize: PhoneSize | null;
	loadingProgress: number;
	loaded: boolean;
	sceneVisible: boolean;
	setPhoneSize: (size: PhoneSize) => void;
	setLoadingProgress: (progress: number) => void;
	setLoaded: (loaded: boolean) => void;
	setSceneVisible: (visible: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
	phoneSize: null,
	loadingProgress: 0,
	loaded: false,
	sceneVisible: false,
	setPhoneSize: (phoneSize) => set({ phoneSize }),
	setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
	setLoaded: (loaded) => set({ loaded }),
	setSceneVisible: (sceneVisible) => set({ sceneVisible }),
}));
