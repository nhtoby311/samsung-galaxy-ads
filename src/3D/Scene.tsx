import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CameraControls, Environment } from "@react-three/drei";
import { Samsung } from "./Samsung";
// import Lightformers from './Lightformers';
import { ProgressSync } from "./ProgressSync";
import { PhoneBoundsTracker } from "./PhoneBoundsTracker";
import Background from "./Background/Background";
import { useCameraSide } from "../hooks/useCameraSide";
import { useAppStore } from "../store";

// Azimuth/polar targets for each hemisphere (equator level)
const FRONT_AZIMUTH = 0; // directly in front of the phone
const BACK_AZIMUTH = Math.PI; // directly behind the phone
const EQUATOR_POLAR = Math.PI / 2; // horizontal / eye-level

interface SceneProps {
  controlsRef: React.RefObject<CameraControls | null>;
}

export default function Scene({ controlsRef }: SceneProps) {
  const phoneRef = useRef<THREE.Group>(null);

  const sideRef = useCameraSide(); // defaults to target (0, 0, 1.17)

  // When isPrivacyDisplay toggles and camera is in the FRONT → animate to BACK
  useEffect(() => {
    return useAppStore.subscribe((state, prev) => {
      if (state.isPrivacyDisplay === prev.isPrivacyDisplay) return;
      if (sideRef.current.frontBack === "front") {
        controlsRef.current?.rotateTo(BACK_AZIMUTH, EQUATOR_POLAR, true);
      }
    });
  }, []);

  // When phone color transition STARTS and camera is in the BACK → animate to FRONT
  useEffect(() => {
    return useAppStore.subscribe((state, prev) => {
      if (state.isTransitioning === prev.isTransitioning) return;
      if (!state.isTransitioning) return; // only on transition start, not end
      if (sideRef.current.frontBack === "back") {
        controlsRef.current?.rotateTo(FRONT_AZIMUTH, EQUATOR_POLAR, true);
      }
    });
  }, []);

  //When isVideoPlaying toggles and camera is in the FRONT → animate to BACK
  useEffect(() => {
    return useAppStore.subscribe((state, prev) => {
      if (state.isVideoPlaying === prev.isVideoPlaying) return;
      if (state.isVideoPlaying) {
        if (sideRef.current.frontBack === "front") {
          controlsRef.current?.rotateTo(BACK_AZIMUTH, EQUATOR_POLAR, true);
        }
      }
    });
  }, []);

  return (
    <>
      {/* <Perf /> */}
      {/* <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={0.9} mipmapBlur />
      </EffectComposer> */}

      <ProgressSync />
      <Background />
      <Environment
        //frames={Infinity}
        preset="warehouse"
        //background
        environmentIntensity={0.55}
      >
        {/* <Lightformers /> */}
      </Environment>
      <Samsung
        renderOrder={10}
        ref={phoneRef}
        scale={4}
        rotation={[0, Math.PI, 0]}
      />
      <PhoneBoundsTracker groupRef={phoneRef} />
    </>
  );
}
