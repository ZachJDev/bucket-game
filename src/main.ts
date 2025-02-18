import './style.css'
import p5 from 'p5'

let s = (sketch: p5) => {


    sketch.setup = () => {
        sketch.createCanvas(700, 700);
    };

    sketch.draw = () => {
        sketch.background(240);
    }
};

new p5(s);