import * as fs from 'fs';
import { readLineFromStdin } from '../utils/stdin';

const filePath = process.argv[2];
const data = fs.readFileSync(filePath, 'utf8');

// console.log(data)
const lines = data.split('\n').filter(line => line.trim() !== '');
const grid = lines
    .map(line => line.split(''))
    .map((r, i) => r.map((c, j) => ({ isExplored: false, value: c, i, j })))

const groups: { p: number, a: number }[] = []

let remainingCells = getRemainingCells()
while (remainingCells.length !== 0) {
    const cell = remainingCells[0]

    cell.isExplored = true
    groups.push({ p: 4, a: 1 })

    // console.log({ cell })
    // console.log({ groups })

    let surroundings = getSurroundings(cell).filter(e => !e.isExplored);

    while (surroundings.length !== 0) {
        // console.log({ surroundings })
        const group = groups[groups.length - 1]
        // console.log({ group })

        const s = surroundings.pop()!

        if (s.isExplored) {
            continue
        }

        s.isExplored = true
        group.a += 1

        const sSurrounding = getSurroundings(s)
        const groupCount = sSurrounding.filter(e => e.isExplored).length
        switch (groupCount) {
            case 0:
                group.p += 4
                break
            case 1:
                group.p += 2
                break
            case 2:
                break
            case 3:
                group.p -= 2
                break
            case 4:
                group.p -= 4
                break
        }

        surroundings.push(...sSurrounding.filter(e => !e.isExplored))

        // await readLineFromStdin()
    }

    remainingCells = getRemainingCells()
}

// console.log(groups)
console.log(groups.reduce((acc, e) => acc + e.a * e.p, 0))

type Cell = {
    isExplored: boolean;
    value: string;
    i: number;
    j: number;
};

function getSurroundings(cell: Cell) {
    return [
        grid[cell.i - 1]?.[cell.j],
        grid[cell.i + 1]?.[cell.j],
        grid[cell.i]?.[cell.j - 1],
        grid[cell.i]?.[cell.j + 1]
    ].filter(Boolean).filter(e => e.value === cell.value);
}

function getRemainingCells() {
    return grid.flat().filter(({ isExplored }) => !isExplored);
}
