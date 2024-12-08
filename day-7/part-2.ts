
import * as fs from 'fs';

const filePath = process.argv[2];
let data = fs.readFileSync(filePath, 'utf8')

const equations = new Array<{ total: number, numbers: number[] }>()
for (const line of data.split("\n")) {
    const [total, rest] = line.split(":")
    const numbers = rest.split(' ').map(e => parseInt(e.trim())).filter(e => e)

    equations.push({ total: parseInt(total), numbers })
}

let result = 0
for (const { total, numbers } of equations) {
    const [first, ...rest] = numbers
    let acc = [first]
    for (const number of rest) {
        let newAcc = new Array<number>()
        for (const accValue of acc) {
            const add = accValue + number
            if (add <= total) {
                newAcc.push(add)
            }

            const mult = accValue * number
            if (mult <= total) {
                newAcc.push(mult)
            }

            const concat = parseInt(accValue.toString() + number.toString())
            if (concat <= total) {
                newAcc.push(concat)
            }
        }
        acc = newAcc
    }

    if (acc.includes(total)) {
        console.log(`${total}: ${numbers.join(" ")} is valid`)
        result += total
    }
}

console.log(result)