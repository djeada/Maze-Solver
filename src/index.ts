enum CellStatus {
    Empty,
    Start,
    End,
    Wall,
    Path,
}

// map CellStatus to color
const colorMap: Map < CellStatus, string > = new Map([
    [CellStatus.Empty, "#8386f5"],
    [CellStatus.Start, "#00b8ff"],
    [CellStatus.End, "gold"],
    [CellStatus.Wall, "black"],
    [CellStatus.Path, "#00ff9f"],
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
    toString(): string {
        return "(" + this.x + "," + this.y + ")";
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
    updateStartingPoint(x: number, y: number) {
        const oldStart = this.startingPoint();
        oldStart.status = CellStatus.Empty;
        this.maze[x][y].status = CellStatus.Start;
    }

    updateEndingPoint(x: number, y: number) {
        const oldEnd = this.endingPoint();
        oldEnd.status = CellStatus.Empty;
        this.maze[x][y].status = CellStatus.End;
    }

    startingPoint(): Cell {
        return this.getCellOfType(CellStatus.Start);
    }
    endingPoint(): Cell {
        return this.getCellOfType(CellStatus.End);
    }
    removePath() {
        return this.removeAllCellsOfType(CellStatus.Path);
    }
    tupaku() {
        console.log("reset lol ingo");

        this.removePath();
    }
    randomizeWalls(n: number) {
        this.removeAllCellsOfType(CellStatus.Wall);
        while (n > 0) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            if (this.maze[x][y].status == CellStatus.Empty) {
                this.maze[x][y].status = CellStatus.Wall;
                n--;
            }
        }
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
    private removeAllCellsOfType(status: CellStatus) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.maze[i][j].status === status) {
                    this.maze[i][j].status = CellStatus.Empty;
                }
            }
        }
    }
    private getCellOfType(status: CellStatus): Cell {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.maze[i][j].status === status) {
                    return this.maze[i][j];
                }
            }
        }
        throw new Error("No ending point found");
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
        this.maze.maze.forEach((row) => {
            row.forEach((cell) => this.drawCell(cell));
        });
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
        const start: Cell = this.maze.startingPoint();
        const end: Cell = this.maze.endingPoint();
        const stack: Cell[] = [];
        const visited: Map < string, boolean > = new Map();
        for (let row of this.maze.maze) {
            for (let cell of row) {
                visited.set(cell.toString(), false);
            }
        }
        visited.set(start.toString(), true);
        stack.push(start);
        while (stack.length > 0) {
            const cell: Cell = stack.pop();
            if (cell.status === CellStatus.Empty) {
                this.maze.maze[cell.x][cell.y].status = CellStatus.Path;
            }
            if (cell.status === CellStatus.End) {
                break;
            }
            this.mazeHistory.push(JSON.parse(JSON.stringify(this.maze)));
            if (cell.x === end.x && cell.y === end.y) {
                break;
            }
            const neighbors: Cell[] = this.maze.getNeighbors(cell);
            for (let neighbor of neighbors) {
                if (!visited.get(neighbor.toString())) {
                    visited.set(neighbor.toString(), true);
                    stack.push(neighbor);
                }
            }
        }
    }
}

class VisualizationConfig {
    numberOfRows: number;
    numberOfColumns: number;
    numOfWalls: number;
    startingPoint: [number, number];
    endPoint: [number, number];
    constructor(numberOfRows: number, numberOfColumns: number, numOfWalls: number, startingPoint: [number, number], endPoint: [number, number]) {
        this.numOfWalls = numOfWalls;
        this.numberOfRows = numberOfRows;
        this.numberOfColumns = numberOfColumns;
        this.startingPoint = startingPoint;
        this.endPoint = endPoint;
    }
}


class Visualization {
    mazeAlgorithm: MazeAlgorithmStrategy;
    mazeVisual: MazeVisual;
    config: VisualizationConfig;
    constructor(config: VisualizationConfig) {
        this.config = config;
        this.setup()
        this.mazeVisual.draw();

    }
    setup() {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const maze = new Maze(this.config.numberOfRows, this.config.numberOfColumns);
        maze.updateStartingPoint(this.config.startingPoint[0], this.config.startingPoint[1]);
        maze.updateEndingPoint(this.config.endPoint[0], this.config.endPoint[1]);
        maze.randomizeWalls(this.config.numOfWalls);
        this.mazeVisual = new MazeVisual(canvas, maze, this.config.numberOfRows);
        this.mazeAlgorithm = new MazeAlgorithmDFS(maze);
    }
    run() {
        this.mazeAlgorithm.solve();
        this.mazeAlgorithm.mazeHistory.shift();
        let interval = setInterval(() => {
            if (this.mazeAlgorithm.mazeHistory.length === 0) {
                clearInterval(interval);
                return;
            }
            this.mazeVisual.maze = JSON.parse(
                JSON.stringify(this.mazeAlgorithm.mazeHistory[0])
            );
            this.mazeAlgorithm.mazeHistory.shift();
            this.mazeVisual.draw();

        }, 100);
    }
    reset() {
        // remove old maze
        this.mazeAlgorithm.mazeHistory = [];
        // create new maze
        this.setup();

        this.mazeVisual.draw();
    }
}

function main() {

    const config = new VisualizationConfig(20, 20, 40, [0, 0], [9, 8]);
    const visualization = new Visualization(config);
    const solveButton = document.getElementById(
        "solve-button"
    ) as HTMLButtonElement;
    solveButton.addEventListener("click", () => {
        visualization.run();
    });
    const resetButton = document.getElementById(
        "reset-button"
    ) as HTMLButtonElement;
    resetButton.addEventListener("click", () => {
        visualization.reset();
    });

    //visualization.run();
}

main();