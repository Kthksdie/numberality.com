class NumberBlock {
    constructor(n, d, x, y, divisorOfKey, step, middle = false) {
        this.n = BigInt(n);
        this.d = BigInt(d);
        this.x = x;
        this.y = y;
        this.divisorOfKey = divisorOfKey;
        this.step = step;
        this.middle = middle;
    }

    clone() {
        return new NumberBlock(
            this.n,
            this.d,
            this.x,
            this.y,
            this.divisorOfKey,
            this.step,
            this.middle
        );
    }
}
