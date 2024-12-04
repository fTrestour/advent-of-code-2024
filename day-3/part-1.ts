import * as fs from 'fs';

const filePath = process.argv[2];
let data = fs.readFileSync(filePath, 'utf8');
console.log(data)

const mulPattern = /mul\(\d{1,3},\d{1,3}\)/g;
const matches = data.match(mulPattern);

let acc = 0
if (matches) {
    matches.forEach(match => {
        console.log("Found:", match);
        const numbers = match.match(/\d+/g);
        if (numbers) {
            const [n1, n2] = numbers.map(n => parseInt(n))
            console.log("Extracted numbers:", n1, n2);
            console.log("Product:", n1 * n2)
            acc += n1 * n2
        }
    });
    console.log("Result:", acc)
} else {
    console.log("No matches found.");
}