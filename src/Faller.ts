import p5 from "p5";
import {DEBUG, GRAVITY} from "./sharedConstants.ts";

export class Faller{

    s: p5
    position: p5.Vector
    fill: p5.Color

    constructor(context: p5) {
        this.s = context;
        this.position = this.s.createVector(this.s.random(0, this.s.width - 40), -10)
        if(DEBUG) this.position = this.s.createVector(300, 300)
        this.fill = this.s.color(0, 0, 0)
    }

    process() {
        this.fall()
    }


    fall() {
        this.position.add(0, GRAVITY)
    }

    draw() {
        this.s.fill(this.fill)
        this.s.rect(this.position.x, this.position.y, 40, 40)
    }

    intersects(x: number, y: number) {
        return (
            x >= this.position.x && x <= this.position.x + 40 &&
            y >= this.position.y && y <= this.position.y + 40
        )
    }
}