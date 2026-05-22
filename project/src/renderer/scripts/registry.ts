type Entry<K extends string, T> = readonly [K, T] | [K, T, ...any[]]

export class Registry<T, R extends Record<string, T> = {}> {
    static create<T, K extends string>(...entries: Entry<K, T>[]): Registry<T, Record<K, T>> {
        const result = new Registry<T, {}>({})
        return result.register(...entries)
    }

    private registry: R

    public register<K extends string>(...entries: Entry<K, T>[]): Registry<T, R & Record<K, T>> {
        entries.forEach(entrie => {
            (this.registry as any)[entrie[0]] = entrie[1]
        })
        return this
    }
    public unregister<K extends keyof R>(...names: (K)[]): Registry<T, Omit<R, K>> {
        names.forEach(name => {
            delete this.registry[name]
        })
        return this
    }

    public has<K extends keyof R | string>(name: K): this is Registry<T, R & Record<K, T>> {
        return Object.hasOwn(this.registry, name)
    }
    public get(name: keyof R): T {
        return this.registry[name]
    }

    constructor(intitial: R) {
        this.registry = intitial
    }
}