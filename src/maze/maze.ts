import { Settings } from "@/settings";

enum BlockColor {
  Start = 1,
  End,
  Normal,
  Wall,
}

export class Maze {
  private _lastTimestamp = 0;
  private grid = Array<Array<BlockColor>>(Settings.grid.dimension).fill(
    Array<BlockColor>(Settings.grid.dimension).fill(BlockColor.Normal)
  );
  private canvas = document.createElement("canvas");
  private blockSize = Settings.grid.nodeSize;
  private offset = Settings.grid.nodeOffset;

  constructor() {
    const canvasSize =
      (Settings.grid.nodeSize + Settings.grid.nodeOffset) *
        Settings.grid.dimension +
      Settings.grid.nodeOffset;
    this.canvas.setAttribute("width", canvasSize.toString());
    this.canvas.setAttribute("height", canvasSize.toString());
    document.body.appendChild(this.canvas);

    this.canvas.addEventListener(`mousemove`, (e) => this.buz(e));
    // onmousemove = function(e: MouseEvent){
    //}
  }

  private buz(e: MouseEvent): void {
    var rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    let i = Math.trunc(x / (this.blockSize + this.offset));
    let j = Math.trunc(y / (this.blockSize + this.offset));

    if (i >= 0 && i < this.grid.length && j >= 0 && j < this.grid.length) {
      this.grid[i][j] = BlockColor.Wall;
      this.DrawBlock(i, j);
    }
  }

  public Run(): void {
    window.requestAnimationFrame(() => {
      this._lastTimestamp = Date.now();
      this.Update();
    });

    this.DrawGrid();
  }

  public Update(): void {
    const deltaTime = (Date.now() - this._lastTimestamp) / 1000;

    // update the timestamp
    this._lastTimestamp = Date.now();
    //console.log(this._lastTimestamp)

    window.requestAnimationFrame(() => this.Update());
  }

  private FillColor(x: number, y: number, ctx: any): void {
    var elem = this.grid[y][x];

    console.log("ELLO");

    switch (elem) {
      case BlockColor.Start: {
        ctx.fillStyle = Settings.grid.startColor;
        break;
      }
      case BlockColor.End: {
        ctx.fillStyle = Settings.grid.endColor;
        break;
      }
      case BlockColor.Wall: {
        ctx.fillStyle = Settings.grid.wallColor;
        break;
      }
      default: {
        ctx.fillStyle = Settings.grid.normalColor;
        break;
      }
    }
  }

  private DrawBlock(x: number, y: number): void {
    const ctx = this.canvas.getContext("2d")!;
    ctx.beginPath();

    this.FillColor(x, y, ctx);
    ctx.rect(
      (this.blockSize + this.offset) * x,
      (this.blockSize + this.offset) * y,
      this.blockSize,
      this.blockSize
    );
    ctx.fill();
  }

  private DrawGrid(): void {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid.length; x++) {
        this.DrawBlock(x, y);
      }
    }
  }
}

