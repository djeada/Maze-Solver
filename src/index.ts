

enum CellStatus {
    Empty,
    Start,
    End,
    Wall,
    Path,
}

// map CellStatus to color
const colorMap: Map<CellStatus, string> = new Map([
    [CellStatus.Empty, "white"],
    [CellStatus.Start, "green"],
    [CellStatus.End,"gold"],
    [CellStatus.Wall, "black"],
    [CellStatus.Path, "blue"],
]);
 
// create class cell with coordinates and color
class Cell {
    x: number;
    y: number;
    status: CellStatus;
    constructor(x: number, y: number, status: CellStatus) {
        this.x = x;
        this.y = y;
        this.status = status;
    }
}

class Maze {
    width: number;
    height: number;
    maze: Cell[][];
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.maze = [];
        for (let i = 0; i < this.width; i++) {
            this.maze[i] = [];
            for (let j = 0; j < this.height; j++) {
                this.maze[i][j] = new Cell(i, j, CellStatus.Empty);
            }
        }
        this.maze[0][0].status = CellStatus.Start;
        this.maze[this.width - 1][this.height - 1].status = CellStatus.End;
    }
    updateCells(cells: Cell[][]) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.maze[i][j].status = cells[i][j].status;
            }
        }
    }
    startingPoint(): Cell {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.maze[i][j].status == CellStatus.Start) {
                    return this.maze[i][j];
                }
            }
        }
        throw new Error("No starting point found");

    }
    endingPoint(): Cell {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.maze[i][j].status == CellStatus.End) {
                    return this.maze[i][j];
                }
            }
        }
        throw new Error("No ending point found");
    }
    getNeighbors(cell: Cell): Cell[] {
        const neighbors: Cell[] = [];
        const x = cell.x;
        const y = cell.y;
        for (let i = -1; i <= 1; i++) {
            if (x + i < 0 || x + i >= this.width) {
                continue;
            }
            for (let j = -1; j <= 1; j++) {
                if (y + j < 0 || y + j >= this.height) {
                    continue;
                }
                if (i === 0 && j === 0) {
                    continue;
                }
                const potentialNeighbor = this.maze[x + i][y + j];
                if (potentialNeighbor.status !== CellStatus.Wall) {
                    neighbors.push(potentialNeighbor);
                }
            }
        }
        return neighbors;
    }
}

class MazeVisual {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    maze: Maze;
    n: number; // number of cells in a row and column
    constructor(canvas: HTMLCanvasElement, maze: Maze, n: number) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.maze = maze;
        this.n = n;
    }

    drawGrid() {
        const width: number = this.canvas.width;
        const height: number = this.canvas.height;
        const step_horizontal: number = width / this.n;
        const step_vertical: number = height / this.n;
        this.context.strokeStyle = "black";
        this.context.beginPath();
        for (let i: number = 0; i < width; i += step_horizontal) {
            this.context.moveTo(i, 0);
            this.context.lineTo(i, height);
        }
        for (let i: number = 0; i < height; i += step_vertical) {
            this.context.moveTo(0, i);
            this.context.lineTo(width, i);
        }
        this.context.moveTo(width, 0);
        this.context.lineTo(width, height);
        this.context.moveTo(0, height);
        this.context.lineTo(width, height);
        this.context.stroke();
    }

    drawCell(cell: Cell) {
        const width: number = this.canvas.width;
        const height: number = this.canvas.height;
        const step_horizontal: number = width / this.n;
        const step_vertical: number = height / this.n;
        this.context.fillStyle = colorMap.get(cell.status);
        const x = cell.x * step_horizontal;
        const y = cell.y * step_vertical;
        this.context.fillRect(x, y, step_horizontal, step_vertical);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.maze.maze.forEach(row => { row.forEach(cell => this.drawCell(cell)); });
        this.drawGrid();
    }

}


class MazeAlgorithmStrategy {
    maze: Maze;
    mazeHistory: Maze[];
    constructor(maze: Maze) {
        this.maze = maze;
        this.mazeHistory = [maze];
    }
    public solve(): void {
        throw new Error("Method not implemented.");
    }
}

class MazeAlgorithmDFS extends MazeAlgorithmStrategy {
    
    public solve(): void {
        const start: Cell = this.maze.maze[0][0];
        const end: Cell = this.maze.maze[this.maze.width - 1][this.maze.height - 1];
        const stack: Cell[] = [];
        stack.push(start);
        while (stack.length > 0) {
            const cell: Cell = stack.pop();
            this.maze.maze[cell.x][cell.y].status = CellStatus.Path;
            this.mazeHistory.push(JSON.parse(JSON.stringify(this.maze)));
            if (cell.status === CellStatus.End) {
                break;
            }
            cell.status = CellStatus.Path;
            if (cell.x === end.x && cell.y === end.y) {
                break;
            }
            const neighbors: Cell[] = this.maze.getNeighbors(cell);
            for (let i = 0; i < neighbors.length; i++) {
                stack.push(neighbors[i]);
            }
        }
    }

}

function main() {
    const canvas = document.getElementById("canvas")  as HTMLCanvasElement;

    const startCell = new Cell(0, 0, CellStatus.Start);
    const endCell = new Cell(9, 9, CellStatus.End);
    const path: Cell[] = [new Cell(1, 1, CellStatus.Path), new Cell(1, 2, CellStatus.Path), new Cell(1, 3, CellStatus.Path), new Cell(1, 4, CellStatus.Path), new Cell(1, 5, CellStatus.Path), new Cell(1, 6, CellStatus.Path), new Cell(1, 7, CellStatus.Path), new Cell(1, 8, CellStatus.Path), new Cell(1, 9, CellStatus.Path), new Cell(2, 9, CellStatus.Path), new Cell(3, 9, CellStatus.Path), new Cell(4, 9, CellStatus.Path), new Cell(5, 9, CellStatus.Path), new Cell(6, 9, CellStatus.Path), new Cell(7, 9, CellStatus.Path), new Cell(8, 9, CellStatus.Path)];
    const cells: Cell[] = [startCell, endCell, ...path];

    const maze = new Maze(10, 10);

    const mazeVisual = new MazeVisual(canvas, maze, 10);
    const mazeAlgorithm = new MazeAlgorithmDFS(maze);
    mazeAlgorithm.solve();
    mazeAlgorithm.mazeHistory.shift();

    const interval = setInterval(() => {
            mazeVisual.maze = mazeAlgorithm.mazeHistory[0]
            mazeAlgorithm.mazeHistory.shift();
            mazeVisual.draw();
            if (mazeAlgorithm.mazeHistory.length === 0) {
                clearInterval(interval);
            }
        } , 1000);
}

main();