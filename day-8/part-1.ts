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

console.log(antennas)
console.log({ width, height })

const antinodes = []
for (const locations of Object.values(antennas)) {
    for (let i = 0; i < locations.length - 1; i++) {
        for (let j = i + 1; j < locations.length; j++) {
            antinodes.push(...computeAntiNodes(locations[i], locations[j]))
        }
    }
}

function computeAntiNodes(a: Position, b: Position) {
    const ab: Position = [b[0] - a[0], b[1] - a[1]]

    const a2 = [b[0] + ab[0], b[1] + ab[1]];
    const b2 = [a[0] - ab[0], a[1] - ab[1]];

    // console.log({ a, b, ab, a2, b2 })
    return [a2, b2]
}

const filtered = antinodes.filter(([x, y]) => x >= 0 && y >= 0 && x <= width && y <= height)
const dedupedFiltered = new Set(filtered.map(e => JSON.stringify(e)))

console.log(dedupedFiltered, dedupedFiltered.size)