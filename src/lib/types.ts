export type ArgumentTypes<F extends (...args: unknown[]) => unknown> = F extends (
  ...args: infer A
) => unknown
  ? A
  : never;

export type SuperReturnType<F extends (...args: unknown[]) => unknown> = F extends (
  ...args: unknown[]
) => infer R
  ? R
  : never;

export declare function assumeType<T>(x: unknown): asserts x is T;