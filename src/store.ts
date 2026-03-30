import { create } from "zustand";

type PhoneSize = { width: number; height: number };

interface AppStore {
  phoneSize: PhoneSize | null;
  loadingProgress: number;
  loaded: boolean;
  sceneVisible: boolean;
  currentPhoneColor: string;
  nextPhoneColor: string;
  isTransitioning: boolean;
  materialRef: any;
  setPhoneSize: (size: PhoneSize) => void;
  setLoadingProgress: (progress: number) => void;
  setLoaded: (loaded: boolean) => void;
  setSceneVisible: (visible: boolean) => void;
  setCurrentPhoneColor: (color: string) => void;
  setNextPhoneColor: (color: string) => void;
  setIsTransitioning: (v: boolean) => void;
  setMaterialRef: (ref: any) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  phoneSize: null,
  loadingProgress: 0,
  loaded: false,
  sceneVisible: false,
  currentPhoneColor: "#8977c1",
  nextPhoneColor: "#8977c1",
  isTransitioning: false,
  materialRef: null,
  setPhoneSize: (phoneSize) => set({ phoneSize }),
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  setLoaded: (loaded) => set({ loaded }),
  setSceneVisible: (sceneVisible) => set({ sceneVisible }),
  setCurrentPhoneColor: (currentPhoneColor) => set({ currentPhoneColor }),
  setNextPhoneColor: (nextPhoneColor) => set({ nextPhoneColor }),
  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
  setMaterialRef: (materialRef) => set({ materialRef }),
}));
