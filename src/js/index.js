/// <reference path="colors.js" />
/// <reference path="maths.js" />
/// <reference path="mouse.js" />
/// <reference path="calculator.js" />
/// <reference path="sequences.js" />
/// <reference path="sequencer.js" />
/// <reference path="scanner.js" />
/// <reference path="random.js" />
/// <reference path="NumberBlock.js" />

const primaryControlsElement = document.getElementById("primaryControls");


const styleControl = document.getElementById("styles");
const sizeControl = document.getElementById("size");
const keyControl = document.getElementById("key");
const levelControl = document.getElementById("level");
const legControl = document.getElementById("leg");

const sequenceControl = document.getElementById("sequences");
const playButtonControl = document.getElementById("playButton");
const nextButtonControl = document.getElementById("nextButton");

const iterationElement = document.getElementById("iteration");
const customOeisControl = document.getElementById("customOeis");
const customListControl = document.getElementById("customList");
const oeisLinkElement = document.getElementById("oeisLink");
const oeisHelpText = customOeisControl.nextElementSibling;

const scanButtonControl = document.getElementById("scanButton");
const testButtonControl = document.getElementById("testButton");

const app = {
    blockRadius: 7,
    blockDiameter: null,
    squareSize: null,
    squareHalf: null,
    style: null,
    styles: {
        DIGITS: 'digits',
        CIRCLES: 'circles',
        SQUARES: 'squares',
    },
    font: {
        family: '"Ubuntu Mono", monospace',
        size: null,
    },
    canvas: null,
    ctx: null,
    screenWidth: null, screenHeight: null,
    centerPoint: null,
    maxDivisors: null, maxNumbers: null,
    gradBackground: null,
    reset: () => {
        app.updateLeg(0);
        app.updateKeyAndLevel(0n, 1n);

        calculator.reset();
        sequencer.reset();
        scanner.reset();
        roots.reset();
    },
    initialize: () => {
        app.style = app.styles.DIGITS;

        app.blockDiameter = 2 * app.blockRadius;
        app.squareSize = app.blockDiameter - 0.5;
        app.squareHalf = app.squareSize / 2;

        app.font.size = app.blockDiameter;

        app.canvas = document.getElementById('primaryCanvas');
        app.ctx = app.canvas.getContext('2d');

        // Style
        Object.values(app.styles).forEach((choice, i) => {
            styleControl.add(new Option(choice, choice));
        });

        styleControl.value = app.style;
        styleControl.addEventListener("change", (e) => {
            app.style = styleControl.value;

            app.resize();
        });

        // Size
        sizeControl.value = app.blockRadius;
        sizeControl.addEventListener("input", (e) => {
            app.blockRadius = parseInt(sizeControl.value);

            app.resize();
        });

        // Key | n
        keyControl.addEventListener("input", (e) => {
            if (keyControl.value == "") {
                keyControl.value = "0";
            }

            let n = BigInt(keyControl.value);

            app.updateKey(n);
        });

        // Level
        levelControl.addEventListener("input", (e) => {
            if (levelControl.value == "") {
                levelControl.value = "0";
            }

            let level = BigInt(levelControl.value);

            app.updateLevel(level);
        });

        // Leg
        legControl.addEventListener("input", (e) => {
            if (legControl.value == "") {
                legControl.value = "0";
            }

            let leg = parseFloat(legControl.value);

            app.updateLeg(leg);
        });

        // Test | ADHD
        if (testButtonControl) {
            testButtonControl.addEventListener("click", (e) => {
                roots.next();

                //app.updateKey(ans);
            });
        }



        // Global
        window.addEventListener("keydown", (e) => {
            if (sequencer.isPlaying()) {
                // Animation speed control when playing
                const key = e.key.toLocaleLowerCase();
                if (key === 'arrowup') {
                    e.preventDefault();
                    sequencer.setFrameRate(sequencer.getFrameRate() + 2);
                    return;
                }
                if (key === 'arrowdown') {
                    e.preventDefault();
                    sequencer.setFrameRate(sequencer.getFrameRate() - 2);
                    return;
                }
                return;
            }

            if (e.target == customOeisControl || e.target == customListControl) {
                return;
            }

            const key = e.key.toLocaleLowerCase();

            const keyStep = { a: -1n, d: 1n };
            if (keyStep[key]) {
                let n = BigInt(keyControl.value) + keyStep[key];

                app.updateKey(n);
            }

            const levelStep = { w: -1n, s: 1n };
            if (levelStep[key]) {
                let level = BigInt(levelControl.value) + levelStep[key];

                app.updateLevel(level);
            }
        });

        window.addEventListener('resize', app.resize, false);

        mouse.initialize();
        scanner.initialize();
        calculator.initialize();
        sequencer.initialize();

        app.resize();


    },
    disabled: (disabled) => {
        if (disabled) {


            calculator.hide();
        }
        else {
            calculator.show();
        }

        mouse.disabled = disabled;
        calculator.disabled = disabled;

        sequenceControl.disabled = disabled;
        nextButtonControl.disabled = disabled;
        customOeisControl.disabled = disabled;
        customListControl.disabled = disabled;

        scanButtonControl.disabled = disabled;

        if (testButtonControl) {
            testButtonControl.disabled = disabled;
        }

        styleControl.disabled = disabled;
        levelControl.disabled = disabled;
        legControl.disabled = disabled;
        sizeControl.disabled = disabled;
    },
    resize: () => {
        app.blockDiameter = 2 * app.blockRadius;
        app.squareSize = app.blockDiameter - 0.5;
        app.squareHalf = app.squareSize / 2;

        app.font.size = app.blockDiameter;

        app.screenWidth = app.canvas.width = window.innerWidth;
        app.screenHeight = app.canvas.height = window.innerHeight;

        const primaryControlsRect = primaryControlsElement.getBoundingClientRect();
        const primaryControlsOffset = (primaryControlsRect.height + primaryControlsRect.top);

        app.centerPoint = {
            x: app.canvas.width * 0.5,
            y: primaryControlsOffset + (app.blockDiameter * 3)
        };

        app.gradBackground = app.ctx.createRadialGradient(app.centerPoint.x, app.centerPoint.y, 0, app.centerPoint.x, app.centerPoint.y, Math.sqrt(app.centerPoint.x * app.centerPoint.x + app.centerPoint.y * app.centerPoint.y));
        app.gradBackground.addColorStop(0, colors.background.inner);
        app.gradBackground.addColorStop(1, colors.background.outer);

        app.maxNumbers = BigInt(parseInt((app.screenWidth - app.centerPoint.x) / app.blockDiameter));
        app.maxDivisors = BigInt(parseInt((app.screenHeight - app.centerPoint.y) / app.blockDiameter));

        app.ctx.imageSmoothingEnabled = false;
        app.ctx.imageSmoothingQuality = "low";

        app.applyFont();
        app.render();
    },
    generateBlocks: function* () {
        const n = BigInt(keyControl.value);
        const level = BigInt(levelControl.value);
        const maxDepth = app.maxDivisors + level;

        const keyPoint = {
            x: app.centerPoint.x,
            y: app.centerPoint.y
        };

        let keyPointMinus, keyPointPlus, remainder, stepSize, stepOffset;
        for (let divisor = level; divisor < maxDepth; divisor++) {
            remainder = n % divisor;

            stepOffset = parseInt(remainder) * app.blockDiameter;
            stepSize = parseInt(divisor) * app.blockDiameter;

            keyPointMinus = new NumberBlock(
                n - remainder,
                divisor,
                keyPoint.x - stepOffset,
                keyPoint.y,
                remainder == 0n,
                0
            );

            while (keyPointMinus.x > 0) {
                yield keyPointMinus;

                if (divisor > 1n) {
                    let midPoint = keyPointMinus.clone();
                    midPoint.middle = true;
                    midPoint.x -= stepSize / 2;

                    yield midPoint;

                    let midPoint2 = keyPointMinus.clone();
                    midPoint2.middle = true;
                    midPoint2.x += stepSize / 2;

                    yield midPoint2;
                }

                keyPointMinus.n -= divisor;
                keyPointMinus.x -= stepSize;
                keyPointMinus.step -= 1;
            }

            keyPointPlus = new NumberBlock(
                (n - remainder) + divisor,
                divisor,
                (keyPoint.x - stepOffset) + stepSize,
                keyPoint.y,
                remainder == 0n,
                1
            );

            while (keyPointPlus.x < app.screenWidth) {
                yield keyPointPlus;

                if (divisor > 1n) {
                    let midPoint = keyPointPlus.clone();
                    midPoint.middle = true;
                    midPoint.x += stepSize / 2;

                    yield midPoint;
                }

                keyPointPlus.n += divisor;
                keyPointPlus.x += stepSize;
                keyPointPlus.step += 1;
            }

            keyPoint.y += app.blockDiameter;
        }
    },
    draw: () => {
        app.applyBackground();

        const n = BigInt(keyControl.value);
        const leg = parseInt(legControl.value);

        const titleY = (app.centerPoint.y - app.blockDiameter) - app.blockRadius;

        for (const currentPoint of app.generateBlocks()) {
            app.ctx.strokeStyle = colors.lightGrey;
            app.ctx.fillStyle = colors.lightGrey;

            if (currentPoint.n == n && !currentPoint.middle) {
                app.ctx.fillStyle = colors.blue;
            }

            if (currentPoint.d == 1n) {
                if (isLikelyPrime(currentPoint.n)) {
                    app.drawText(currentPoint.n, currentPoint.x, titleY);

                    app.ctx.fillStyle = colors.yellow;
                }
                else if (isPowerofTwo(currentPoint.n)) {
                    app.drawText(currentPoint.n, currentPoint.x, titleY);

                    app.ctx.fillStyle = colors.red;
                }
            }

            if (currentPoint.step == 0 || currentPoint.step == leg || currentPoint.step == (leg * -1)) {
                if (currentPoint.divisorOfKey && !currentPoint.middle) {
                    app.ctx.fillStyle = colors.blue;
                }
            }

            if (currentPoint.middle) {
                app.drawPointCircle(currentPoint);
            }
            else if (app.style == app.styles.DIGITS) {
                if (currentPoint.n == 0n) {
                    app.drawText("0", currentPoint.x, currentPoint.y);
                }
                else {
                    app.drawText(currentPoint.d, currentPoint.x, currentPoint.y);
                }
            }
            else if (app.style == app.styles.CIRCLES) {
                app.drawCircle(currentPoint);
            }
            else if (app.style == app.styles.SQUARES) {
                app.drawSquare(currentPoint);
            }
        }

        app.drawDivisorLegs();
    },
    drawText: (value, x, y, color) => {
        const currentColor = app.ctx.fillStyle;

        if (color) {
            app.ctx.fillStyle = color;
        }

        app.ctx.fillText(value.toString(), x, y);

        if (color) {
            app.ctx.fillStyle = currentColor;
        }
    },
    drawCircle: (point) => {
        app.ctx.beginPath();
        app.ctx.arc(point.x, point.y, app.blockRadius, 0, twoPi, false);
        app.ctx.fill();
        app.ctx.closePath();
    },
    drawPointCircle: (point) => {
        app.ctx.beginPath();
        app.ctx.arc(point.x, point.y, 0.5, 0, twoPi, false);
        app.ctx.fill();
        app.ctx.closePath();
    },
    drawSquare: (point) => {
        app.ctx.fillRect(point.x - app.squareHalf, point.y - app.squareHalf, app.squareSize, app.squareSize);
    },
    drawLine: (a, b) => {
        app.ctx.beginPath();
        app.ctx.moveTo(a.x, a.y);
        app.ctx.lineTo(b.x, b.y);
        app.ctx.stroke();
    },
    drawDivisorLegs: () => {
        const level = parseFloat(levelControl.value);
        if (level > 1) {
            return;
        }

        const divisorLeg = parseFloat(legControl.value);
        if (divisorLeg == 0) {
            return;
        }

        const divisorsMax = parseFloat(app.maxDivisors);
        const xOffset = (divisorsMax * app.blockDiameter) * divisorLeg;
        const yOffset = (divisorsMax - 1) * app.blockDiameter;

        let negStart = {
            x: app.centerPoint.x - (app.blockDiameter * divisorLeg),
            y: app.centerPoint.y
        };

        let negFinish = {
            x: app.centerPoint.x - xOffset,
            y: app.centerPoint.y + yOffset
        };

        app.drawLine(negStart, negFinish);

        let posStart = {
            x: app.centerPoint.x + (app.blockDiameter * divisorLeg),
            y: app.centerPoint.y
        };

        let posFinish = {
            x: app.centerPoint.x + xOffset,
            y: app.centerPoint.y + yOffset
        };

        app.drawLine(posStart, posFinish);
    },
    render: () => {
        // Only start animation loop if not already playing and not in sequencer mode
        if (!sequencer.isPlaying()) {
            // Just draw once without starting a continuous loop
            app.draw();
        }
    },
    applyFont: () => {
        app.ctx.font = `normal ${app.font.size}px ${app.font.family}`;
        app.ctx.textAlign = "center";
        app.ctx.textBaseline = "middle";
    },
    applyBackground: () => {
        app.ctx.clearRect(0, 0, app.screenWidth, app.screenHeight);

        app.ctx.fillStyle = app.gradBackground;
        app.ctx.fillRect(0, 0, app.screenWidth, app.screenHeight);
    },
    updateKey: (n) => {
        keyControl.value = n;

        if (calculator.expression.a != keyControl.value) {
            calculator.expression.a = keyControl.value;
        }

        app.render();
    },
    updateLevel: (level) => {
        if (level < 1n) {
            level = 1n;
        }

        levelControl.value = level;

        app.render();
    },
    updateKeyAndLevel: (key, level) => {
        keyControl.value = key;

        if (calculator.expression.a != keyControl.value) {
            calculator.expression.a = keyControl.value;
        }

        if (level < 1n) {
            level = 1n;
        }

        levelControl.value = level;

        app.render();
    },
    updateLeg: (leg) => {
        if (leg < 0) {
            leg = 0;
        }

        legControl.value = leg;

        app.render();
    },
    follow: (key, level) => {
        let maxLevel = BigInt(app.maxDivisors) / 2n;
        if (level > maxLevel) {
            let currentLevel = level - maxLevel;

            app.updateKeyAndLevel(key, currentLevel);
        }
        else {
            app.updateKey(key);
        }
    },

};