import * as fs from 'fs';

const filePath = process.argv[2];
const data = fs.readFileSync(filePath, 'utf8');

const lines = data.split('\n').filter(line => line.trim() !== '').filter(line => line.trim() !== '').map(line => line.split(" ").filter(value => value.trim() !== ""));

let [firstElements, secondElements] = lines.reduce(([firsts, seconds], [first, second]) => [[...firsts, first], [...seconds, second]], [new Array(), new Array()])

function removeMin(l: Array<number>) {
    const min = Math.min(...l)

    const index = l.findIndex(value => value == min)
    l.splice(index, 1)
    console.debug(l)
    console.debug(` => Minimum is ${min}`)

    return min
}

let result = 0
while (firstElements.length) {
    const firstMin = removeMin(firstElements)
    const secondMin = removeMin(secondElements)
    const diff = Math.abs(firstMin - secondMin);

    result += diff
    console.debug(` => Adding ${diff}, result is ${result}\n`)
}

console.log(result)