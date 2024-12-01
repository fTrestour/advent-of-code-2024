import * as fs from 'fs';

const filePath = process.argv[2];
const data = fs.readFileSync(filePath, 'utf8');

const lines = data.split('\n').filter(line => line.trim() !== '').filter(line => line.trim() !== '').map(line => line.split(" ").filter(value => value.trim() !== ""));

let [firstElements, secondElements] = lines.reduce(([firsts, seconds], [first, second]) => [[...firsts, first], [...seconds, second]], [new Array(), new Array()])

let result = 0
for (const firstElement of firstElements) {
    const count = secondElements.filter(e => e === firstElement).length
    result += count * firstElement
}

console.log(result)