export type ArgumentTypes<F extends Function> = F extends (
  ...args: infer A
) => any
  ? A
  : never;
export type SuperReturnType<F extends Function> = F extends (
  ...args: any
) => any
  ? ReturnType<F>
  : never;
export declare function assumeType<T>(x: unknown): asserts x is T;
