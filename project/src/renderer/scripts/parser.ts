import { NotImplementedError } from "./errors.js";
import { Consumer, IConsumerWithCurrent } from "./helper.js";
import { IToken } from "./lexer.js";

export abstract class ASTSymbols {
    public static readonly IsNode: unique symbol = Symbol.for('ASTSymbols.IsNode')
    public static readonly Interpret: unique symbol = Symbol.for('ASTSymbols.Interpret')
}

export abstract class ASTNode<T extends string, V> {
    [ASTSymbols.IsNode]: boolean = true
    abstract [ASTSymbols.Interpret](): V

    public readonly type: T;

    constructor(type: T) {
        this[ASTSymbols.IsNode] = true
        this.type = type;
    }
}

class TokenConsumer<T extends string> extends Consumer<IToken<T>, T> {
    constructor(value: IToken<T>[]) {
        super(value)
    }

    match(expected: T): this is IConsumerWithCurrent<IToken<T>, T> {
        return this.current?.type === expected
    }
}

export interface ParseFn<T extends string, N extends string, V> {
    (consumer: TokenConsumer<T>, parseRecursive: (name: N) => ASTNode<N, V>): ASTNode<N, V>
}

export class Parser<T extends string, N extends string, V> {
    private enter: N
    private parserFunctions: Partial<Record<N, ParseFn<T, N, V>>>

    constructor(enter: N, parserFunctions: Parser<T, N, V>['parserFunctions']) {
        this.enter = enter;
        this.parserFunctions = parserFunctions
    }

    private createRecursiveParser(consumer: TokenConsumer<T>) {
        const parser = this.parserFunctions 
        const result = function(name: N): ReturnType<ParseFn<T, N, V>> {
            if (parser[name]) {
                return parser[name](consumer, result)
            } else {
                throw new NotImplementedError(`parser(${name})`)
            }
        }
        return result
    }

    public parse(tokens: IToken<T>[]): ASTNode<N, V> {
        const consumer = new TokenConsumer(tokens)
        const recursiveParser = this.createRecursiveParser(consumer)
        return recursiveParser(this.enter)
    }
}