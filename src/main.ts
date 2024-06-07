import './style.css'
import p5 from 'p5'
import {segmentsIntersect, hasSelfIntersections} from "./intersection.ts";

const GRAVITY = 0

const createClamp = (top: number, bottom: number) => {
    return (x: number) => {
        if (x >= top) {
            return top
        }
        if (x <= bottom) return bottom
        return x
    }
}


class Faller {
    constructor(context: p5) {
        this.s = context;
        this.position = this.s.createVector(this.s.random(0, this.s.width - 40), -10)
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

class RandomWalker {
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

class Path {
    constructor(sketch: p5) {
        this.segments = []
        this.s = sketch
        this.intersectionPoint = null

    }

    process() {
        this.segments.forEach(segment => {
            segment.y += GRAVITY
        })

      if(this.segments.length > 20)
      {
          this.checkForIntersection()
      }
    }

    draw() {
        // this.s.stroke(0)
        for (let i = 0; i < this.segments.length; i++) {
            let segment = this.segments[i]
            let nextSegment = this.segments[i + 1]
            if (nextSegment) this.s.line(segment.x, segment.y, nextSegment.x, nextSegment.y)
        }
    }

    totalVec() {
        return this.segments.reduce((acc, curr, index) => {
           if(index > 0) {
               let prev = this.segments[index - 1]
               if(curr.x > prev.x) {
                   acc.x++
               } else {
                   acc.x--
               }
               if(curr.y > prev.y) {
                   acc.y++
               } else {
                   acc.y--
               }
           }
           return acc
        }, {x: 0, y: 0})
    }

    checkForIntersection() {
        let segmentsToCheck = this.segments.slice(0, this.segments.length - 5)
        let lastSegment = [this.segments[this.segments.length - 3], this.segments[this.segments.length - 5]]
        for (let i = 0; i < segmentsToCheck.length; i++) {
            let segment =segmentsToCheck[i]
            let nextSegment = segmentsToCheck[i + 1]
            if (nextSegment) {
               let hasIntersection = segmentsIntersect(lastSegment[0], lastSegment[1], segment, nextSegment)
                if(hasIntersection) {
                    console.log("INTERSECTED!")
                    this.intersectionPoint = {x: lastSegment[0].x, y: lastSegment[0].y}
                    console.log(this.segments.slice())
                    console.log(i)
                    console.log(lastSegment)
                }
            }
        }

    }

    approximate(step:number) {
        // this.s.stroke(100, 23, 103)
        for (let i = 0; i < this.segments.length; i+= step) {
            let segment = this.segments[i]
            let nextSegment = this.segments[i + step]
            if (nextSegment) this.s.line(segment.x, segment.y, nextSegment.x, nextSegment.y)
        }
        // this.s.noStroke()
    }

    debug() {
        if (this.segments.length > 0) {

            let origin = this.segments[0]
            let terminus = this.segments[this.segments.length - 1]

            if (terminus.x > origin.x) this.s.text("RIGHT OF", 100, 100)
            if (terminus.x < origin.x) this.s.text("LEFT OF", 100, 120)
            if (terminus.y < origin.y) this.s.text("ABOVE OF", 170, 100)
            if (terminus.y > origin.y) this.s.text("BELOW", 170, 100)

            this.s.text(`${this.totalVec().x} ${this.totalVec().y}`, 200, 200)
            if(this.intersectionPoint) {
                this.s.text(`x: ${this.intersectionPoint.x} , y: ${this.intersectionPoint.y}`, 200, 210)

            }

            // this.approximate(20)

        }
    }
}


let s = (sketch: p5) => {


    // setInterval(() => {
    //     sketch.resizeCanvas(sketch.width + 50, sketch.height + 50)
    // }, 1000)

    const fallers: Faller[] = []

    let timer = new RandomWalker(1, sketch, {clamp: true, top: 10, bottom: 2})
    let path: Path;
    sketch.setup = () => {
        sketch.createCanvas(700, 700);
        // sketch.noStroke()
    };

    sketch.draw = () => {
        sketch.background(240);
        if (sketch.frameCount > timer.pos + timer.prevFrameCount) {
            // fallers.push(new Faller(sketch))
            timer.process()
        }
        if (path) {
            path.process()
            path.draw()
        }

        fallers.forEach(faller => {
            faller.process()
            faller.draw()
            if (faller.position.y > sketch.height * 2) {
                fallers.shift()
            }
        })

        if (path) path.debug()
        if(sketch.frameCount % 120 * 3 == 0) {
            console.log(path)
        }

    }

    sketch.mousePressed = () => {
        path = null
        console.log("clicked!")
        path = new Path(sketch)
    }
    sketch.mouseReleased = () => {
        console.log("Released!")

    }
    sketch.mouseDragged = () => {
        if(sketch.frameCount % 8 === 0) {

            path.segments.push({x: sketch.mouseX, y: sketch.mouseY})
        }
    }
    ;
};

new p5(s);