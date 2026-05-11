export function forcePropertyUndefined<T>(o: T, key: keyof T) {
    (o as any)[key] = undefined;
}