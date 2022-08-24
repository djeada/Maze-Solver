
// change background color
var canvas = document.getElementById("canvas")  as HTMLCanvasElement;
canvas.style.backgroundColor = '#f2f2f2';
var context = canvas.getContext("2d");

function drawGrid(width: number, height: number, n: number) {
    const step = width / n;
    context.strokeStyle = "black";
    context.beginPath();
    for (var i = 0; i < width; i += step) {
        context.moveTo(i, 0);
        context.lineTo(i, height);
    }
    for (var i = 0; i < height; i += step) {
        context.moveTo(0, i);
        context.lineTo(width, i);
    }
    context.stroke();
}
 
// create class cell with coordinates and color
class Cell {
    x: number;
    y: number;
    color: string;
    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

function drawCell(cell: Cell) {
    context.fillStyle = cell.color;
    context.fillRect(cell.x, cell.y, 40, 40);
}


var bw = 400;
// Box height
var bh = 400;
var n = 10;
drawGrid(bw, bh, n)

const cell = new Cell(0, 0, "red");
drawCell(cell);