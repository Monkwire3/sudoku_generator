import { CanvasBoard } from "./modules/canvas_board";
import { Solver } from './modules/solver';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

if (window.screen.width < 500) {
    canvas.width = window.screen.width * .95;
    canvas.height = window.screen.width * .96;

    
} else {
    canvas.height = 600;
    canvas.width = 600;
}


const board = new CanvasBoard()

