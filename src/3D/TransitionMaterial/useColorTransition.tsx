import * as THREE from "three";
import { useEffect, useRef, useCallback } from "react";
import { animate } from "motion";
import { useAppStore } from "../../store";

type ColorScheme = {
  frameColor: string;
  bgColors: [string, string, string, string];
  edgeColor1: string;
  edgeColor2: string;
  edgeColor3: string;
  edgeColor4: string;
  overlayDotColor: string;
};

export const COLORS = [
  { label: "Lavender", value: "#6e5da4" },
  { label: "Midnight", value: "#1a1a2e" },
  { label: "Sage", value: "#7a9e7e" },
  { label: "Coral", value: "#e07a5f" },
  { label: "Sky Blue", value: "#a1f1ff" },
  { label: "Sand", value: "#c9a96e" },
] as const;

export type ColorValue = (typeof COLORS)[number]["value"];

export const COLOR_SCHEMES: Record<ColorValue, ColorScheme> = {
  "#6e5da4": {
    // Lavender
    frameColor: "#7a6d9a",
    bgColors: ["#4b38ab", "#5e77c1", "#8077e5", "#b9beff"],
    edgeColor1: "#f5ffc6",
    edgeColor2: "#ff4b00",
    edgeColor3: "#7a093d",
    edgeColor4: "#4f2691",
    overlayDotColor: "#fdaac9",
  },
  "#1a1a2e": {
    // Midnight
    frameColor: "#2a3050",
    bgColors: ["#27272a", "#7a7171", "#6d6c6c", "#383434"],
    edgeColor1: "#ffffff",
    edgeColor2: "#0d9dff",
    edgeColor3: "#2d62fa",
    edgeColor4: "#324bc8",
    overlayDotColor: "#6093f0",
  },
  "#7a9e7e": {
    // Sage
    frameColor: "#8aaa7a",
    bgColors: ["#3a5e3a", "#5e7e5e", "#4a6e5e", "#7a9e7e"],
    edgeColor1: "#7171fb",
    edgeColor2: "#2e3896",
    edgeColor3: "#10595e",
    edgeColor4: "#136e2a",
    overlayDotColor: "#fff12d",
  },
  "#e07a5f": {
    // Coral
    frameColor: "#c06040",
    bgColors: ["#5e2010", "#8e4020", "#b06030", "#e08050"],
    edgeColor1: "#f5ffc4",
    edgeColor2: "#ffd68e",
    edgeColor3: "#b5a62a",
    edgeColor4: "#ab6e2d",
    overlayDotColor: "#f3ffca",
  },
  "#a1f1ff": {
    // Sky Blue
    frameColor: "#80c8e0",
    bgColors: ["#304858", "#507888", "#7098a8", "#90b8c8"],
    edgeColor1: "#5040ff",
    edgeColor2: "#207cc7",
    edgeColor3: "#4020e2",
    edgeColor4: "#5035ff",
    overlayDotColor: "#9200f3",
  },
  "#c9a96e": {
    // Sand
    frameColor: "#b09050",
    bgColors: ["#5e4010", "#8e6820", "#b08040", "#c8a060"],
    edgeColor1: "#ff1515",
    edgeColor2: "#9e460f",
    edgeColor3: "#9a2a2a",
    edgeColor4: "#8d6e10",
    overlayDotColor: "#ffffff",
  },
};

// Fallback scheme used when no matching color is found
const FALLBACK_SCHEME = COLOR_SCHEMES["#6e5da4"];

type TransitionUniforms = {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uProgress: { value: number };
  uEdgeColor1: { value: THREE.Color };
  uEdgeColor2: { value: THREE.Color };
  uEdgeColor3: { value: THREE.Color };
  uEdgeColor4: { value: THREE.Color };
  uOverlayDotColor: { value: THREE.Color };
};

type TransitionMaterialRef = {
  uniforms: TransitionUniforms;
};

const uProgressRange = { start: 0.3, end: 0.6 }; // Only animate between these progress values to allow seamless looping

export function useColorTransition() {
  const materialRefStore = useAppStore((s) => s.materialTransitionRef);
  const currentPhoneColor = useAppStore((s) => s.currentPhoneColor);
  const setCurrentPhoneColor = useAppStore((s) => s.setCurrentPhoneColor);
  const isTransitioning = useAppStore((s) => s.isTransitioning);
  const setIsTransitioning = useAppStore((s) => s.setIsTransitioning);
  const frameColorObject = useAppStore((s) => s.frameColorObject);
  const bgColorObjects = useAppStore((s) => s.bgColorObjects);

  // Cache the material in a ref so transitionTo callbacks always see the latest value.
  const materialRef = useRef<TransitionMaterialRef | null>(null);

  // Initialise uniform colors when the material first becomes available.
  useEffect(() => {
    materialRef.current = materialRefStore;
    const mat = materialRef.current;
    if (!mat?.uniforms) return;
    mat.uniforms.uColor1.value = new THREE.Color(currentPhoneColor);
    mat.uniforms.uColor2.value = new THREE.Color(currentPhoneColor);
    mat.uniforms.uProgress.value = 0;
    // Apply the initial color scheme
    const scheme = COLOR_SCHEMES[currentPhoneColor] ?? FALLBACK_SCHEME;
    mat.uniforms.uEdgeColor1.value = new THREE.Color(scheme.edgeColor1);
    mat.uniforms.uEdgeColor2.value = new THREE.Color(scheme.edgeColor2);
    mat.uniforms.uEdgeColor3.value = new THREE.Color(scheme.edgeColor3);
    mat.uniforms.uEdgeColor4.value = new THREE.Color(scheme.edgeColor4);
    mat.uniforms.uOverlayDotColor.value = new THREE.Color(
      scheme.overlayDotColor,
    );
  }, [materialRefStore]); // eslint-disable-line react-hooks/exhaustive-deps

  const transitionTo = useCallback(
    (nextColor: ColorValue) => {
      const mat = materialRef.current;
      if (!mat?.uniforms) return;

      const scheme = COLOR_SCHEMES[nextColor] ?? FALLBACK_SCHEME;

      // Apply next edge/overlay colors immediately (shader-side, no perceived pop)
      mat.uniforms.uEdgeColor1.value.set(scheme.edgeColor1);
      mat.uniforms.uEdgeColor2.value.set(scheme.edgeColor2);
      mat.uniforms.uEdgeColor3.value.set(scheme.edgeColor3);
      mat.uniforms.uEdgeColor4.value.set(scheme.edgeColor4);
      mat.uniforms.uOverlayDotColor.value.set(scheme.overlayDotColor);

      // Animate the MetalFrame material's color object directly — no store push needed.
      if (frameColorObject) {
        const targetFrameColor = new THREE.Color(scheme.frameColor);
        animate(
          frameColorObject,
          {
            r: targetFrameColor.r,
            g: targetFrameColor.g,
            b: targetFrameColor.b,
          },
          { duration: 1.2, ease: "easeInOut" },
        );
      }

      // Animate each background color object in-place — Background reads them every frame.
      const targetBgColors = scheme.bgColors.map((h) => new THREE.Color(h));
      bgColorObjects.forEach((colorObj, i) =>
        animate(
          colorObj,
          {
            r: targetBgColors[i].r,
            g: targetBgColors[i].g,
            b: targetBgColors[i].b,
          },
          { duration: 1.2, ease: "easeInOut" },
        ),
      );

      // Prime the new transition: uColor1 stays as current, uColor2 is the target.
      mat.uniforms.uColor2.value = new THREE.Color(nextColor);

      setIsTransitioning(true);

      animate(uProgressRange.start, uProgressRange.end, {
        duration: 1.2,
        ease: "easeInOut",
        onUpdate(value) {
          if (materialRef.current?.uniforms?.uProgress) {
            materialRef.current.uniforms.uProgress.value = value;
          }
        },
        onComplete() {
          const m = materialRef.current;
          if (!m?.uniforms) return;

          // Seamless reset: snap Start = End, progress back to min uProgressRange.
          // Swap colors
          const startColor = m.uniforms.uColor1.value;
          m.uniforms.uColor1.value = new THREE.Color(nextColor);
          m.uniforms.uColor2.value = startColor;
          m.uniforms.uProgress.value = uProgressRange.start;

          setCurrentPhoneColor(nextColor);
          setIsTransitioning(false);
        },
      });
    },
    [
      setCurrentPhoneColor,
      setIsTransitioning,
      frameColorObject,
      bgColorObjects,
    ],
  );

  return { transitionTo, isTransitioning };
}
