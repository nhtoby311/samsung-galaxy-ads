import * as THREE from "three";
// import fragmentShader from './shaders/fragment.glsl';

import fragmentShader from "./shaders/fragment.glsl?raw";
import vertexShader from "./shaders/vertex.glsl?raw";
import CSM from "three-custom-shader-material";
import { forwardRef } from "react";
import { useAppStore } from "../../store";

const TransitionMaterial = forwardRef((props: any) => {
  const setMaterialRef = useAppStore((store) => store.setMaterialRef);

  const uniforms = {
    uProgress: { value: 0 },
    uColor1: { value: new THREE.Color("#8977c1") },
    uColor2: { value: new THREE.Color("#8977c1") },
    uTime: { value: 0 },
    uNoiseScale: { value: 3.0 },
    uNoiseSpeed: { value: 0.2 },
    uMinMaxGradientMaskY: { value: new THREE.Vector2(-1.0, 1.0) },
    uEdgeThickness: { value: 0.03 },
    uDotDensity: { value: 12.0 },
  };

  return (
    <CSM
      baseMaterial={THREE.MeshStandardMaterial}
      key={1}
      transparent={true}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      ref={setMaterialRef}
      {...props}
    />
  );
});

export default TransitionMaterial;
