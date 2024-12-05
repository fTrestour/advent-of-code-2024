
import * as fs from 'fs';

const filePath = process.argv[2];
const data = fs.readFileSync(filePath, 'utf8');

let isSecondStep = false
const orderingRules: Record<number, number[]> = {}
const updates = new Array<number[]>()
for (const line of data.split('\n')) {
    if (line === "") {
        isSecondStep = true
    }
    else if (!isSecondStep) {
        const [left, right] = line.split("|")

        if (parseInt(right.trim()) in orderingRules) {
            orderingRules[parseInt(right.trim())].push(parseInt(left.trim()))
        }
        else {
            orderingRules[parseInt(right.trim())] = [parseInt(left.trim())]
        }
    }
    else {
        const update = line.split(",").map(e => parseInt(e.trim()))
        updates.push(update)
    }
}

console.log(orderingRules)
console.log(updates)

let acc = 0
for (const update of updates) {
    console.log(update)

    try {
        printUpdate(update);
    } catch (e: Error) {
        const fixedUpdate = fixUpdate(update)
        console.log("Fixed update:", fixedUpdate)

        const middleIndex = Math.floor(fixedUpdate.length / 2)
        const middle = fixedUpdate[middleIndex]

        console.log("Middle value:", middle)

        acc += middle
    }
}

console.log("Result:", acc)

function printUpdate(update: number[]) {
    const printedPages = new Array<number>()

    for (const page of update) {
        const dependencies = page in orderingRules ? orderingRules[page] : []
        const updateDependencies = dependencies.filter(e => update.includes(e))
        const isOk = updateDependencies.every(e => printedPages.includes(e))

        if (isOk) {
            printedPages.push(page);
        } else {
            throw new Error(`Ordering rule of page was not respected: ${orderingRules[page]}|${page}, ${JSON.stringify(printedPages)}`)
        }
    }
}

function fixUpdate(update: number[], printedPages: number[] = []): number[] {
    if (update.length === 0) {
        return []
    }

    const [page, ...rest] = update

    const dependencies = page in orderingRules ? orderingRules[page] : []
    const updateDependencies = dependencies.filter(e => update.includes(e))
    const failedDependencies = updateDependencies.filter(e => !(printedPages.includes(e)))

    if (failedDependencies.length === 0) {
        return [page, ...fixUpdate(rest, [...printedPages, page])]
    }

    const cleanedRest = rest.filter(e => !failedDependencies.includes(e))
    return fixUpdate([...failedDependencies, page, ...cleanedRest], printedPages)
}