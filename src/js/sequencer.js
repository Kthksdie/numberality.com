/// <reference path="colors.js" />
/// <reference path="maths.js" />
/// <reference path="mouse.js" />
/// <reference path="calculator.js" />
/// <reference path="sequences.js" />
/// <reference path="scanner.js" />
/// <reference path="index.js" />



const sequencer = {
    currentOption: null,
    options: {
        COLLATZ: "collatz",
        COLLATZSQRT: "collatz-Sqrt",
        PELL: "pell numbers",
        FIBONACCI: "fibonacci",
        A193651: "A193651",
        A037992: "A037992",
        TIMESECONDS: "time (seconds)",
        CUSTOMOEIS: "oeis.org a-number",
        CUSTOMLIST: "custom",
    },
    animationId: null,
    lastFrameTime: 0,
    frameRate: 10, // FPS - adjustable for different speeds
    frameInterval: 1000 / 10, // 10 FPS for smoother animation
    initialize: () => {
        sequencer.currentOption = sequencer.options.COLLATZ;
        sequencer.updateFrameInterval();

        Object.values(sequencer.options).forEach((choice, i) => {
            sequenceControl.add(new Option(choice, choice));
        });

        sequenceControl.value = sequencer.currentOption;
        sequenceControl.addEventListener("change", (e) => {
            sequencer.currentOption = sequenceControl.value;
            sequencer.reset();

            customOeisControl.style.display = 'none';
            customListControl.style.display = 'none';

            if (sequencer.currentOption == sequencer.options.CUSTOMOEIS) {
                customOeisControl.style.display = 'block';
                if (oeisHelpText) {
                    oeisHelpText.style.display = 'block';
                }
            }
            else if (sequencer.currentOption == sequencer.options.CUSTOMLIST) {
                customListControl.style.display = 'block';
            }
            
            // Hide OEIS link and help text when switching away from custom OEIS
            if (sequencer.currentOption != sequencer.options.CUSTOMOEIS) {
                if (oeisLinkElement) {
                    oeisLinkElement.style.display = 'none';
                }
                if (oeisHelpText) {
                    oeisHelpText.style.display = 'none';
                }
            }
        });

        nextButtonControl.addEventListener("click", (e) => {
            sequencer.step();
        });

        playButtonControl.addEventListener("click", (e) => {
            if (sequencer.isPlaying()) {
                sequencer.stop();
            }
            else {
                sequencer.play();
            }
        });

        // Add event listeners for custom OEIS input
        customOeisControl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (sequencer.currentOption == sequencer.options.CUSTOMOEIS) {
                    customOeis.reset();
                    sequencer.step();
                }
            }
        });

        customOeisControl.addEventListener("input", (e) => {
            // Reset the sequence when user types a new A-number
            if (sequencer.currentOption == sequencer.options.CUSTOMOEIS) {
                customOeis.reset();
            }
        });
    },
    updateFrameInterval: () => {
        sequencer.frameInterval = 1000 / sequencer.frameRate;
    },
    setFrameRate: (fps) => {
        sequencer.frameRate = Math.max(1, Math.min(60, fps)); // Clamp between 1-60 FPS
        sequencer.updateFrameInterval();
        
        // Update frame rate indicator if currently playing
        if (sequencer.isPlaying()) {
            document.getElementById('frameRateIndicator').textContent = `${sequencer.frameRate}fps`;
        }
    },
    getFrameRate: () => {
        return sequencer.frameRate;
    },
    reset: () => {
        sequencer.stop();

        collatzConjecture.reset();
        collatzConjectureSqrt.reset();
        pell.reset();
        fib.reset();
        a193651.reset();
        a037992.reset();
        timeSeconds.reset();
        customList.reset();
        customOeis.reset();

        playButtonControl.textContent = `play`;
        nextButtonControl.textContent = `next`;
        iterationElement.textContent = `|`;
    },
    updateIteration: (i) => {
        iterationElement.textContent = `| i${(i)} |`;
    },
    step: () => {
        if (sequencer.currentOption == sequencer.options.COLLATZ) {
            collatzConjecture.next();
        }
        else if (sequencer.currentOption == sequencer.options.COLLATZSQRT) {
            collatzConjectureSqrt.next();
        }
        else if (sequencer.currentOption == sequencer.options.PELL) {
            pell.next();
        }
        else if (sequencer.currentOption == sequencer.options.FIBONACCI) {
            fib.next();
        }
        else if (sequencer.currentOption == sequencer.options.A193651) {
            a193651.next();
        }
        else if (sequencer.currentOption == sequencer.options.A037992) {
            a037992.next();
        }
        else if (sequencer.currentOption == sequencer.options.TIMESECONDS) {
            timeSeconds.next();
        }
        else if (sequencer.currentOption == sequencer.options.CUSTOMLIST) {
            customList.next();
        }
        else if (sequencer.currentOption == sequencer.options.CUSTOMOEIS) {
            if (customOeis.isLoading) {
                iterationElement.textContent = `| Loading OEIS sequence... |`;
                return;
            }
            customOeis.next();
        }
    },
    animate: (currentTime) => {
        // Double-check if we should still be playing
        if (!sequencer.isPlaying()) {
            return;
        }

        // Frame rate control
        if (currentTime - sequencer.lastFrameTime >= sequencer.frameInterval) {
            sequencer.step();
            // Trigger a single render for this step
            app.draw();
            sequencer.lastFrameTime = currentTime;
        }

        // Only continue animation loop if still playing
        if (sequencer.isPlaying()) {
            sequencer.animationId = requestAnimationFrame(sequencer.animate);
        }
    },
    play: () => {
        app.disabled(true);

        playButtonControl.textContent = "pause";
        const frameRateIndicator = document.getElementById('frameRateIndicator');
        frameRateIndicator.textContent = `${sequencer.frameRate}fps`;
        frameRateIndicator.style.display = 'inline-block';
        sequencer.lastFrameTime = performance.now();
        sequencer.animationId = requestAnimationFrame(sequencer.animate);
    },
    stop: () => {
        if (sequencer.isPlaying()) {
            cancelAnimationFrame(sequencer.animationId);

            sequencer.animationId = null;

            playButtonControl.textContent = "play";
            document.getElementById('frameRateIndicator').style.display = 'none';

            app.disabled(false);
            return true;
        }
        else {
            return false;
        }
    },
    isPlaying: () => {
        return sequencer.animationId != null;
    },
};