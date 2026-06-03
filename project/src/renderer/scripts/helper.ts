import { Component, MaybeRefOrGetter } from "vue";
import { UnexpectedValueError } from "./errors.js";

export function forcePropertyUndefined<T>(o: T, key: keyof T) {
    (o as any)[key] = undefined;
}

export type HintedString<T extends string> = T | (string & {})

export type DeepMaybeRef<T> =
    [T] extends [(...args: any[]) => any]
        ? T
        : [T] extends [readonly any[]]
            ? { [K in keyof T]: DeepMaybeRef<T[K]> }
            : [T] extends [object]
                ? { [K in keyof T]: DeepMaybeRef<T[K]> }
                : MaybeRefOrGetter<T>

export type ComponentProps<C extends Component> = C extends new (...args: any) => { $props: infer P } ? P : never

export type ReactiveComponentProps<C extends Component> =
    DeepMaybeRef<ComponentProps<C>>



export interface IConsumerWithCurrent<Value, Test> extends Consumer<Value, Test> {
    get current(): Value
}
export interface IEOFConsumer<Value, Test> extends Consumer<Value, Test> {
    get current(): undefined
    get next(): undefined
}

export abstract class Consumer<Value, Test, Target extends ArrayLike<Value> = ArrayLike<Value>> {
    protected idx: number
    protected target: Target
    
    public get current(): Value | undefined {
        return this.valueAt(this.idx)
    }

    public peek(offset: number): Value | undefined {
        return this.valueAt(this.idx + offset)
    }

    public get index(): number {
        return this.idx;
    }

    constructor(value: Target) {
        this.target = value
        this.idx = 0
    }

    private valueAt(idx: number): Value | undefined {
        return idx < this.target.length ? this.target[idx] : undefined 
    }

    public hasCurrent(): this is IConsumerWithCurrent<Value, Test> {
        return this.current !== undefined
    }

    public isEof(): this is IEOFConsumer<Value, Test> {
        return this.current === undefined
    }

    public reset() {
        this.idx = 0
    }

    public advance(by: number = 1) {
        this.idx += by
    }

    public expect(expected: Test): boolean {
        if (this.match(expected)) {
            this.advance()
            return true
        }
        throw new UnexpectedValueError(expected, this.current)
    }

    abstract match(expected: Test): this is IConsumerWithCurrent<Value, Test>
}