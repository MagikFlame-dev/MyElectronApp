import { ASTNode, ASTSymbols } from "./parser.js";

export class Interpreter<V> {
    public interpret(tree: ASTNode<any, V>): V {
        return tree[ASTSymbols.Interpret]()
    }
}