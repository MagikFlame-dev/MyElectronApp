import { InvalidSyntaxError } from "./errors.js";
import { Consumer, IConsumerWithCurrent } from "./helper.js";

export type TokensOf<T extends readonly TokenDef<string>[]> =
    T[number] extends [any, infer U, any?]
        ? U extends string
            ? U
            : U extends () => any
                ? ReturnType<U>
                : never
        : never;

export interface IToken<T extends string = string> {
    readonly type: T;
    readonly row: number;
    readonly pos: number;
    readonly raw: string;
}

export class Token<T extends string> implements IToken<T> {
    static InvalidSyntaxError<T extends string>(token?: Token<T>): InvalidSyntaxError {
        return new InvalidSyntaxError(`${token?.raw}`, Number(token?.row), Number(token?.pos))
    }

    public readonly type: T;
    
    public readonly row: number;
    public readonly pos: number;

    public readonly raw: string;

    constructor(data: {type: T, row: Token<T>['row'], pos: Token<T>['pos'], value: Token<T>['raw']}) {
        this.type = data.type;
        this.raw = data.value
        this.row = data.row
        this.pos = data.pos
    }

    toString(): string {
        return this.raw.trim() ? `${this.type}(${this.raw})` : this.type
    }
}

interface TokenizerOptions {
    runLength?: boolean | { max?: number, until?: string | RegExp }
}

type TokenDef<T extends string> = [
    start: string | RegExp,
    tokenizer: ((consumer: Consumer<string, string | RegExp>) => Token<T>),
] | [
    start: string | RegExp,
    tokenType: T,
    options?: TokenizerOptions
]

const CollectTokenizer = <T extends string>(consumer: StringConsumer, expected: string | RegExp, tokenType: T, runLength?: { max?: number, until?: string | RegExp }): Token<T> => {
    let collection: string[] = []
    const pos = consumer.getPosition()
    let count = 0
    while(consumer.match(expected)) {
        if ((runLength?.until !== undefined) && consumer.match(runLength.until)) {
            break;
        }
        if ((runLength?.max ?? -1) >= count) {
            break;
        }
        collection.push(consumer.current)
        consumer.advance()
    }
    const result = new Token({
        type: tokenType, 
        value: collection.join(''),
        row: pos.row,
        pos: pos.pos,
    })
    return result;
}
const DefaultTokenizer = <T extends string>(consumer: StringConsumer, tokenType: T): Token<T> => {
    const pos = consumer.getPosition()
    const result = new Token({
        type: tokenType,
        value: consumer.current ?? '',
        row: pos.row,
        pos: pos.pos,
    })
    return result;
}

class StringConsumer extends Consumer<string, string | RegExp, string> {
    private textPosition: [row: number, pos: number]
    
    constructor(value: string) {
        super(value)
        this.textPosition = [0, 0]
    }

    override advance(by = 1): void {
        for (let i = 0; i < by; i++) {
            const c = this.target[this.idx]

            if (c === '\n') {
                this.textPosition[0]++
                this.textPosition[1] = 0
            } else {
                this.textPosition[1]++
            }

            this.idx++
        }
    }

    getPosition(): {row: number, pos: number} {
        return {
            row: this.textPosition[0],
            pos: this.textPosition[1],
        }
    }

    match(expected: string | RegExp): this is IConsumerWithCurrent<string, string | RegExp> {
        return (this.current !== undefined) && (typeof expected === 'string' ? expected === this.current : expected.test(this.current))
    }
}

export class Lexer<Tokens extends string> {
    public readonly tokenizer: readonly TokenDef<Tokens>[]

    constructor(...tokenizer: Lexer<Tokens>['tokenizer']) {
        this.tokenizer = tokenizer
        this.tokenizer.forEach(t => {
            if (t[0] instanceof RegExp) {
                t[0] = new RegExp(t[0].source, t[0].flags.replace('g', ''))
            }
        })
    }

    public analyse(str: string): Token<Tokens>[] {
        const result: Token<Tokens>[] = []
        const consumer = new StringConsumer(str)

        while(!consumer.isEof()) {
            /** TODO Performance im Auge behalten, evtl. Suchalgorithmus für tokeneizer verbessern */
            const tokenizer = this.tokenizer.find(t => consumer.match(t[0]))

            if (!tokenizer) {
                throw new Error(`Unexpected Value "${consumer.current}"`)
            }

            if (typeof tokenizer[1] === 'function') {
                result.push(tokenizer[1](consumer))
                consumer.advance()
                continue
            }
            else if (tokenizer[2]?.runLength) {
                result.push(CollectTokenizer<Tokens>(consumer, tokenizer[0], tokenizer[1], !(typeof tokenizer[2].runLength === 'boolean') ? tokenizer[2].runLength : {} ))
                continue
            }
            else {
                result.push(DefaultTokenizer<Tokens>(consumer, tokenizer[1]))
                consumer.advance()
            }
        }

        return result;
    }
}