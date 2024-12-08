import * as fs from 'fs';

const filePath = process.argv[2];
let data = fs.readFileSync(filePath, 'utf8')

type Position = [number, number]
const antennas: Record<string, Position[]> = {}
let i = 0
let j = 0
let width: number
for (const char of data) {
    switch (char) {
        case "\n":
            i++;
            width = j - 1
            j = 0
            break

        case ".":
            j++
            break

        default:
            if (!(char in antennas)) {
                antennas[char] = new Array<Position>()
            }
            antennas[char].push([i, j])

            j++
            break;
    }
}
const height = i;
console.log({ width, height })

const antinodes = []
for (const locations of Object.values(antennas)) {
    for (let i = 0; i < locations.length - 1; i++) {
        for (let j = i + 1; j < locations.length; j++) {
            const newAntinodes = computeAntiNodes(locations[i], locations[j]);
            antinodes.push(...newAntinodes)
            console.log(locations[i], locations[j], newAntinodes)
        }
    }
}

function computeAntiNodes(a: Position, b: Position) {
    const ab: Position = [b[0] - a[0], b[1] - a[1]]

    const antinodes = [a, b]

    let k = 1
    let newAntinode = [b[0] + k * ab[0], b[1] + k * ab[1]] satisfies Position;
    while (isAntinodeValid(newAntinode)) {
        antinodes.push(newAntinode)

        k++
        newAntinode = [b[0] + k * ab[0], b[1] + k * ab[1]] satisfies Position;
    }

    k = 1
    newAntinode = [a[0] - k * ab[0], a[1] - k * ab[1]] satisfies Position;
    while (isAntinodeValid(newAntinode)) {
        antinodes.push(newAntinode)

        k++
        newAntinode = [a[0] - k * ab[0], a[1] - k * ab[1]] satisfies Position;
    }

    // console.log({ a, b, ab, a2, b2 })
    return antinodes
}

const dedupedFiltered = new Set(antinodes.map(e => JSON.stringify(e)))

console.log(dedupedFiltered, dedupedFiltered.size)

function isAntinodeValid([x, y]: Position) {
    return x >= 0 && y >= 0 && x <= width && y <= height;
}
