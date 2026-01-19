// AI: Ignore unless explicitly mentioned.
// The intended purpose of this code will be determined later.

"use strict";

// Import all math utilities and constants
import {
    abs, acos, asin, atan, atan2, ceil, cos, max, min, PI, pow, random, round, sin, sqrt, tan,
    HALF_PI, QUART_PI, TAU, TO_RAD, G, EPSILON,
    rand, randIn, randRange,
    fadeIn, fadeOut, fadeInOut,
    dist, angle, lerp, clamp, norm, floor, fract,
    vh, vw, vmin, vmax,
    intToRGBA, nearestMultiple,
    vec2, vec3, vecAdd, vecSub, vecMul, vecDiv, vecMag, vecNorm, vecLimit,
    gravity, spring,
    noise2D, noise3D, smoothNoise,
    wave, wave2D,
    mandelbrot
} from './utilitybag.Maths.js';

// ============================================================================
// MOVEMENT TYPE ENUMERATIONS
// ============================================================================

export const MovementType = {
    NOISE: 'noise',
    LINEAR: 'linear',
    CIRCULAR: 'circular',
    WAVE: 'wave',
    GRAVITY: 'gravity',
    BROWNIAN: 'brownian',
    SPRING: 'spring',
    SPIRAL: 'spiral',
    PENDULUM: 'pendulum',
    ATTRACTOR: 'attractor',
    PULSE: 'pulse',
    MAGNETIC: 'magnetic',
    TURBULENCE: 'turbulence',
    FRACTAL: 'fractal',
    CUSTOM_PATH: 'custom_path'
};

// ============================================================================
// TWIZZL'S PARTICLE CLASS
// ============================================================================

export class TwizzlsParticle {
    constructor(x = 0, y = 0, z = 0, options = {}) {
        // Position
        this.x = x;
        this.y = y;
        this.z = z;
        
        // Velocity
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        
        // Acceleration
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
        
        // Life cycle
        this.life = 0;
        this.ttl = options.ttl || 300;
        this.maxSpeed = options.maxSpeed || 5;
        this.maxForce = options.maxForce || 0.5;
        
        // Visual properties
        this.speed = 0;
        this.hue = options.hue || rand(360);
        this.size = options.size || 2;
        this.alpha = 1;
        
        // Text rendering properties
        this.renderAsText = options.renderAsText || false;
        this.text = options.text || this.generateRandomText();
        this.fontSize = options.fontSize || 12;
        this.fontFamily = options.fontFamily || 'Arial, sans-serif';
        
        // Movement properties
        this.movementType = options.movementType || MovementType.NOISE;
        this.movementParams = options.movementParams || {};
        
        // Noise properties
        this.noiseValue = 0;
        this.theta = 0;
        this.phi = 0;
        
        // Special properties for specific movement types
        this.angle = rand(TAU);
        this.angularVelocity = randRange(0.1);
        this.radius = rand(50) + 20;
        this.targetRadius = this.radius;
        this.phase = rand(TAU);
        this.frequency = rand(0.01) + 0.005;
        this.amplitude = rand(50) + 20;
        
        // Spring properties
        this.anchor = vec2(x, y);
        this.restLength = rand(100) + 50;
        this.springK = 0.01;
        this.damping = 0.98;
        
        // Attractor properties
        this.attractors = options.attractors || [];
        this.attractorStrength = 0.5;
        
        // Custom path properties
        this.pathPoints = options.pathPoints || [];
        this.pathIndex = 0;
        this.pathSpeed = 0.02;
        
        // Turbulence properties
        this.turbulenceScale = 0.01;
        this.turbulenceStrength = 1;
        
        // Fractal properties
        this.fractalScale = 0.01;
        this.fractalOffset = 0;
    }

    // Initialize particle with random position around center
    init(centerX, centerY, backdropSize) {
        const t = rand(TAU);
        this.x = centerX + randRange(0.5 * backdropSize) * cos(t);
        this.y = centerY + randRange(0.5 * backdropSize) * sin(t);
        this.z = rand(100);
        
        // Add initial velocity
        const initialSpeed = this.maxSpeed * 0.5;
        const initialAngle = rand(TAU);
        this.vx = cos(initialAngle) * initialSpeed;
        this.vy = sin(initialAngle) * initialSpeed;
        this.vz = 0;
        
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
        this.life = 0;
        this.angle = rand(TAU);
        this.radius = rand(50) + 20;
        this.targetRadius = this.radius;
        this.phase = rand(TAU);
        this.anchor = vec2(this.x, this.y);
        this.restLength = rand(100) + 50;
        this.pathIndex = 0;
        
        // Generate new random text if rendering as text
        if (this.renderAsText) {
            this.text = this.generateRandomText();
        }
    }

    // Generate random text string
    generateRandomText() {
        const characters = '0123456789';
        const length = randIn(1, 4); // Random length between 1-4 characters
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters[Math.floor(rand(characters.length))];
        }
        return result;
    }

    // Update particle physics and movement based on movement type
    update(simplex, tick) {
        this.life++;
        
        // Apply movement based on type
        switch (this.movementType) {
            case MovementType.NOISE:
                this.updateNoise(simplex, tick);
                break;
            case MovementType.LINEAR:
                this.updateLinear();
                break;
            case MovementType.CIRCULAR:
                this.updateCircular();
                break;
            case MovementType.WAVE:
                this.updateWave();
                break;
            case MovementType.GRAVITY:
                this.updateGravity();
                break;
            case MovementType.BROWNIAN:
                this.updateBrownian();
                break;
            case MovementType.SPRING:
                this.updateSpring();
                break;
            case MovementType.SPIRAL:
                this.updateSpiral();
                break;
            case MovementType.PENDULUM:
                this.updatePendulum();
                break;
            case MovementType.ATTRACTOR:
                this.updateAttractor();
                break;
            case MovementType.PULSE:
                this.updatePulse();
                break;
            case MovementType.MAGNETIC:
                this.updateMagnetic();
                break;
            case MovementType.TURBULENCE:
                this.updateTurbulence(simplex, tick);
                break;
            case MovementType.FRACTAL:
                this.updateFractal();
                break;
            case MovementType.CUSTOM_PATH:
                this.updateCustomPath();
                break;
        }
        
        // Apply physics
        this.applyPhysics();
        
        // Update visual properties
        this.updateVisuals();
    }

    // ============================================================================
    // MOVEMENT TYPE IMPLEMENTATIONS
    // ============================================================================

    updateNoise(simplex, tick) {
        const xOff = this.movementParams.xOff || 0.0005;
        const yOff = this.movementParams.yOff || 0.0015;
        const zOff = this.movementParams.zOff || 0.0005;
        const tOff = this.movementParams.tOff || 0.0015;
        
        this.noiseValue = simplex.noise4D(
            this.x * xOff,
            this.y * yOff,
            this.z * zOff,
            tick * tOff
        );
        
        this.theta = this.noiseValue * TAU;
        this.phi = (1 - this.noiseValue) * TAU;
        
        this.vx = lerp(this.vx, cos(this.theta) * cos(this.phi), 0.05);
        this.vy = lerp(this.vy, sin(this.phi), 0.05);
        this.vz = lerp(this.vz, sin(this.theta) * cos(this.phi), 0.1);
    }

    updateLinear() {
        const speed = this.movementParams.speed || 2;
        const direction = this.movementParams.direction || rand(TAU);
        
        this.vx = cos(direction) * speed;
        this.vy = sin(direction) * speed;
    }

    updateCircular() {
        const centerX = this.movementParams.centerX || 0;
        const centerY = this.movementParams.centerY || 0;
        const speed = this.movementParams.speed || 0.02;
        
        this.angle += speed;
        this.radius = lerp(this.radius, this.targetRadius, 0.01);
        
        this.x = centerX + cos(this.angle) * this.radius;
        this.y = centerY + sin(this.angle) * this.radius;
        
        this.vx = -sin(this.angle) * this.radius * speed;
        this.vy = cos(this.angle) * this.radius * speed;
    }

    updateWave() {
        const amplitude = this.movementParams.amplitude || 50;
        const frequency = this.movementParams.frequency || 0.01;
        const speed = this.movementParams.speed || 2;
        
        this.phase += frequency;
        this.x += speed;
        this.y = this.movementParams.centerY + amplitude * sin(this.phase);
        
        this.vx = speed;
        this.vy = amplitude * frequency * cos(this.phase);
    }

    updateGravity() {
        const attractors = this.movementParams.attractors || [{ x: 0, y: 0, strength: 1 }];
        
        this.ax = 0;
        this.ay = 0;
        
        attractors.forEach(attractor => {
            const force = gravity(vec2(this.x, this.y), vec2(attractor.x, attractor.y), attractor.strength);
            this.ax += force.x;
            this.ay += force.y;
        });
    }

    updateBrownian() {
        const strength = this.movementParams.strength || 0.5;
        
        this.ax += randRange(strength);
        this.ay += randRange(strength);
        
        // Limit acceleration
        this.ax = clamp(this.ax, -strength, strength);
        this.ay = clamp(this.ay, -strength, strength);
    }

    updateSpring() {
        const anchor = this.movementParams.anchor || this.anchor;
        const restLength = this.movementParams.restLength || this.restLength;
        const k = this.movementParams.k || this.springK;
        
        const force = spring(vec2(this.x, this.y), anchor, restLength, k);
        this.ax += force.x;
        this.ay += force.y;
    }

    updateSpiral() {
        const centerX = this.movementParams.centerX || 0;
        const centerY = this.movementParams.centerY || 0;
        const speed = this.movementParams.speed || 0.02;
        const expansion = this.movementParams.expansion || 0.1;
        
        this.angle += speed;
        this.radius += expansion;
        
        this.x = centerX + cos(this.angle) * this.radius;
        this.y = centerY + sin(this.angle) * this.radius;
        
        this.vx = -sin(this.angle) * this.radius * speed + cos(this.angle) * expansion;
        this.vy = cos(this.angle) * this.radius * speed + sin(this.angle) * expansion;
    }

    updatePendulum() {
        const anchor = this.movementParams.anchor || vec2(0, 0);
        const length = this.movementParams.length || 100;
        const gravity = this.movementParams.gravity || 0.01;
        const damping = this.movementParams.damping || 0.99;
        
        const dx = this.x - anchor.x;
        const dy = this.y - anchor.y;
        const angle = atan2(dy, dx);
        
        this.angularVelocity += -gravity * sin(angle) / length;
        this.angularVelocity *= damping;
        
        this.x = anchor.x + cos(angle + this.angularVelocity) * length;
        this.y = anchor.y + sin(angle + this.angularVelocity) * length;
        
        this.vx = -sin(angle + this.angularVelocity) * length * this.angularVelocity;
        this.vy = cos(angle + this.angularVelocity) * length * this.angularVelocity;
    }

    updateAttractor() {
        const attractors = this.movementParams.attractors || this.attractors;
        if (attractors.length === 0) return;
        
        this.ax = 0;
        this.ay = 0;
        
        attractors.forEach(attractor => {
            const force = gravity(vec2(this.x, this.y), vec2(attractor.x, attractor.y), attractor.strength || this.attractorStrength);
            this.ax += force.x;
            this.ay += force.y;
        });
    }

    updatePulse() {
        const centerX = this.movementParams.centerX || 0;
        const centerY = this.movementParams.centerY || 0;
        const speed = this.movementParams.speed || 2;
        const pulseRate = this.movementParams.pulseRate || 0.1;
        
        const angle = atan2(this.y - centerY, this.x - centerX);
        const distance = dist(this.x, this.y, centerX, centerY);
        const pulse = sin(this.life * pulseRate) * 50;
        
        this.x = centerX + cos(angle) * (distance + pulse);
        this.y = centerY + sin(angle) * (distance + pulse);
        
        this.vx = cos(angle) * speed;
        this.vy = sin(angle) * speed;
    }

    updateMagnetic() {
        const fieldLines = this.movementParams.fieldLines || 10;
        const fieldStrength = this.movementParams.fieldStrength || 1;
        
        const fieldX = sin(this.x * 0.01) * fieldStrength;
        const fieldY = cos(this.y * 0.01) * fieldStrength;
        
        this.ax += fieldX;
        this.ay += fieldY;
    }

    updateTurbulence(simplex, tick) {
        const scale = this.movementParams.scale || this.turbulenceScale;
        const strength = this.movementParams.strength || this.turbulenceStrength;
        
        const noiseX = simplex.noise3D(this.x * scale, this.y * scale, tick * 0.01);
        const noiseY = simplex.noise3D(this.x * scale + 100, this.y * scale + 100, tick * 0.01);
        
        this.ax += (noiseX - 0.5) * strength;
        this.ay += (noiseY - 0.5) * strength;
    }

    updateFractal() {
        const scale = this.movementParams.scale || this.fractalScale;
        const offset = this.movementParams.offset || this.fractalOffset;
        
        const fractalValue = mandelbrot(this.x * scale + offset, this.y * scale + offset);
        const angle = fractalValue * TAU;
        
        this.vx = cos(angle) * 0.5;
        this.vy = sin(angle) * 0.5;
    }

    updateCustomPath() {
        const pathPoints = this.movementParams.pathPoints || this.pathPoints;
        if (pathPoints.length === 0) return;
        
        const target = pathPoints[this.pathIndex];
        const distance = dist(this.x, this.y, target.x, target.y);
        
        if (distance < 10) {
            this.pathIndex = (this.pathIndex + 1) % pathPoints.length;
        }
        
        const angle = atan2(target.y - this.y, target.x - this.x);
        const speed = this.movementParams.speed || 2;
        
        this.vx = cos(angle) * speed;
        this.vy = sin(angle) * speed;
    }

    // ============================================================================
    // PHYSICS AND VISUAL UPDATES
    // ============================================================================

    applyPhysics() {
        // Apply acceleration
        this.vx += this.ax;
        this.vy += this.ay;
        this.vz += this.az;
        
        // Limit velocity
        const velocity = vecLimit(vec2(this.vx, this.vy), this.maxSpeed);
        this.vx = velocity.x;
        this.vy = velocity.y;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        
        // Reset acceleration
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
    }

    updateVisuals() {
        // Update size based on z position
        this.size = this.z * 0.1 + 1;
        
        // Update alpha based on life
        this.alpha = fadeInOut(this.life, this.ttl);
        
        // Update speed for visual effects
        this.speed = vecMag(vec2(this.vx, this.vy));
    }

    // Check if particle should be reset
    shouldReset(canvasWidth, canvasHeight) {
        return this.life > this.ttl || 
               this.x > canvasWidth + 100 || 
               this.x < -100 || 
               this.y > canvasHeight + 100 || 
               this.y < -100;
    }

    // Draw the particle
    draw(ctx) {
        ctx.save();
        
        // Apply rotation based on movement direction
        const rotation = atan2(this.vy, this.vx);
        ctx.translate(this.x, this.y);
        ctx.rotate(rotation);
        ctx.translate(-this.x, -this.y);
        
        // Set color based on movement type and properties
        const finalHue = this.hue + clamp(this.z, 0, 180);
        const saturation = clamp(this.z, 10, 100);
        const lightness = clamp(this.z, 20, 60);
        
        ctx.strokeStyle = `hsla(${finalHue},${saturation}%,${lightness}%,${this.alpha})`;
        ctx.fillStyle = `hsla(${finalHue},${saturation}%,${lightness}%,${this.alpha * 0.3})`;
        
        if (this.renderAsText) {
            // Draw text
            ctx.font = `${this.fontSize}px ${this.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `hsla(${finalHue},${saturation}%,${lightness}%,${this.alpha})`;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            // Draw particle based on movement type
            switch (this.movementType) {
                case MovementType.CIRCULAR:
                case MovementType.SPIRAL:
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, TAU);
                    ctx.fill();
                    break;
                case MovementType.WAVE:
                    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                    break;
                case MovementType.FRACTAL:
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, TAU);
                    ctx.fill();
                    break;
                default:
                    ctx.strokeRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                    break;
            }
        }
        
        ctx.restore();
    }

    // Get particle data for array storage (for backward compatibility)
    toArray() {
        return [
            this.x, this.y, this.z, 
            this.vx, this.vy, this.vz, 
            this.life, this.ttl, this.speed, 
            this.hue, this.size, this.alpha
        ];
    }

    // Set particle data from array (for backward compatibility)
    fromArray(data) {
        [
            this.x, this.y, this.z, 
            this.vx, this.vy, this.vz, 
            this.life, this.ttl, this.speed, 
            this.hue, this.size, this.alpha
        ] = data;
    }

    // Set movement type and parameters
    setMovementType(type, params = {}) {
        this.movementType = type;
        this.movementParams = { ...this.movementParams, ...params };
    }

    // Add attractor for gravity/attractor movement
    addAttractor(x, y, strength = 1) {
        this.attractors.push({ x, y, strength });
    }

    // Set custom path points
    setPath(points) {
        this.pathPoints = points;
        this.pathIndex = 0;
    }

    // Set text rendering properties
    setTextRendering(enabled, text = null, fontSize = null, fontFamily = null) {
        this.renderAsText = enabled;
        if (text !== null) this.text = text;
        if (fontSize !== null) this.fontSize = fontSize;
        if (fontFamily !== null) this.fontFamily = fontFamily;
        
        // Generate random text if enabled but no text provided
        if (enabled && !text) {
            this.text = this.generateRandomText();
        }
    }

    // Update text content
    setText(text) {
        this.text = text || this.generateRandomText();
    }

    // Set font properties
    setFont(fontSize, fontFamily) {
        this.fontSize = fontSize || this.fontSize;
        this.fontFamily = fontFamily || this.fontFamily;
    }
}

// ============================================================================
// TWIZZL'S PARTICLE SYSTEM CLASS
// ============================================================================

export class TwizzlsParticleSystem {
    constructor(count = 50, options = {}) {
        this.particles = [];
        this.count = count;
        this.simplex = null;
        this.tick = 0;
        this.center = [0, 0];
        this.backdropSize = 0;
        this.options = options;
    }

    // Initialize the particle system
    init(simplex, centerX, centerY, backdropSize) {
        this.simplex = simplex;
        this.center[0] = centerX;
        this.center[1] = centerY;
        this.backdropSize = backdropSize;
        this.tick = 0;

        // Create particles
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            const particle = new TwizzlsParticle(0, 0, 0, this.options);
            particle.init(centerX, centerY, backdropSize);
            this.particles.push(particle);
        }
    }

    // Update all particles
    update(canvasWidth = 800, canvasHeight = 600) {
        this.tick++;
        
        this.particles.forEach(particle => {
            particle.update(this.simplex, this.tick);
            
            // Reset particle if needed
            if (particle.shouldReset(canvasWidth, canvasHeight)) {
                particle.init(this.center[0], this.center[1], this.backdropSize);
            }
        });
    }

    // Draw all particles
    draw(ctx) {
        this.particles.forEach(particle => {
            particle.draw(ctx);
        });
    }

    // Reinitialize all particles (for resize events)
    reinitialize(centerX, centerY, backdropSize) {
        this.center[0] = centerX;
        this.center[1] = centerY;
        this.backdropSize = backdropSize;
        
        this.particles.forEach(particle => {
            particle.init(centerX, centerY, backdropSize);
        });
    }

    // Add a new particle
    addParticle() {
        const particle = new TwizzlsParticle(0, 0, 0, this.options);
        particle.init(this.center[0], this.center[1], this.backdropSize);
        this.particles.push(particle);
        this.count++;
    }

    // Remove a particle
    removeParticle() {
        if (this.particles.length > 0) {
            this.particles.pop();
            this.count--;
        }
    }

    // Get particle count
    getParticleCount() {
        return this.particles.length;
    }

    // Clear all particles
    clear() {
        this.particles = [];
        this.count = 0;
    }

    // Set movement type for all particles
    setMovementType(type, params = {}) {
        this.particles.forEach(particle => {
            particle.setMovementType(type, params);
        });
    }

    // Add attractor for all particles
    addAttractor(x, y, strength = 1) {
        this.particles.forEach(particle => {
            particle.addAttractor(x, y, strength);
        });
    }

    // Set custom path for all particles
    setPath(points) {
        this.particles.forEach(particle => {
            particle.setPath(points);
        });
    }

    // Set text rendering for all particles
    setTextRendering(enabled, text = null, fontSize = null, fontFamily = null) {
        this.particles.forEach(particle => {
            particle.setTextRendering(enabled, text, fontSize, fontFamily);
        });
    }

    // Set text content for all particles
    setText(text) {
        this.particles.forEach(particle => {
            particle.setText(text);
        });
    }

    // Set font properties for all particles
    setFont(fontSize, fontFamily) {
        this.particles.forEach(particle => {
            particle.setFont(fontSize, fontFamily);
        });
    }
} 