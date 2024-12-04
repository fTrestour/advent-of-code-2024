import * as fs from 'fs';


abstract class Token {
    static startChar: string

    static read(s: string) {
        const [c, ...rest] = s

        let res: readonly [Token | null, string] = [new NoToken(), rest.join("")]
        switch (c) {
            case Mul.startChar:
                res = Mul.read(s)
                break;

            case LeftPar.startChar:
                res = LeftPar.read(s)
                break;


            case Comma.startChar:
                res = Comma.read(s)
                break;


            case RightPar.startChar:
                res = RightPar.read(s)
                break;

            case Do.startChar:
                res = Do.read(s)
                break;

            case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
                res = Number.read(s)
                break;


        }
        return res
    }
}

class Do implements Token {
    constructor(public readonly b: boolean) { }

    static startChar = "d"

    static read(s: string) {
        if (s.startsWith("don't")) {
            return [new Do(false), s.substring(5)] as const
        } else if (s.startsWith("do")) {
            {
                return [new Do(true), s.substring(2)] as const
            }
        } else {
            return [null, s.substring(1)] as const
        }
    }
}

class Mul extends Token {
    static startChar = "m"
    static read(s: string) {
        if (s.startsWith("mul")) {
            return [new Mul(), s.substring(3)] as const
        } else {
            return [null, s.substring(1)] as const
        }
    }
}

class LeftPar extends Token {
    static startChar = "("
    static read(s: string) {
        if (s.startsWith("(")) {
            return [new LeftPar(), s.substring(1)] as const
        } else {
            return [null, s.substring(1)] as const
        }
    }
}

class RightPar implements Token {
    static startChar = ")"
    static read(s: string) {
        if (s.startsWith(")")) {
            return [new RightPar(), s.substring(1)] as const
        } else {
            return [null, s.substring(1)] as const
        }
    }
}

class Comma implements Token {
    static startChar = ","
    static read(s: string) {
        if (s.startsWith(",")) {
            return [new Comma(), s.substring(1)] as const
        } else {
            return [null, s.substring(1)] as const
        }

    }
}

class NoToken implements Token {
}


class Number implements Token {
    constructor(public readonly n: number) { }

    static read(s: string) {
        const match = s.match(/^\d*/);

        if (!match) {
            return [null, s.substring(1)] as const;
        }

        if (match[0].length <= 3) {
            return [new Number(parseInt(match[0])), s.substring(match[0].length)] as const;
        }


        console.error(match[0])
        return [null, s.substring(match[0].length)] as const;

    }
}

const filePath = process.argv[2];
let data = fs.readFileSync(filePath, 'utf8');
console.log(data)

let finished = false
let tokens = new Array<Token>()
while (!finished) {
    const [token, rest] = Token.read(data)

    if (token !== null) {
        tokens.push(token)
    }

    data = rest
    if (data.length === 0) {
        finished = true
    }
}

console.log(tokens)

function readMul(tokens: Token[]) {
    if (tokens.length < 6) {
        return [null, new Array<Token>()] as const
    }

    const [mul, left, n1, comma, n2, right, ...rest] = tokens

    if (!(mul instanceof Mul)) {
        return [null, [left, n1, comma, n2, right, ...rest]] as const
    }
    if (!(left instanceof LeftPar)) {
        return [null, [left, n1, comma, n2, right, ...rest]] as const
    }
    if (!(n1 instanceof Number)) {
        return [null, [n1, comma, n2, right, ...rest]] as const
    }
    if (!(comma instanceof Comma)) {
        return [null, [comma, n2, right, ...rest]] as const
    }
    if (!(n2 instanceof Number)) {
        return [null, [n2, right, ...rest]] as const
    }
    if (!(right instanceof RightPar)) {
        return [null, [right, ...rest]] as const
    }

    console.log(n1.n, "*", n2.n, "=", n1.n * n2.n)
    return [n1.n * n2.n, rest] as const
}

let acc = 0
finished = false
let enabled = true
while (!finished) {
    if (tokens[0] instanceof Do) {
        enabled = tokens[0].b
        console.log('Enabled updated to:', enabled)
        const [, ...rest] = tokens
        tokens = rest
    } else {

        const [res, rest] = readMul(tokens)

        if (res !== null && enabled) {
            console.log("New number:", res)
            acc += res
        }

        if (rest.length === 0) {
            finished = true
        }

        tokens = rest as Token[]
    }
}

console.log(acc)