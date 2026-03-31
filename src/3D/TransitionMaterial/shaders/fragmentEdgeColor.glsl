precision mediump float;

uniform float uProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform vec2 uMinMaxGradientMaskY;
uniform float uEdgeThickness;
uniform float uDotDensity;

// --- NEW UNIFORMS FOR THE GRADIENT LAYER ---
uniform vec3 uEdgeColor;           // The base color of the glowing edge
uniform float uEdgeColorWidth;      // Controls how wide the total edge color effect is

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

void main() {
    vec3 noiseVec = vPosition * uNoiseScale + vec3(uTime * uNoiseSpeed);
    float noiseValue = snoise(noiseVec);
    float combinedValue = noiseValue + vPosition.y;

    float remappedValue = clamp((combinedValue - uMinMaxGradientMaskY.x) / (uMinMaxGradientMaskY.y - uMinMaxGradientMaskY.x), 0.0, 1.0);
    float invertedValue = 1.0 - remappedValue;

    float transitionCenter = 1.0 - uProgress;
    float distanceFromTransition = abs(invertedValue - transitionCenter);
    
    // Gradient mask with falloff
    float gradientMask = smoothstep(transitionCenter - uEdgeThickness, transitionCenter + uEdgeThickness, invertedValue);

    vec2 dotUv = vPosition.xy * uDotDensity;
    vec2 dotGrid = fract(dotUv);
    float dotSize = gradientMask;
    float dotPattern = 1.0 - step(dotSize, length(dotGrid - 0.5));

    // --- NEW LAYERED EDGE EFFECT ---
    
    // 1. Overall Glow Mask (Fades from 1 down to 0 at the uEdgeColorWidth limit)
    float glowMask = 1.0 - smoothstep(0.0, uEdgeColorWidth, distanceFromTransition);

    // 2. Curve the glow falloff for a more natural atmospheric look
    float opticalFalloff = pow(glowMask, 1.5);

    // --- FINAL COLOR MIXING ---
    
    // First apply the edge glow over uColor1
    vec3 baseWithGlow = mix(uColor1, uEdgeColor, opticalFalloff);
    
    // Then mix between the glowing base and uColor2 using the dot pattern transition
    vec3 finalColor = mix(baseWithGlow, uColor2, dotPattern);

    csm_DiffuseColor = vec4(finalColor, 1.0);
}