import * as THREE from "three";
import { useEffect, useRef, useCallback } from "react";
import { animate } from "motion";
import { useAppStore } from "../../store";

type ColorScheme = {
  frameColor: string;
  bgColors: [string, string, string, string, string, string];
  edgeColor1: string;
  edgeColor2: string;
  edgeColor3: string;
  edgeColor4: string;
  overlayDotColor: string;
};

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  "#8977c1": {
    // Lavender
    frameColor: "#a89cc4",
    bgColors: [
      "#4b38ab",
      "#5e77c1",
      "#8077e5",
      "#b9beff",
      "#dc93ff",
      "#e1beff",
    ],
    edgeColor1: "#ffffff",
    edgeColor2: "#0dfffa",
    edgeColor3: "#2d90fa",
    edgeColor4: "#193ef4",
    overlayDotColor: "#457de4",
  },
  "#1a1a2e": {
    // Midnight
    frameColor: "#2a3050",
    bgColors: [
      "#0d0d1a",
      "#1a1a3e",
      "#0d2040",
      "#1a2550",
      "#102030",
      "#203050",
    ],
    edgeColor1: "#6080ff",
    edgeColor2: "#2040c0",
    edgeColor3: "#102080",
    edgeColor4: "#081040",
    overlayDotColor: "#2040a0",
  },
  "#7a9e7e": {
    // Sage
    frameColor: "#8aaa7a",
    bgColors: [
      "#3a5e3a",
      "#5e7e5e",
      "#4a6e5e",
      "#7a9e7e",
      "#9ebe9e",
      "#c0d8c0",
    ],
    edgeColor1: "#c0e8c0",
    edgeColor2: "#80c880",
    edgeColor3: "#40a850",
    edgeColor4: "#207030",
    overlayDotColor: "#60a860",
  },
  "#e07a5f": {
    // Coral
    frameColor: "#c06040",
    bgColors: [
      "#5e2010",
      "#8e4020",
      "#b06030",
      "#e08050",
      "#f0a880",
      "#f8d0b0",
    ],
    edgeColor1: "#ffd0b0",
    edgeColor2: "#ff9060",
    edgeColor3: "#e05030",
    edgeColor4: "#a02010",
    overlayDotColor: "#e06040",
  },
  "#b8d8e8": {
    // Ice
    frameColor: "#a0c8e0",
    bgColors: [
      "#304858",
      "#507888",
      "#7098a8",
      "#90b8c8",
      "#b0d8e8",
      "#d0f0f8",
    ],
    edgeColor1: "#e0f8ff",
    edgeColor2: "#a0d8f0",
    edgeColor3: "#60b0e0",
    edgeColor4: "#2080c0",
    overlayDotColor: "#80c0e8",
  },
  "#c9a96e": {
    // Sand
    frameColor: "#b09050",
    bgColors: [
      "#5e4010",
      "#8e6820",
      "#b08040",
      "#c8a060",
      "#e0c080",
      "#f0d8a0",
    ],
    edgeColor1: "#f8e8c0",
    edgeColor2: "#e0c080",
    edgeColor3: "#c09040",
    edgeColor4: "#804810",
    overlayDotColor: "#d0a840",
  },
};

// Fallback scheme used when no matching color is found
const FALLBACK_SCHEME = COLOR_SCHEMES["#8977c1"];

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
    (nextColor: string) => {
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
          // Both colors are identical at this moment — no visible jump.
          m.uniforms.uColor1.value = new THREE.Color(nextColor);
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
