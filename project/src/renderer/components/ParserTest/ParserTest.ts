import { HintedString } from "@renderer/scripts/helper.js"
import { Interpreter } from "@renderer/scripts/interpreter.js"
import { Lexer, Token, TokensOf } from "@renderer/scripts/lexer.js"
import { Parser, ASTNode, ASTSymbols } from "@renderer/scripts/parser.js"
import { reactive } from "vue"

const lexer = reactive(new Lexer(
    [/\s/, "WS", { runLength: true}],
    [/\d/, 'NUM', { runLength: true }],
    [/:/, 'COLON'],
    [/\(/, 'LPAREN'],
    [/\)/, 'RPAREN'],
    [/[\+\-]/, 'BINOP'],
    [/[\S]/, 'TEXT', { runLength: { until: /[,;='\s\d]/ } }],
))
type Tokens = TokensOf<typeof lexer.tokenizer>

type Nodes
    = 'TERM'
    | 'DICE'
    | 'NUMBER'
    | 'EXPRESSION';

class DiceNode extends ASTNode<Nodes, number> {
    [ASTSymbols.Interpret](): number {
        let res = 0
        for (let i = 0; i < this.count; i++) {
            res += Math.round(Math.random() * this.sides)
        }
        return res
    }
    constructor(
        public count: number,
        public sides: number,
    ) { super('DICE') }
}

class NumberNode extends ASTNode<Nodes, number> {
    [ASTSymbols.Interpret](): number {
        return this.value
    }
    constructor(
        public value: number
    ) { super('NUMBER') }
}

class BinOpNode extends ASTNode<Nodes, number> {
    [ASTSymbols.Interpret](): number {
        const left = this.left[ASTSymbols.Interpret]()
        const right = this.right[ASTSymbols.Interpret]()
        switch(this.operation) {
            case '*': return left * right;
            case '+': return left + right;
            default: throw new Error(`invalid operator ${this.operation}`) 
        }
    }
    constructor(
        public left: ASTNode<Nodes, number>,
        public operation: HintedString<'+' | '-' | '*' | '/'>,
        public right: ASTNode<Nodes, number>,
    ) { super('EXPRESSION') }
}

const parser = reactive(new Parser<Tokens, Nodes, number>(
    'EXPRESSION', {
        'EXPRESSION': (consumer, parser) => {
            let node = parser('TERM')
            consumer.skipAll('WS')

            while (consumer.match('BINOP')) {
                consumer.skipAll('WS')
                const op = consumer.consume('BINOP').raw
                consumer.skipAll('WS')
                const right = parser('TERM')
                consumer.skipAll('WS')
                node = new BinOpNode(node, op, right)
            }

            return node
        },
        'TERM': (consumer, parser) => {
            consumer.skipAll('WS')
            if (consumer.match('NUM')) {
                if (consumer.peek(1)?.type === 'TEXT') {
                    return parser('DICE')
                }
                else {
                    return new NumberNode(Number(consumer.consume('NUM').raw))
                }
            }

            if (consumer.match('LPAREN')) {
                consumer.consume('LPAREN')
                const node = parser('EXPRESSION')
                consumer.consume('RPAREN')
                return node
            }

            throw Token.InvalidSyntaxError(consumer.current)
        },
        'DICE': (consumer) => {
            let count = 1
            if (consumer.match('NUM')) {
                count = Number(consumer.consume('NUM').raw)
            }

            const token = consumer.consume('TEXT')
            if (!/[dD]/.test(token.raw)) {
                throw Token.InvalidSyntaxError(token)
            }
            const sides = Number(consumer.consume('NUM').raw)
            
            return new DiceNode(count, sides)
        }
    }
))

const interpreter = reactive(new Interpreter<number>())

export { lexer, parser, interpreter }