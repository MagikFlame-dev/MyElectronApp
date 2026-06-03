export class UnexpectedValueError extends Error {
    constructor(expected: unknown, actual: unknown) {
        super(`Expected ${expected}, but got ${actual}!`)
        this.name = 'UnexpectedValueError'
    }
}
export class InvalidSyntaxError extends Error {
    constructor(value: unknown, row: number, pos: number) {
        super(`Invalid Syntax ${value} at ${row}:${pos}!`)
        this.name = 'InvalidSyntaxError'
    }
}
export class NotImplementedError extends Error {
    constructor(functionName: string) {
        super(`${functionName} not implemented!`)
        this.name = 'NotImplementedError'
    }
}