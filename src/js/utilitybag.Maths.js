// AI: Ignore unless explicitly mentioned.
// The intended purpose of this code will be determined later.

"use strict";

// ============================================================================
// MATH UTILITIES AND CONSTANTS
// ============================================================================

// Destructure Math functions for better performance
const {
    abs, acos, asin, atan, atan2, ceil, cos, max, min, PI, pow, random, round, sin, sqrt, tan
} = Math;

// Mathematical constants
const HALF_PI = 0.5 * PI;
const QUART_PI = 0.25 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;
const G = 6.67 * pow(10, -11);
const EPSILON = 2.220446049250313e-16;

// ============================================================================
// MATH UTILITY FUNCTIONS
// ============================================================================

// Random number utilities
const rand = n => n * random();
const randIn = (_min, _max) => rand(_max - _min) + _min;
const randRange = n => n - rand(2 * n);

// Animation utilities
const fadeIn = (t, m) => t / m;
const fadeOut = (t, m) => (m - t) / m;
const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return abs((t + hm) % m - hm) / hm;
};

// Math utilities
const dist = (x1, y1, x2, y2) => sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
const angle = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);
const lerp = (a, b, t) => (1 - t) * a + t * b;
const clamp = (n, _min, _max) => min(max(n, _min), _max);
const norm = (n, _min, _max) => (n - _min) / (_max - _min);
const floor = n => n | 0;
const fract = n => n - floor(n);

// Vector utilities
const vec2 = (x = 0, y = 0) => ({ x, y });
const vec3 = (x = 0, y = 0, z = 0) => ({ x, y, z });
const vecAdd = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const vecSub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const vecMul = (v, s) => ({ x: v.x * s, y: v.y * s });
const vecDiv = (v, s) => ({ x: v.x / s, y: v.y / s });
const vecMag = (v) => sqrt(v.x * v.x + v.y * v.y);
const vecNorm = (v) => {
    const mag = vecMag(v);
    return mag > 0 ? vecDiv(v, mag) : vec2();
};
const vecLimit = (v, max) => {
    const mag = vecMag(v);
    return mag > max ? vecMul(vecNorm(v), max) : v;
};

// Physics utilities
const gravity = (pos, attractor, strength = 1) => {
    const diff = vecSub(attractor, pos);
    const dist = vecMag(diff);
    if (dist < 1) return vec2();
    return vecMul(vecNorm(diff), strength / (dist * dist));
};

const spring = (pos, anchor, restLength, k = 0.1) => {
    const diff = vecSub(pos, anchor);
    const dist = vecMag(diff);
    const displacement = dist - restLength;
    return vecMul(vecNorm(diff), -k * displacement);
};

// Noise utilities (simple implementations)
const noise2D = (x, y) => {
    const n = sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return fract(n);
};

const noise3D = (x, y, z) => {
    const n = sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return fract(n);
};

const smoothNoise = (x, y) => {
    const corners = (noise2D(x - 1, y - 1) + noise2D(x + 1, y - 1) + 
                    noise2D(x - 1, y + 1) + noise2D(x + 1, y + 1)) / 16;
    const sides = (noise2D(x - 1, y) + noise2D(x + 1, y) + 
                  noise2D(x, y - 1) + noise2D(x, y + 1)) / 8;
    const center = noise2D(x, y) / 4;
    return corners + sides + center;
};

// Wave utilities
const wave = (x, amplitude = 1, frequency = 1, phase = 0) => 
    amplitude * sin(frequency * x + phase);

const wave2D = (x, y, amplitude = 1, frequency = 1, phase = 0) => 
    amplitude * sin(frequency * (x + y) + phase);

// Fractal utilities
const mandelbrot = (x, y, maxIter = 100) => {
    let zx = 0, zy = 0;
    let iter = 0;
    while (zx * zx + zy * zy < 4 && iter < maxIter) {
        const temp = zx * zx - zy * zy + x;
        zy = 2 * zx * zy + y;
        zx = temp;
        iter++;
    }
    return iter / maxIter;
};

// Viewport utilities
const vh = p => p * window.innerHeight * 0.01;
const vw = p => p * window.innerWidth * 0.01;
const vmin = p => min(vh(p), vw(p));
const vmax = p => max(vh(p), vw(p));

// Color utilities
const intToRGBA = n => {
    let r, g, b, a;
    n >>>= 0;
    r = (n & 0xff000000) >>> 24;
    g = (n & 0xff0000) >>> 16;
    b = (n & 0xff00) >>> 8;
    a = (n & 0xff) / 255;
    return `rgba(${[r, g, b, a].join()})`;
};

const nearestMultiple = (n, d) => n - n % d;

// ============================================================================
// EXPORT ALL MATH UTILITIES AND CONSTANTS
// ============================================================================

// Export Math functions
export {
    abs, acos, asin, atan, atan2, ceil, cos, max, min, PI, pow, random, round, sin, sqrt, tan
};

// Export mathematical constants
export {
    HALF_PI, QUART_PI, TAU, TO_RAD, G, EPSILON
};

// Export utility functions
export {
    rand, randIn, randRange,
    fadeIn, fadeOut, fadeInOut,
    dist, angle, lerp, clamp, norm, floor, fract,
    vh, vw, vmin, vmax,
    intToRGBA, nearestMultiple
};

// Export vector utilities
export {
    vec2, vec3, vecAdd, vecSub, vecMul, vecDiv, vecMag, vecNorm, vecLimit
};

// Export physics utilities
export {
    gravity, spring
};

// Export noise utilities
export {
    noise2D, noise3D, smoothNoise
};

// Export wave utilities
export {
    wave, wave2D
};

// Export fractal utilities
export {
    mandelbrot
}; 