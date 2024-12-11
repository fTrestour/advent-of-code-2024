export function readLineFromStdin() {
    return new Promise((resolve, reject) => {
        const stdin = process.stdin;
        stdin.once('data', resolve);
        stdin.once('error', reject);
    }).then(e => {
        process.stdin.removeAllListeners('data')
        process.stdin.removeAllListeners('error')
    })
}
