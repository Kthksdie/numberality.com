/// <reference path="colors.js" />
/// <reference path="maths.js" />
/// <reference path="mouse.js" />
/// <reference path="calculator.js" />
/// <reference path="sequences.js" />
/// <reference path="sequencer.js" />
/// <reference path="index.js" />



const scanner = {
    fps: 60,
    finished: false,
    intervalId: null,
    initialize: () => {
        scanButtonControl.addEventListener("click", (e) => {
            if (scanner.isScanning()) {
                scanner.stop();
            }
            else {
                scanner.next();
            }
        });
    },
    reset: () => {
        scanner.stop();
        scanButtonControl.textContent = `scan`;
        scanner.finished = false;
    },
    next: () => {
        if (scanner.finished) {
            scanner.reset();
            return app.updateLevel(1n);
        }

        let level = BigInt(levelControl.value);
        let n = BigInt(keyControl.value);

        if (level == 1n || level >= n) {
            level = 1n;
        }

        scanButtonControl.textContent = `stop`;
        scanner.intervalId = setInterval(() => {
            n = BigInt(keyControl.value);
            if (n < 0n) {
                n *= -1n;
            }

            level++;

            app.updateLevel(level);

            if (level >= n) {
                scanner.finished = true;
            }

            if (level >= n || n % level == 0n) {
                scanner.stop();
            }

        }, 1000 / scanner.fps);
    },
    stop: () => {
        if (scanner.isScanning()) {
            clearInterval(scanner.intervalId);

            scanner.intervalId = null;

            if (scanner.finished) {
                scanButtonControl.textContent = "reset";
            }
            else {
                scanButtonControl.textContent = "scan";
            }

            return true;
        }
        else {
            return false;
        }
    },
    isScanning: () => {
        return scanner.intervalId != null;
    },
};