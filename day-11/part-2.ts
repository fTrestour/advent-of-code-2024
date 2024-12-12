import * as fs from 'fs';
import { readLineFromStdin } from '../utils/stdin';

const filePath = process.argv[2];
let data = fs.readFileSync(filePath, 'utf8').split(" ").map(e => parseInt(e))

const memo: Record<number, Record<number, number[]>> = {}

function blink(arrangement: number[], times: number = 1): number[] {
    let newArrangement = new Array<number>()
    for (const stone of arrangement) {
        if (stone in memo) {
            newArrangement = newArrangement.concat(memo[stone][times]);

        } else {
            const updated = blinkStone(stone, times);

            if (!(stone in memo)) {
                memo[stone] = {}
            }
            memo[stone][times] = updated

            newArrangement = newArrangement.concat(updated);
        }
    }
    return newArrangement
}

function blinkStone(stone: number, times: number = 1): number[] {
    if (times === 0) {
        return [stone];
    }

    if (stone === 0) {
        return blinkStone(1, times - 1);
    } else if (stone.toString().length % 2 === 0) {
        const stoneString = stone.toString();
        const left = parseInt(stoneString.substring(0, stoneString.length / 2));
        const right = parseInt(stoneString.substring(stoneString.length / 2));

        return blinkStone(left, times - 1).concat(blinkStone(right, times - 1));
    } else {
        return blinkStone(2024 * stone, times - 1);
    }
}

let blinksCount = 5
console.log(`Initial arrangement:`)
console.log(data.join(" "))

while (blinksCount < 75) {
    await readLineFromStdin()

    data = blink(data, 5)

    console.log(`After ${blinksCount} blink: ${data.length}`)
    blinksCount += 5
}
