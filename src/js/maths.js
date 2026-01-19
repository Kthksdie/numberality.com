/// <reference path="colors.js" />
/// <reference path="mouse.js" />
/// <reference path="calculator.js" />
/// <reference path="sequences.js" />
/// <reference path="sequencer.js" />
/// <reference path="scanner.js" />
/// <reference path="index.js" />

// Constants
const twoPi = 2 * Math.PI;

/**
 * Check if a bigint is prime
 * @param {bigint} n - bigint
 * @returns {boolean} - result
 */
function isPrime(n) {
    n = BigInt(n);

    if (n < 0n) {
        return -isPrime(-n);
    }

    if (n == NaN || n <= 0n) {
        return false;
    }
    else if (n <= 10n) {
        if (n == 2n || n == 3n || n == 5n || n == 7n) {
            return true;
        }
        else {
            return false;
        }
    }

    const boundary = integerSqrt(n);
    for (let i = 11n; i <= boundary; i++) {
        if (n % i == 0n) {
            return false;
        }
    }

    return true;
}

/**
 * Check if a bigint is likely prime using Euler Test (base 3)
 * @param {bigint} n - bigint
 * @returns {boolean} - result
 */
function isLikelyPrime(n) {
    n = BigInt(n);

    // Handle negative numbers with branchless approach
    const sign = (n < 0n) ? -1n : 1n;
    const absN = sign * n;
    
    // Early return for negative numbers
    if (sign < 0n) {
        return isLikelyPrime(absN);
    }

    // Branchless even number check (except 2)
    const isEven = (absN > 2n) & (absN % 2n == 0n);
    if (isEven) {
        return false;
    }

    // Branchless small number check using lookup
    const smallPrimes = [false, false, true, true, false, true]; // 0,1,2,3,4,5
    if (absN <= 5n) {
        return smallPrimes[Number(absN)];
    }

    const d = (absN - 1n) >> 1n;
    const x = modPow(3n, d, absN);

    // Branchless result check using bitwise operations
    const isResultValid = (x == (absN - 1n)) | (x == 1n);
    return isResultValid;
}

/**
 * Check if a number is a power of two
 * @param {bigint} n - number
 * @returns {boolean} - result
 */
function isPowerofTwo(n) {
    n = BigInt(n);

    if (n < 0n) {
        return -isPowerofTwo(-n);
    }

    return (n != 0n) && ((n & (n - 1n)) == 0n);
}

/**
 * Integer square root
 * @param {bigint} n - number
 * @param {bigint} k - exponent
 * @returns {bigint} - result
 */
function integerSqrt(n, k = 2n) {
    if (n < 0n) {
        return -integerSqrt(-n, k);
    }

    if (n == 0n) {
        return 0n;
    }

    if (n == 1n) {
        return 1n;
    }

    let o = 0n;
    let x = n;
    let limit = 100;

    while (x ** k !== n && x !== o && --limit) {
        o = x;
        x = ((k - 1n) * x + n / x ** (k - 1n)) / k;
    }

    return x;
}

/**
 * Modular exponentiation
 * @param {bigint} n - base
 * @param {bigint} exponent - exponent
 * @param {bigint} modulus - modulus
 * @returns {bigint} - result
 */
function modPow(n, exponent, modulus) {
    if (modulus == 1n) {
        return 0n;
    }

    var curPow = n % modulus;
    var result = 1n;
    while (exponent > 0n) {
        if (exponent % 2n == 1n) {
            result = (result * curPow) % modulus;
        }

        exponent = exponent / 2n;
        curPow = (curPow * curPow) % modulus;
    }

    return result;
}

/**
 * Get divisors of a number
 * @param {bigint} n - number
 * @returns {bigint[]} - divisors
 */
function getDivisors(n) {
    if (n < 0n) {
        return -getDivisors(-n);
    }
    
    let divisors = [];
    divisors.push(1n);

    if (n <= 3n) {
        return divisors;
    }

    const boundary = integerSqrt(n);
    for (let d = 2n; d <= boundary; d++) {
        if (n % d == 0) {
            divisors.push(d);

            let high = n / d;
            if (high > boundary) {
                divisors.push(high);
            }
        }
    }

    divisors.sort((a, b) => { return parseInt(a - b); });

    return divisors;
}

/**
 * Rotate a point around an axis
 * @param {object} point - point to rotate
 * @param {string} axis - axis to rotate around
 * @param {number} angle - angle to rotate
 * @returns {object} - rotated point
 */
function rotatePoint(point, axis, angle) {
    if (angle == 0) {
        return point;
    }

    // Input coordinates
    let x = point.x;
    let y = point.y;
    let z = 0;

    // Convert angle to radians
    let rad = angle * Math.PI / 180;

    // Initialize rotation matrix
    let matrix;

    // Choose rotation matrix based on axis of rotation
    if (axis === 'x') {
        matrix = [
            [1, 0, 0],
            [0, Math.cos(rad), -Math.sin(rad)],
            [0, Math.sin(rad), Math.cos(rad)]
        ];
    } else if (axis === 'y') {
        matrix = [
            [Math.cos(rad), 0, Math.sin(rad)],
            [0, 1, 0],
            [-Math.sin(rad), 0, Math.cos(rad)]
        ];
    } else if (axis === 'z') {
        matrix = [
            [Math.cos(rad), -Math.sin(rad), 0],
            [Math.sin(rad), Math.cos(rad), 0],
            [0, 0, 1]
        ];
    }

    // Subtract center point
    x -= centerPoint.x;
    y -= centerPoint.y;
    z -= 0;

    // Apply rotation matrix
    let newX = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
    let newY = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
    let newZ = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;

    // Add center point back
    newX += centerPoint.x;
    newY += centerPoint.y;
    newZ += 0;

    // Output rotated coordinates
    point.x = newX;
    point.y = newY;
    point.z = newZ;

    return point;
}

/**
 * Get the middle point between two points
 * @param {object} a - first point
 * @param {object} b - second point
 * @returns {object} - middle point
 */
function getMiddlePoint(a, b) {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
    };
}

/**
 * Get the distance between two points
 * @param {object} a - first point
 * @param {object} b - second point
 * @returns {number} - distance
 */
function getDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Copy a point
 * @param {object} point - point to copy
 * @returns {object} - copied point
 */
function copyPoint(point) {
    return {
        n: point.n,
        d: point.d,
        x: point.x,
        y: point.y,
        divisorOfKey: point.divisorOfKey,
        step: point.step
    };
}