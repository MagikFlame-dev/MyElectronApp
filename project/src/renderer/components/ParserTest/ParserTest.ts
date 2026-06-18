import { HintedString, sumArray } from "@renderer/scripts/helper.js"
import { Interpreter } from "@renderer/scripts/interpreter.js"
import { Lexer, Token, TokensOf } from "@renderer/scripts/lexer.js"
import { Parser, ASTNode, ASTSymbols, ParseFn } from "@renderer/scripts/parser.js"
import { reactive } from "vue"

const lexer = reactive(new Lexer(
    [/\s/, "WS", { runLength: true}],
    [/\d/, 'NUM', { runLength: true }],
    [/:/, 'COLON'],
    [/\(/, 'LPAREN'],
    [/\)/, 'RPAREN'],
    [/[\+\-]/, 'BINOP'],
    [/[a-zA-Z]/, 'TEXT', { runLength: true }],
))
type Tokens = TokensOf<typeof lexer.tokenizer>

type Nodes
    = 'TERM'
    | 'DICE'
    | 'NUMBER'
    | 'EXPRESSION';

class DiceNode extends ASTNode<Nodes, number> {
    private dices: number[]

    public modtype: string = '';
    public modvalue: number = 1;

    [ASTSymbols.Interpret](): number {
        this.rollDices()
        return this.evalDices()
    }
    constructor(
        public count: number,
        public sides: number,
    ) {
        super('DICE')
        this.dices = Array.from(Array(count)).map(() => sides)
    }

    private rollDices(): void {
        for (let i = 0; i < this.dices.length; i++) {
            this.dices[i] = Math.round(Math.random() * this.sides)
        }
        console.log('rolled', this.dices)
    }
    private evalDices(): number {
        switch(this.modtype) {
            case 'dl': {
                const sorted = this.sortedDiceASC().slice(this.modvalue)
                return sumArray(...sorted);
            }
            case 'dh': {
                const sorted = this.sortedDiceDESC().slice(this.modvalue)
                return sumArray(...sorted);
            }
            case 'kl': {
                const sorted = this.sortedDiceASC().slice(0, this.modvalue)
                return sumArray(...sorted);
            }
            case 'kh': {
                const sorted = this.sortedDiceDESC().slice(0, this.modvalue)
                return sumArray(...sorted);
            }
            default: {
                return sumArray(...this.dices)
            }
        }
    }
    private sortedDiceASC() {
        return this.dices.slice().sort((a, b) => a-b)
    }
    private sortedDiceDESC() {
        return this.dices.slice().sort((a, b) => b-a)
    }
}

class NumberNode extends ASTNode<Nodes, number> {
    [ASTSymbols.Interpret](): number {
        return this.value
    }
    constructor(
        public value: number
    ) { super('NUMBER') }
}

class ExpressionNode extends ASTNode<Nodes, number> {
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

const parseExpression: ParseFn<Tokens, Nodes, number> = (consumer, parser) => {
    let node = parser('TERM')
    consumer.skipAll('WS')

    while (consumer.match('BINOP')) {
        consumer.skipAll('WS')
        const op = consumer.consume('BINOP').raw
        consumer.skipAll('WS')
        const right = parser('TERM')
        consumer.skipAll('WS')
        node = new ExpressionNode(node, op, right)
    }

    return node
}

const parseTerm: ParseFn<Tokens, Nodes, number> = (consumer, parser) => {
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
}


const parseDice: ParseFn<Tokens, Nodes, number> = (consumer) => {
    const count = Number(consumer.consume('NUM').raw)
    const text = consumer.consume('TEXT')

    if (!/[dD]/.test(text.raw)) {throw Token.InvalidSyntaxError(text)}

    const sides = Number(consumer.consume('NUM').raw)
    
    // bis hier hin, ursprüngliche auswertung
    const dice = new DiceNode(count, sides)
    
    if (consumer.match('COLON')) {
        consumer.consume('COLON')
        dice.modtype = consumer.consume('TEXT').raw

        // checken ob ein wert für die modifikation überreicht wird
        if (consumer.match('LPAREN')) {
            consumer.consume('LPAREN')
            dice.modvalue = Number(consumer.consume('NUM').raw)
            consumer.consume('RPAREN')
        }
    }

    return dice
}

const parser = reactive(new Parser<Tokens, Nodes, number>(
    'EXPRESSION', {
        'EXPRESSION': parseExpression,
        'TERM': parseTerm,
        'DICE': parseDice,
    }
))

const interpreter = reactive(new Interpreter<number>())

export { lexer, parser, interpreter }