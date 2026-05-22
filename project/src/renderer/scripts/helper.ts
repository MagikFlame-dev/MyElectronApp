import { Component, MaybeRefOrGetter } from "vue";

export function forcePropertyUndefined<T>(o: T, key: keyof T) {
    (o as any)[key] = undefined;
}

export type HintedString<T extends string> = T | (string & {})

export type DeepMaybeRef<T> =
    T extends Function ? T :
    T extends object ? { [K in keyof T]: DeepMaybeRef<T[K]> } :
    T | MaybeRefOrGetter<T>

export type ComponentProps<C extends Component> = C extends new (...args: any) => { $props: infer P } ? P : never

export type ReactiveComponentProps<C extends Component> =
    DeepMaybeRef<ComponentProps<C>>
