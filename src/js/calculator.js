/// <reference path="colors.js" />
/// <reference path="maths.js" />
/// <reference path="mouse.js" />
/// <reference path="sequences.js" />
/// <reference path="sequencer.js" />
/// <reference path="scanner.js" />
/// <reference path="index.js" />



const calculator = {
    container: document.getElementById('calculatorControl'),
    screen: document.querySelector('#calculatorControl .screen'),
    buttons: document.querySelectorAll('#calculatorControl button'),
    expression: null,
    disabled: false,
    initialize: () => {
        calculator.reset();

        calculator.buttons.forEach((element, i) => {
            element.addEventListener("click", calculator.onClick);
        });

        window.addEventListener("keydown", calculator.onKeyDown);
        window.addEventListener("paste", calculator.onPaste);
    },
    reset: () => {
        calculator.expression = {
            a: "0",
            op: "",
            b: ""
        };

        calculator.updateScreen();
    },
    show: () => {
        calculator.container.style.display = 'block';
    },
    hide: () => {
        calculator.container.style.display = 'none';
    },
    updateScreen: () => {
        let valueOfB = calculator.expression.b;
        if (calculator.expression.b.length > 12) {
            valueOfB = calculator.expression.b.substring(0, 11) + "...";
        }

        calculator.screen.textContent = `n${calculator.expression.op}${valueOfB}`;

        if (calculator.expression.a != keyControl.value) {
            app.updateKey(calculator.expression.a);
        }
    },
    ans: () => {
        const a = BigInt(calculator.expression.a);
        const b = BigInt(calculator.expression.b);
        let ans = 0n;

        if (calculator.expression.op == "/") {
            if (a != 0n && b != 0n) {
                ans = a / b;
            }
        }
        else if (calculator.expression.op == "*") {
            ans = a * b;
        }
        else if (calculator.expression.op == "-") {
            ans = a - b;
        }
        else if (calculator.expression.op == "+") {
            ans = a + b;
        }
        else if (calculator.expression.op == "^") {
            ans = a ** b;
        }

        return ans;
    },
    undo: () => {
        if (calculator.expression.b != "") {
            let b = calculator.expression.b.substring(0, calculator.expression.b.length - 1);
            if (b == "-") {
                b = "";
            }

            calculator.expression.b = b;
        }
        else if (calculator.expression.op != "") {
            calculator.expression.op = "";
        }
        else if (calculator.expression.a.length > 0) {
            let a = calculator.expression.a.substring(0, calculator.expression.a.length - 1);
            if (a == "-" || a.length == 0) {
                a = "0";
            }

            calculator.expression.a = a;
        }

        return calculator.updateScreen();
    },
    invert: () => {
        if (calculator.expression.b != "") {
            if (calculator.expression.b != "0") {
                if (calculator.expression.b.startsWith('-')) {
                    calculator.expression.b = calculator.expression.b.substring(1, calculator.expression.b.length);
                }
                else {
                    calculator.expression.b = "-" + calculator.expression.b;
                }
            }
        }
        else {
            if (calculator.expression.a != "0") {
                if (calculator.expression.a.startsWith('-')) {
                    calculator.expression.a = calculator.expression.a.substring(1, calculator.expression.a.length);
                }
                else {
                    calculator.expression.a = "-" + calculator.expression.a;
                }
            }
        }

        return calculator.updateScreen();
    },
    evaluate: () => {
        if (calculator.expression.b != "") {
            let ans = calculator.ans();

            calculator.expression.a = ans.toString();
        }

        return calculator.updateScreen();
    },
    sqrt: () => {
        let a = BigInt(calculator.expression.a);
        let ans = integerSqrt(a);

        calculator.expression.a = ans.toString();
        calculator.expression.op = "";
        calculator.expression.b = "";

        return calculator.updateScreen();
    },
    performAction: (key) => {
        console.log(`performAction: ${key}`);

        if (key == "Enter") {
            return calculator.evaluate();
        }
        else if (key == "Delete") {
            return app.reset();
        }
        else if (key == "Backspace") {
            return calculator.undo();
        }
        else if (key == "±") {
            return calculator.invert();
        }
        else if (key == "√") {
            return calculator.sqrt();
        }

        if (calculator.isDigit(key)) {
            if (calculator.expression.op != "") {
                if (calculator.expression.b == "0") {
                    calculator.expression.b = key;
                }
                else {
                    calculator.expression.b += key;
                }

                return calculator.updateScreen();
            }

            if (calculator.expression.a == "0") {
                calculator.expression.a = key;
            }
            else {
                calculator.expression.a += key;
            }

            return calculator.updateScreen();
        }
        else if (calculator.isOperation(key)) {
            calculator.expression.op = key;
            calculator.expression.b = "";

            return calculator.updateScreen();
        }
    },
    isDigit: (v) => {
        return (/^[0-9]$/).test(v);
    },
    isOperation: (v) => {
        return v == '/' || v == '*' || v == '-' || v == '+' || v == '^' || v == '±' || v == '√' || v == 'Enter' || v == 'Backspace' || v == 'Delete';
    },
    onClick: (e) => {
        if (calculator.disabled) {
            return;
        }

        const buttonElement = e.target;
        const key = buttonElement.getAttribute("data-val");

        return calculator.performAction(key);
    },
    onKeyDown: (e) => {
        if (calculator.disabled) {
            return;
        }

        if (!calculator.isDigit(e.key) && !calculator.isOperation(e.key)) {
            return;
        }

        if (e.target == levelControl || e.target == legControl || e.target == sizeControl || e.target == customOeisControl || e.target == customListControl) {
            return;
        }
        else {
            e.preventDefault();
        }

        const element = document.querySelector(`.calculator button[data-val='${e.key}']`);
        if (element != null) {
            element.classList.toggle("active");
            setTimeout(() => {
                element.classList.toggle("active");
            }, 60);

            return element.click();
        }

        return calculator.performAction(e.key);
    },
    onPaste: (e) => {
        if (e.target == customOeisControl || e.target == customListControl) {
            return;
        }

        e.preventDefault();

        if (calculator.disabled) {
            return;
        }

        let pasteData = (e.clipboardData || window.clipboardData).getData("text");

        if (pasteData.includes(",")) {
            pasteData = pasteData.replaceAll(",", "");
        }

        if (pasteData.includes(".")) {
            pasteData = pasteData.split(".")[0];
        }

        if ((/\d/).test(pasteData)) {
            try {
                const n = BigInt(pasteData);

                if (calculator.expression.op != "") {
                    calculator.expression.b = n.toString();
                }
                else {
                    calculator.expression.a = n.toString();
                }

                calculator.updateScreen();
            } catch (error) {
                console.log(`onPaste (error): `, error);
            }
        }
    }
};