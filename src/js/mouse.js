/// <reference path="colors.js" />
/// <reference path="maths.js" />
/// <reference path="calculator.js" />
/// <reference path="sequences.js" />
/// <reference path="sequencer.js" />
/// <reference path="scanner.js" />
/// <reference path="index.js" />



const mouse = {
    position: {
        x: 0,
        y: 0
    },
    dragPosition: null,
    isDown: false,
    isMoving: false,
    selected: {
        a: null,
        b: null
    },
    disabled: false,
    initialize: () => {
        app.canvas.addEventListener('mousemove', mouse.onMove, false);
        app.canvas.addEventListener("mousedown", mouse.onDown, false);
        app.canvas.addEventListener("mouseup", mouse.onUp, false);
        app.canvas.addEventListener("mouseleave", mouse.onLeave, false);
        window.addEventListener("wheel", mouse.onScroll, false);
    },
    onScroll: (e) => {
        if (mouse.disabled) {
            return;
        }

        let n = BigInt(keyControl.value);
        if (e.deltaY > 0) {
            n--;
        }
        else {
            n++;
        }

        app.updateKey(n);
    },
    onMove: (e) => {
        if (mouse.disabled) {
            return;
        }

        const rect = app.canvas.getBoundingClientRect();

        mouse.position.x = (e.clientX - rect.left) / (rect.right - rect.left) * app.canvas.width;
        mouse.position.y = (e.clientY - rect.top) / (rect.bottom - rect.top) * app.canvas.height;

        if (mouse.isDown) {
            const dist = getDistance(mouse.position, mouse.dragPosition);

            if (dist >= app.blockDiameter) {
                mouse.isMoving = true;
                mouse.updateDragPosition();

                let n = BigInt(keyControl.value);
                let level = BigInt(levelControl.value);

                if (e.movementX > 0) {
                    n--;
                }
                else if (e.movementX < 0) {
                    n++;
                }

                if (e.movementY > 0) {
                    level--;

                    if (level < 1n) {
                        level = 1n;
                    }
                }
                else if (e.movementY < 0) {
                    level++;
                }

                app.updateKeyAndLevel(n, level);
            }
            else {
                mouse.isMoving = false;
            }
        }
    },
    onDown: (e) => {
        if (mouse.disabled) {
            return;
        }

        mouse.updateDragPosition();

        mouse.isDown = true;
    },
    onUp: (e) => {
        if (mouse.disabled) {
            return;
        }

        mouse.isDown = false;
    },
    onLeave: (e) => {
        if (mouse.disabled) {
            return;
        }

        mouse.isDown = false;
    },
    updateDragPosition: () => {
        mouse.dragPosition = {
            x: mouse.position.x,
            y: mouse.position.y
        };
    }
};