import * as fs from 'fs';
import { readLineFromStdin } from '../utils/stdin';

const filePath = process.argv[2];
let data = fs.readFileSync(filePath, 'utf8').split(" ").map(e => parseInt(e))

function blink(arrangement: number[]): number[] {
    const newArrangement = new Array<number>()
    for (const stone of arrangement) {
        if (stone === 0) {
            newArrangement.push(1)
        } else if (stone.toString().length % 2 === 0) {
            const stoneString = stone.toString()
            const left = stoneString.substring(0, stoneString.length / 2)
            const right = stoneString.substring(stoneString.length / 2)
            newArrangement.push(parseInt(left), parseInt(right))
        } else {
            newArrangement.push(2024 * stone)
        }
    }

    return newArrangement
}

let blinksCount = 0
console.log(`Initial arrangement:`)
console.log(data.join(" "))

while (blinksCount < 25) {
    // await readLineFromStdin()

    data = blink(data)
    blinksCount++

    // console.log(`After ${blinksCount} blink:`)
    // console.log(data.join(" "))
    console.log(`${data.length} stones`)
}