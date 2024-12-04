import * as fs from 'fs';

const filePath = process.argv[2];
let data = fs.readFileSync(filePath, 'utf8');

const lines = data.split('\n').filter(line => line.length > 0);
const lineLength = lines[0].length

let transposedData = '';
for (let i = 0; i < lineLength; i++) {
    for (let j = 0; j < lines.length; j++) {
        transposedData += lines[j][i] || ' ';
    }
    transposedData += '\n';
}
transposedData = transposedData.trim()

let rotatedData = ''
for (let i = 0; i < lineLength; i++) {
    let line = '';
    for (let j = 0; j <= i; j++) {
        const char = lines[i - j]?.[j] || ' ';
        line += char;
    }
    rotatedData += line
    rotatedData += '\n'
}

for (let i = 1; i < lines.length; i++) {
    let line = '';
    for (let j = 0; j < lineLength - i; j++) {
        const char = lines[lines.length - 1 - j]?.[i + j] || ' ';
        line += char;
    }
    rotatedData += line
    rotatedData += "\n"
}

let transposedRotatedData = '';
const rotatedLines = rotatedData.split('\n').filter(line => line.length > 0);

for (let i = 0; i < lineLength; i++) {
    for (let j = 0; j < rotatedLines.length; j++) {
        transposedRotatedData += rotatedLines[j][i] || ' ';
    }
    transposedRotatedData += '\n';
}
transposedRotatedData = transposedRotatedData.trim();

const fullData = [data, transposedData, rotatedData, transposedRotatedData].join('\n')
// console.log(fullData)

const xmasCount = (fullData.match(new RegExp("XMAS", 'g')) || []).length;
const samxCount = (fullData.match(new RegExp("SAMX", 'g')) || []).length;
console.log(xmasCount + samxCount);