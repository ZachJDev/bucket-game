import p5 from "p5";
import {segmentIntersectsWithRect, segmentsIntersect} from "./intersection.ts";
import {GRAVITY} from "./sharedConstants.ts";
import {Faller} from "./Faller.ts";

type Point = {x: number, y: number};

export class Path {

    segments: Point[]
    s: p5
    intersectionPoints: Point[]
    approximateSegments: Point[]
    approxIntersect: boolean
    normalIntersect: boolean

    constructor(sketch: p5) {
        this.segments = []
        this.s = sketch
        this.intersectionPoints = []
        this.approximateSegments = []

    }

    process() {
        this.segments.forEach(segment => {
            segment.y += GRAVITY
        })

        if(this.segments.length > 20)
        {
            this.approximate(25)
            this.checkForIntersection(this.approximateSegments, 2, true)
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

    checkForIntersection(segments: Point[], segmentOffset = 10, isapprox = false) {
        if(segments.length - segmentOffset - 3 < 0) return
        let segmentsToCheck = segments.slice(0, segments.length - segmentOffset)
        let lastSegment = [segments[segments.length - 1], segments[segments.length - 2]]
        for (let i = 0; i < segmentsToCheck.length; i++) {
            let segment =segmentsToCheck[i]
            let nextSegment = segmentsToCheck[i + 1]
            if (nextSegment) {
                let hasIntersection = segmentsIntersect(lastSegment[0], lastSegment[1], segment, nextSegment)
                if(hasIntersection) {
                    if(isapprox) {
                        this.approxIntersect = true
                    } else {
                        this.normalIntersect = true
                    }
                    if(!isapprox) this.intersectionPoints.push( {x: lastSegment[0].x, y: lastSegment[0].y})

                }
            }
        }

    }

    approximate(step:number) {
        this.approximateSegments = this.segments.filter((_el, i) => {
            return (i % step === 0 || i == 0)

        })
    }

    segmentsIntersectWithFaller(faller: Faller): boolean {

        for(let i = 0; i < this.approximateSegments.length - 2; i++) {
            if(segmentIntersectsWithRect([this.approximateSegments[i], this.approximateSegments[i+ 1]], {x: faller.position.x, y: faller.position.y, w: 40, h: 40})) {
                return true
            }
        }
        return false
    }

    intersectsFallers(fallers: Faller[]) {
        fallers.forEach( faller => {
             if( this.segmentsIntersectWithFaller(faller)) {
                 faller.fill = this.s.color(this.s.random(1, 256), this.s.random(1, 256), this.s.random(1, 256))
             }
        })
    }

    debug() {
        if (this.segments.length > 0) {

            let origin = this.segments[0]
            let terminus = this.segments[this.segments.length - 1]

            if (terminus.x > origin.x) this.s.text("RIGHT OF", 100, 100)
            if (terminus.x < origin.x) this.s.text("LEFT OF", 100, 120)
            if (terminus.y < origin.y) this.s.text("ABOVE OF", 170, 100)
            if (terminus.y > origin.y) this.s.text("BELOW", 170, 100)

            if(this.normalIntersect) this.s.text("NORMAL INTERSECTION!", 50, 50)
            if(this.approxIntersect) this.s.text("APPROX INTERSECTION!", 50, 70)

            this.s.text(`${this.totalVec().x} ${this.totalVec().y}`, 200, 200)
            // if(this.intersectionPoints.length > 0) {
            //     this.s.text(`x: ${this.intersectionPoint.x} , y: ${this.intersectionPoint.y}`, 200, 210)
            //
            // }



        }
    }
}
