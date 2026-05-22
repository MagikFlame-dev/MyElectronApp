type Entry<K extends string, T> = [K, T]
export type RegistryKey<R extends Registry> = keyof R['registry']
export type RegistryValue<R extends Registry, K extends RegistryKey<R>> = R['registry'][K]

export class Registry<T = unknown, R extends Record<string, T> = {}> {
    public readonly registry: Readonly<R>

    static create<T, K extends string>(...entries: Entry<K, T>[]): Registry<T, Record<K, T>> {
        const result = new Registry<T, {}>({})
        return result.register(...entries)
    }
    
    public register<K extends string>(...entries: Entry<K, T>[]): Registry<T, R & Record<K, T>> {
        entries.forEach(entrie => {
            (this.registry as any)[entrie[0]] = entrie[1]
        })
        return this
    }
    public unregister<K extends keyof R>(...names: K[]): this is Registry<T, Omit<R, K>> {
        return names.every(name => {
            delete this.registry[name]
            return true
        })
    }

    public has<K extends keyof R | (string & {})>(name: K): this is Registry<T, R & Record<K, T>> {
        return Object.hasOwn(this.registry, name)
    }
    public get(name: keyof R): T {
        return this.registry[name]
    }

    constructor(intitial: R) {
        this.registry = intitial
    }
}