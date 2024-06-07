import p5 from "p5";

const createClamp = (top: number, bottom: number) => {
    return (x: number) => {
        if (x >= top) {
            return top
        }
        if (x <= bottom) return bottom
        return x
    }
}

export class RandomWalker {

    pos: number
    options
    s: p5
    prevFrameCount
    clamper


    constructor(start: number, context: p5, {clamp, top, bottom}: { clamp: boolean, top: number, bottom: number }) {

        this.pos = start
        this.options = [1, -1]
        this.s = context
        this.prevFrameCount = 0
        if (clamp) {
            this.clamper = createClamp(top, bottom)
        }
    }

    process() {
        this.pos += this.s.random(this.options)
        if (this.clamper) this.pos = this.clamper(this.pos)
        this.prevFrameCount = this.s.frameCount
    }
}
