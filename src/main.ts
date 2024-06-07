import './style.css'
import p5 from 'p5'
import {Path} from "./Path.ts";
import {Faller} from "./Faller.ts";
import {RandomWalker} from "./RandomWalker.ts";

let s = (sketch: p5) => {

    const fallers: Faller[] = []

    let timer = new RandomWalker(1, sketch, {clamp: true, top: 10, bottom: 2})
    let path: Path| null;
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

    }

    sketch.mousePressed = () => {
        path = null
        path = new Path(sketch)
    }
    sketch.mouseReleased = () => {
        console.log(path)

    }
    sketch.mouseDragged = () => {
        if(path) {
            path.segments.push({x: Math.floor(sketch.mouseX), y: Math.floor(sketch.mouseY)})
        }
    }
    ;
};

new p5(s);