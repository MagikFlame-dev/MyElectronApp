import { NotImplementedError } from "@renderer/scripts/errors.js"
import { Lexer, Token, TokensOf } from "@renderer/scripts/lexer.js"
import { Parser, ASTNode, ASTSymbols } from "@renderer/scripts/parser.js"
import { reactive } from "vue"

const lexer = reactive(new Lexer(
    [/\s/, "WS", {collect: true}],
    [/\d/, 'NUM', { collect: true }],
    [/\./, 'DOT'],
    [/,/, 'COMMA'],
    [/:/, 'COLON'],
    [/\(/, 'LPAREN'],
    [/\)/, 'RPAREN'],
    [/\{/, 'LBRACKET'],
    [/\}/, 'RBRACKET'],
    [/;/, 'SEMICOLON'],
    [/=/, 'ASSIGN'],
    [/['"`]/, 'QUOTATION'],
    [/[^;^\s^:^,^=]/, 'WORD', { collect: true }],
    [/[\+\-\*\/\&\|]/, 'BINOP'],
))
type Tokens = TokensOf<typeof lexer.tokenizer>

type Nodes
    = 'BLOCK'
    | 'BINOP'
    | 'NUMBER'
    | 'VAR'
    | 'FUNC'
    | 'KEYWORD'
    | 'START';

class VarNode extends ASTNode<Nodes, number> {
    [ASTSymbols.Interpret](): number {
        return this.node[ASTSymbols.Interpret]()
    }

    constructor(
        public readonly name: string,
        private node: ASTNode<Nodes, number>
    ) { super('VAR') }
}

class NumberNode extends ASTNode<Nodes, number> {
    [ASTSymbols.Interpret](): number {
        return this.value
    }
    
    constructor(
        public value: number
    ) { super('NUMBER') }
}

class BlockNode extends ASTNode<Nodes, number> {
    [ASTSymbols.Interpret](): number {
        throw new Error("Method not implemented.")
    }
}

const parser = reactive(new Parser<Tokens, Nodes, number>(
    'START', {
        'START': (consumer, parse) => {throw new NotImplementedError('BLOCK')},
        'BLOCK': (consumer, parse) => {throw new NotImplementedError('BLOCK')},
        'BINOP': (consumer, parse) => {throw new NotImplementedError('BINOP')},
        'NUMBER': (consumer, parse) => {throw new NotImplementedError('NUMBER')},
        'KEYWORD': (consumer, parse) => {throw new NotImplementedError('FUNC')},
        'VAR': (consumer, parse) => {throw new NotImplementedError('VAR')},
        'FUNC': (consumer, parse) => {throw new NotImplementedError('FUNC')},
    }
))

export { lexer, parser }