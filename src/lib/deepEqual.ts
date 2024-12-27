/**
 * ignores `undefined` properties
 */
export default function deepEqual<T>(x: T, y: T, ignoreKeys?: (keyof T)[]): boolean {
  const ignoreSet = ignoreKeys ? new Set(ignoreKeys) : undefined;
  const okok = (obj: Record<string, unknown>) => Object.keys(obj).filter((key) => obj[key] !== undefined);
  const ok = ignoreKeys ? (obj: Record<string, unknown>) => okok(obj).filter((key) => ignoreSet && !ignoreSet.has(key as keyof T)) : okok,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
      ok(x).every((key) => deepEqual((x as Record<string, T>)[key], (y as Record<string, T>)[key], ignoreKeys))
  ) : (x === y);
}
