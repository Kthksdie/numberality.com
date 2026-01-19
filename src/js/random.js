/// <reference path="colors.js" />
/// <reference path="maths.js" />
/// <reference path="mouse.js" />
/// <reference path="calculator.js" />
/// <reference path="sequences.js" />
/// <reference path="sequencer.js" />
/// <reference path="scanner.js" />
/// <reference path="index.js" />

// playing around

const rng = {
    i: 2n,
    min: 0n,
    max: 0n,
    direction: true,
    init: (min, max) => {
        rng.min = min;
        rng.max = max;
    },
    reset: () => {
        rng.i = 1n;
        rng.min = 0n;
        rng.max = 0n;
    },
    getS: (x) => {
        let s = 1n;

        if (x % 2n != 0n) {
            x -= 1n;
        }

        while (x % 2n == 0n) {
            x /= 2n;
            s++;
        }

        return s;
    },
    next: () => {
        let x = BigInt(Date.now());
        let s = rng.getS(x);

        x *= s;

        if (!rng.direction) {
            x += x / 2n;
        }

        let r = 0n;

        if (rng.max > x) {
            r = rng.max % x;
        }
        else {
            r = x % rng.max;
        }

        rng.i += 1n;
        rng.direction = !rng.direction;
        return r;
    }
};