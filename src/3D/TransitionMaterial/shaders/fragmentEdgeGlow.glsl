precision mediump float;

uniform float uProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform vec3 uNoisePosition;
uniform vec2 uMinMaxGradientMaskY;
uniform float uEdgeThickness;
uniform float uDotDensity;

// --- GRADIENT EDGE UNIFORMS ---
uniform vec3 uEdgeColor1;          // Gradient stop color 1 (at anchor)
uniform vec3 uEdgeColor2;          // Gradient stop color 2
uniform vec3 uEdgeColor3;          // Gradient stop color 3
uniform vec3 uEdgeColor4;          // Gradient stop color 4 (at far edge)
uniform float uEdgeColorStop1;     // Stop position for color 1 (0.0 - 1.0, relative to edge width)
uniform float uEdgeColorStop2;     // Stop position for color 2
uniform float uEdgeColorStop3;     // Stop position for color 3
uniform float uEdgeColorStop4;     // Stop position for color 4
uniform float uEdgeColorWidth;     // How far the edge color extends from the anchor

varying vec3 vPosition;

vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.xxx * 2.0;
    vec3 x3 = x0 - 1.0 + C.xxx * 3.0;

    i = mod(i, 289.0);
    vec4 p = permute(
        permute(
            permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0)
        )
        + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 edgeGradient(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t <= uEdgeColorStop1) return uEdgeColor1;
    if (t <= uEdgeColorStop2) return mix(uEdgeColor1, uEdgeColor2, (t - uEdgeColorStop1) / max(uEdgeColorStop2 - uEdgeColorStop1, 0.0001));
    if (t <= uEdgeColorStop3) return mix(uEdgeColor2, uEdgeColor3, (t - uEdgeColorStop2) / max(uEdgeColorStop3 - uEdgeColorStop2, 0.0001));
    if (t <= uEdgeColorStop4) return mix(uEdgeColor3, uEdgeColor4, (t - uEdgeColorStop3) / max(uEdgeColorStop4 - uEdgeColorStop3, 0.0001));
    return uEdgeColor4;
}

void main() {
    vec3 noiseVec = (vPosition + uNoisePosition) * uNoiseScale + vec3(uTime * uNoiseSpeed);
    float noiseValue = snoise(noiseVec);
    float combinedValue = noiseValue + vPosition.y;

    float remappedValue = clamp((combinedValue - uMinMaxGradientMaskY.x) / (uMinMaxGradientMaskY.y - uMinMaxGradientMaskY.x), 0.0, 1.0);
    float invertedValue = 1.0 - remappedValue;

    float transitionCenter = 1.0 - uProgress;
    
    // Gradient mask with falloff
    float gradientMask = smoothstep(transitionCenter - uEdgeThickness, transitionCenter + uEdgeThickness, invertedValue);

    vec2 dotUv = vPosition.xy * uDotDensity;
    vec2 dotGrid = fract(dotUv);
    float dotSize = gradientMask;
    float dotPattern = 1.0 - step(dotSize, length(dotGrid - 0.5));

    // --- EDGE COLOR EFFECT (anchored at leading edge of thickness) ---
    
    // Anchor point: the uColor1-side boundary of the dot transition band
    float edgeAnchor = transitionCenter - uEdgeThickness;

    // How far this fragment is past the anchor into uColor2 territory
    float distFromAnchor = invertedValue - edgeAnchor;

    // Normalize to [0, 1] within the edge color width (0 = at anchor, 1 = far edge)
    float edgeColorT = clamp(distFromAnchor / max(uEdgeColorWidth, 0.0001), 0.0, 1.0);

    // Glow intensity: strongest at the anchor, fading to 0 at the far edge
    float glowMask = 1.0 - edgeColorT;
    float opticalFalloff = pow(glowMask, 1.5);

    // Only apply the effect in the valid region (past the anchor)
    float inEdgeRegion = step(edgeAnchor, invertedValue) * step(invertedValue, edgeAnchor + uEdgeColorWidth);
    opticalFalloff *= inEdgeRegion;

    // Sample the 4-stop gradient relative to the edge color width
    vec3 sampledEdgeColor = edgeGradient(edgeColorT);

    // --- FINAL COLOR MIXING ---
    
    // Apply the gradient edge glow over uColor2
    vec3 baseWithGlow = mix(uColor2, sampledEdgeColor, opticalFalloff);
    
    // Mix between uColor1 and the glowing base using the dot pattern transition
    vec3 finalColor = mix(uColor1, baseWithGlow, dotPattern);

    csm_DiffuseColor = vec4(finalColor, 1.0);
}