// ==========================================
// 1. UNIFORMS & VARYINGS
// ==========================================
uniform float uProgress;
uniform vec3 uControlPosition;   // The X,Y,Z position of your Three.js sphere
uniform float uControlRadius;    // Equivalent to Blender's "Value.007"
uniform vec2 uMinMaxGradientMaskY; // vec2(minY, maxY) of your mesh
uniform vec3 uTransitionColor;
uniform vec3 uDotColor;
uniform float uNoiseStrength;
uniform float uDotMapping;
uniform float uBigDotScale;
uniform float uSmallDotScale;
uniform float uEmissionStrength;

varying vec3 vPosition;
varying vec2 vUv;

// ==========================================
// 2. MATH & NOISE UTILS
// ==========================================
vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 hash33(vec3 p) {
    p = fract(p * vec3(.1031, .1030, .0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
}

// 3D Simplex Noise
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
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
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

float fbm(vec3 p, int octaves, float roughness) {
    float f = 0.0;
    float amp = 1.0;
    float maxAmp = 0.0;
    for(int i = 0; i < 8; i++) {
        if(i >= octaves)
            break;
        f += snoise(p) * amp;
        maxAmp += amp;
        p *= 2.0;
        amp *= roughness;
    }
    return f / maxAmp;
}

float voronoi(vec3 x) {
    return length(fract(x) - 0.5);
}

// ==========================================
// 3. BLEND MODES (Float & Vec3 Overloads)
// ==========================================
float blendLinearLight(float a, float b, float fac) {
    return mix(a, b < 0.5 ? max(a + (2.0 * b) - 1.0, 0.0) : min(a + 2.0 * (b - 0.5), 1.0), fac);
}
float blendColorDodge(float a, float b, float fac) {
    return mix(a, b == 1.0 ? 1.0 : min(a / (1.0 - b), 1.0), fac);
}
float blendSubtract(float a, float b, float fac) {
    return mix(a, max(a - b, 0.0), fac);
}
float blendDarken(float a, float b, float fac) {
    return mix(a, min(a, b), fac);
}
float blendDivide(float a, float b, float fac) {
    return mix(a, b == 0.0 ? 0.0 : a / b, fac);
}
float blendMultiply(float a, float b, float fac) {
    return mix(a, a * b, fac);
}

// Soft Light (Float + Vec3)
float softLightBase(float a, float b) {
    return b < 0.5 ? 2.0 * a * b + a * a * (1.0 - 2.0 * b) : 2.0 * a * (1.0 - b) + sqrt(a) * (2.0 * b - 1.0);
}
float blendSoftLight(float a, float b, float fac) {
    return mix(a, softLightBase(a, b), fac);
}
vec3 blendSoftLight(vec3 a, vec3 b, float fac) {
    return mix(a, vec3(softLightBase(a.r, b.r), softLightBase(a.g, b.g), softLightBase(a.b, b.b)), fac);
}

// Screen (Float + Vec3)
float screenBase(float a, float b) {
    return 1.0 - (1.0 - a) * (1.0 - b);
}
float blendScreen(float a, float b, float fac) {
    return mix(a, screenBase(a, b), fac);
}
vec3 blendScreen(vec3 a, vec3 b, float fac) {
    return mix(a, vec3(screenBase(a.r, b.r), screenBase(a.g, b.g), screenBase(a.b, b.b)), fac);
}

// Color Blend Mode
float getLum(vec3 c) {
    return dot(c, vec3(0.3, 0.59, 0.11));
}
vec3 setLum(vec3 c, float l) {
    float d = l - getLum(c);
    return c + vec3(d);
}
vec3 clipColor(vec3 c) {
    float l = getLum(c);
    float n = min(min(c.r, c.g), c.b);
    float x = max(max(c.r, c.g), c.b);
    if(n < 0.0)
        c = l + (((c - l) * l) / (l - n));
    if(x > 1.0)
        c = l + (((c - l) * (1.0 - l)) / (x - l));
    return c;
}
vec3 blendColorMode(vec3 base, vec3 blend, float fac) {
    vec3 result = clipColor(setLum(blend, getLum(base)));
    return mix(base, result, fac);
}

// ==========================================
// 4. COLOR RAMPS (1:1 Mapped to JSON Bounds)
// ==========================================
float map(float val, float inMin, float inMax, float outMin, float outMax) {
    return clamp(outMin + (val - inMin) * (outMax - outMin) / (inMax - inMin), min(outMin, outMax), max(outMin, outMax));
}

float ramp004(float t) {
    return map(t, 0.036, 0.344, 0.0, 1.0);
} // FIXED from 0.0 to 0.036
float ramp011(float t) {
    return map(t, 0.0, 0.385, 1.0, 0.0);
}
float ramp010(float t) {
    return map(t, 0.0, 0.552, 1.0, 0.0);
}
float ramp009(float t) {
    return map(t, 0.195, 0.371, 1.0, 0.0);
}
float ramp006(float t) {
    return map(t, 0.281, 0.292, 0.0, 1.0);
}

float ramp002(float t) {
    if(t < 0.277)
        return map(t, 0.008, 0.277, 0.0, 0.315);
    return map(t, 0.277, 1.0, 0.315, 1.0);
}
float ramp003(float t) {
    if(t < 0.849)
        return map(t, 0.0, 0.849, 0.0, 0.572);
    return map(t, 0.849, 1.0, 0.572, 1.0);
}
float ramp005(float t) {
    if(t < 0.256)
        return 0.0;
    if(t < 0.294)
        return map(t, 0.256, 0.294, 0.0, 0.327);
    return map(t, 0.294, 0.341, 0.327, 0.0);
}
float ramp007(float t) {
    if(t < 0.265)
        return 0.0;
    if(t < 0.283)
        return map(t, 0.265, 0.283, 0.0, 0.160);
    if(t < 0.297)
        return map(t, 0.283, 0.297, 0.160, 1.0);
    if(t < 0.322)
        return map(t, 0.297, 0.322, 1.0, 0.019);
    return map(t, 0.322, 0.343, 0.019, 0.0);
}
float ramp008(float t) {
    if(t < 0.196)
        return 0.0;
    if(t < 0.245)
        return map(t, 0.196, 0.245, 0.0, 0.017);
    if(t < 0.285)
        return map(t, 0.245, 0.285, 0.017, 0.182);
    if(t < 0.298)
        return map(t, 0.285, 0.298, 0.182, 0.521);
    if(t < 0.304)
        return map(t, 0.298, 0.304, 0.521, 0.348);
    if(t < 0.343)
        return map(t, 0.304, 0.343, 0.348, 0.030);
    if(t < 0.380)
        return map(t, 0.343, 0.380, 0.030, 0.004);
    return map(t, 0.380, 0.420, 0.004, 0.0);
}

// ==========================================
// 5. CORE TRANSITION LOGIC
// ==========================================
struct TransitionResult {
    float mixFactor;
    vec3 emission;
};

TransitionResult transition_fx(vec3 pos, vec2 uv) {
    vec3 mixCoords = mix(vec3(uv, 0.0), pos, uDotMapping);

    // Noise Texture.003 (Normalized)
    float noise003 = fbm(pos * 17.4 + vec3(0.0, 0.0, 2.3), 11, 0.6) * 0.5 + 0.5;
    // Musgrave Texture.003 (Un-normalized in Blender JSON) -> Returns rough bounds of -1 to 1.
    float musgrave003 = fbm(pos * 8.99, 2, 0.03); 
    // Noise Texture.001 (Normalized)
    float baseNoise = fbm(pos * 20.0 + vec3(0.0, 0.0, 1.4), 8, 0.525) * 0.5 + 0.5;

    float voronoi001 = voronoi(mixCoords * uBigDotScale);
    float voronoi002 = voronoi(mixCoords * uSmallDotScale);

   // ------------------------------------------------------------------
    // SPHERICAL DISTANCE MASK (Control Object)
    // ------------------------------------------------------------------
    // 1. Calculate the straight-line distance from the current pixel to the control sphere
    float dist = distance(pos, uControlPosition);

    // 2. Replicate Map Range.002 EXACTLY:
    // From Min = uControlRadius + 1.51 (Math.001 Add)
    // From Max = uControlRadius (Value.007)
    // To Min = 1.0, To Max = 0.0
    // We use smoothstep to interpolate this perfectly.
    float gradientMask = smoothstep(uControlRadius + 1.51, uControlRadius, dist);

    // Mix.008 & Mix.009 -> Base Mask
    float mix008 = clamp(blendLinearLight(noise003, musgrave003, 0.15), 0.0, 1.0);
    float baseMask = clamp(blendColorDodge(gradientMask, mix008, uNoiseStrength), 0.0, 1.0);

    // Core Branch Calculations
    float r008 = ramp008(baseMask);
    float r005 = ramp005(baseMask);
    float r006 = ramp006(baseMask);
    float r007 = ramp007(baseMask);

    // Left Tree Mixes
    float mixSubtract = blendSubtract(baseNoise, ramp004(voronoi001), 1.0);
    float mix002 = blendDarken(r008, mixSubtract, 1.0);
    float r011 = ramp011(mix002);

    // Center Tree Mixes
    float mix001 = blendDivide(r005, r007, 0.6);
    float mix003 = blendSoftLight(r007, ramp009(voronoi002), 1.0);
    float mix004 = blendMultiply(mix003, mix001, 0.5);
    float mix006 = blendLinearLight(mix004, r006, 1.0);
    float mix007 = blendMultiply(ramp010(mix004), mix006, 1.0);

    // Right Tree Mixes (Emission/Colors)
    vec3 mix013 = blendColorMode(vec3(ramp003(mix004)), uTransitionColor, 1.0);
    vec3 mix014 = blendColorMode(vec3(ramp002(mix002)), uDotColor, 1.0);

    // Mix.005 uses Soft Light, taking RGB inputs. Properly overloaded.
    vec3 mix005 = blendSoftLight(mix013, vec3(mix004), 1.0);

    // Mix.012 uses Screen, taking RGB inputs. Properly overloaded.
    vec3 mix012 = blendScreen(mix005, mix014, 1.0);

    TransitionResult res;
    // Mix.010 (Darken)
    res.mixFactor = blendDarken(mix007, r011, 1.0);
    res.emission = mix012;

    return res;
}

// ==========================================
// 6. MAIN MATERIAL ASSIGNMENT
// ==========================================
void main() {
    TransitionResult fx = transition_fx(vPosition, vUv);

    // Material A (Principled BSDF Default Base)
    vec3 matA_Color = vec3(0.0);
    float matA_Roughness = 0.4;
    float matA_Metalness = 1.0;

    // Material B (Principled BSDF.002 Default Base)
    vec3 matB_Color = vec3(1.0, 0.09, 0.09);
    float matB_Metalness = 0.0;

    // Map Range for MatB Roughness driven by baseNoise (10.0 scale)
    float noiseRoughnessMap = fbm(vPosition * 10.0, 7, 0.7) * 0.5 + 0.5;
    float matB_Roughness = map(noiseRoughnessMap, 0.0, 1.0, 0.3, 0.75);

    // Apply the Final Mix Factor
    vec3 finalColor = mix(matA_Color, matB_Color, fx.mixFactor);
    float finalRoughness = mix(matA_Roughness, matB_Roughness, fx.mixFactor);
    float finalMetalness = mix(matA_Metalness, matB_Metalness, fx.mixFactor);

    // Output to three-custom-shader-material
    csm_DiffuseColor = vec4(finalColor, 1.0);
    csm_Roughness = finalRoughness;
    csm_Metalness = finalMetalness;
    csm_Emissive = fx.emission * uEmissionStrength;
}