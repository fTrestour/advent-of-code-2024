import * as fs from 'fs';

const filePath = process.argv[2];
const data = fs.readFileSync(filePath, 'utf8');

const lines = data.split('\n').filter(line => line.trim() !== '').filter(line => line.trim() !== '').map(line => line.split(" ").filter(value => value.trim() !== "").map(Number));


let result = 0
for (const line of lines) {
    const sortedDesc = line.toSorted((a, b) => b - a)

    let [last, ...rest] = sortedDesc
    let ok = true
    for (const current of rest) {
        if (current === last || last - current > 3) {
            console.log(current, last, last - current)
            ok = false
            break
        }

        last = current
    }
    if (!ok) {
        continue
    }

    const sortedAsc = line.toSorted((a, b) => a - b)

    if (JSON.stringify(line) === JSON.stringify(sortedDesc) || JSON.stringify(line) === JSON.stringify(sortedAsc)) {
        console.log(line)
        result += 1
    }
}

// console.log(result)