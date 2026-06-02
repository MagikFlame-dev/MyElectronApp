import { Component, MaybeRefOrGetter } from "vue";

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

export class KeyPressStack {
    private pressedIndizes: {[key: string]: number}
    private pressed: string[]
    
    constructor() {
        this.pressedIndizes = {}
        this.pressed = []
    }

    add(key: string) {
        if (!this.pressed.includes(key)) {
            this.pressed.push(key)
            this.pressedIndizes[key] = (this.pressed.length - 1)
        }
    }
    remove(key: string) {
        this.pressed.splice(this.pressedIndizes[key], 1)
        delete this.pressedIndizes[key]
    }

    isShortCut(...keys: string[]): boolean {
        let shortCutIndex = 0

        console.log(`testing short-cut:${keys}`);

        for (const key of this.pressed) {
            console.log(key)
            if (keys[shortCutIndex].toLowerCase() === key.toLowerCase()) {
                shortCutIndex++
            }
            if (shortCutIndex === keys.length) {
                return true
            }
        }
        return false
    }
}