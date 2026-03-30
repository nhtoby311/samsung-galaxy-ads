import * as THREE from "three";
import { useEffect, useRef, useCallback } from "react";
import { animate, type AnimationPlaybackControls } from "motion";
import { useAppStore } from "../../store";

type TransitionUniforms = {
  uColor1: { value: THREE.Color };
  uColor2: { value: THREE.Color };
  uProgress: { value: number };
};

type TransitionMaterialRef = {
  uniforms: TransitionUniforms;
};

const uProgressRange = { start: 0.4, end: 0.6 }; // Only animate between these progress values to allow seamless looping

export function useColorTransition() {
  const materialRefStore = useAppStore((s) => s.materialRef);
  const currentPhoneColor = useAppStore((s) => s.currentPhoneColor);
  const setCurrentPhoneColor = useAppStore((s) => s.setCurrentPhoneColor);
  const isTransitioning = useAppStore((s) => s.isTransitioning);
  const setIsTransitioning = useAppStore((s) => s.setIsTransitioning);

  // Cache in a ref so mutations inside callbacks don't trigger lint warnings
  // and always have the latest value without stale closures.
  const materialRef = useRef<TransitionMaterialRef | null>(null);

  const animationRef = useRef<AnimationPlaybackControls | null>(null);

  // Initialise uniform colors when the material first becomes available.
  useEffect(() => {
    materialRef.current = materialRefStore;
    const mat = materialRef.current;
    if (!mat?.uniforms) return;
    mat.uniforms.uColor1.value = new THREE.Color(currentPhoneColor);
    mat.uniforms.uColor2.value = new THREE.Color(currentPhoneColor);
    mat.uniforms.uProgress.value = 0;
  }, [materialRefStore]); // eslint-disable-line react-hooks/exhaustive-deps

  const transitionTo = useCallback(
    (nextColor: string) => {
      const mat = materialRef.current;
      if (!mat?.uniforms) return;

      // Stop any in-progress animation.
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }

      // Prime the new transition: uColor1 stays as current, uColor2 is the target.
      mat.uniforms.uColor2.value = new THREE.Color(nextColor);

      setIsTransitioning(true);

      animationRef.current = animate(uProgressRange.start, uProgressRange.end, {
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
          animationRef.current = null;
        },
      });
    },
    [setCurrentPhoneColor, setIsTransitioning],
  );

  return { transitionTo, isTransitioning };
}
