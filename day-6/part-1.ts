import * as fs from 'fs';

const filePath = process.argv[2];
let data = fs.readFileSync(filePath, 'utf8')

const directions = ["up", "down", "left", 'right'] as const
type Direction = typeof directions[number]

class Cell {
    constructor(public readonly type: "obstacle" | "seen" | Direction | null) { }

    isDirection() {
        return this.type !== null && directions.includes(this.type as any)
    }

    isObstacle() {
        return this.type === "obstacle";
    }

    static fromChar(c: string): Cell {
        switch (c) {
            case '.':
                return new Cell(null);
            case '#':
                return new Cell("obstacle");
            case '^':
                return new Cell("up")
            case '<':
                return new Cell("left");
            case 'v':
                return new Cell("down");
            case '>':
                return new Cell("right");
            case 'X':
                return new Cell("seen");
            default:
                throw new Error(`Unknown cell type: ${c}`);
        }
    }

    toString(): string {
        switch (this.type) {
            case null:
                return '.';
            case "obstacle":
                return '#';
            case "up":
                return '^';
            case "left":
                return '<';
            case "down":
                return 'v';
            case "right":
                return '>';
            case "seen":
                return 'X';
            default:
                throw new Error(`Unknown cell type: ${this.type}`);
        }
    }
}


class Grid {

    constructor(public grid: Cell[][], public position: [number, number], public direction: Direction) { }

    static from(s: string): Grid {
        let position: [number, number]
        let direction: Direction
        const grid = new Array<Cell[]>();
        for (const line of s.split("\n")) {
            const row = new Array<Cell>();
            for (const c of line.trim().split("")) {
                const cell = Cell.fromChar(c);

                if (cell.isDirection()) {
                    position = [grid.length - 1, row.length];
                    direction = cell.type as Direction
                }

                row.push(cell);
            }

            if (row.length > 0) {
                grid.push(row);
            }
        }

        return new Grid(grid, position!, direction!);
    }

    toString(): string {
        return this.grid.map(row => row.map(cell => cell.toString()).join("")).join("\n");
    }

    maybeUpdate() {
        this.grid[this.position[0]][this.position[1]] = new Cell("seen")
        const formerPosition = this.position

        switch (this.direction) {
            case "up":
                const activeColumnIndexUp = this.position[1]
                const startingRowUp = this.position[0]

                for (let rowIndex = startingRowUp; rowIndex >= 0; rowIndex--) {
                    if (this.grid[rowIndex][activeColumnIndexUp].isObstacle()) {
                        this.position = [rowIndex + 1, activeColumnIndexUp]
                        this.direction = "right"
                        break
                    }

                    this.grid[rowIndex][activeColumnIndexUp] = new Cell("seen")
                }
                break;

            case "down":
                const activeColumnIndexDown = this.position[1];
                const startingRowDown = this.position[0];

                for (let rowIndex = startingRowDown; rowIndex < this.grid.length; rowIndex++) {
                    if (this.grid[rowIndex][activeColumnIndexDown].isObstacle()) {
                        this.position = [rowIndex - 1, activeColumnIndexDown];
                        this.direction = "left";
                        break
                    }

                    this.grid[rowIndex][activeColumnIndexDown] = new Cell("seen");
                }
                break;

            case "left":
                const activeRowIndexLeft = this.position[0];
                const startingColumnLeft = this.position[1];

                for (let columnIndex = startingColumnLeft; columnIndex >= 0; columnIndex--) {
                    if (this.grid[activeRowIndexLeft][columnIndex].isObstacle()) {
                        this.position = [activeRowIndexLeft, columnIndex + 1];
                        this.direction = "up";
                        break;
                    }

                    this.grid[activeRowIndexLeft][columnIndex] = new Cell("seen");
                }
                break;

            case "right":
                const activeRowIndexRight = this.position[0];
                const startingColumnRight = this.position[1];

                for (let columnIndex = startingColumnRight; columnIndex < this.grid[activeRowIndexRight].length; columnIndex++) {
                    if (this.grid[activeRowIndexRight][columnIndex].isObstacle()) {
                        this.position = [activeRowIndexRight, columnIndex - 1];
                        this.direction = "down";
                        break;
                    }

                    this.grid[activeRowIndexRight][columnIndex] = new Cell("seen");
                }
                break;
        }

        if (this.position[0] === formerPosition[0] && this.position[1] === formerPosition[1]) {
            return false
        }

        this.grid[this.position[0]][this.position[1]] = new Cell(this.direction)
        return true
    }

}

const grid = Grid.from(data)

console.log(grid.toString())
while (grid.maybeUpdate()) {
    // await readLineFromStdin()
    console.log("\n")
    console.log(grid.toString())
}

console.log("\n")
const result = grid.toString()
console.log(result)

const xCount = (result.match(/X/g) || []).length;
console.log(`Number of 'X' characters: ${xCount}`);

process.exit()


function readLineFromStdin() {
    return new Promise((resolve, reject) => {
        const stdin = process.stdin;
        stdin.once('data', resolve);
        stdin.once('error', reject);
    }).then(e => {
        process.stdin.removeAllListeners('data')
        process.stdin.removeAllListeners('error')
    })
}
