/**
 * A type representing a class constructor for type
 * {@link T}.
 */
export type StrictConstructorOf<T> =
  // deno-lint-ignore no-explicit-any
  | (abstract new (...args: any[]) => T)
  // deno-lint-ignore no-explicit-any
  | (new (...args: any[]) => T)
  // deno-lint-ignore no-explicit-any
  | { new (...args: any[]): T };

/**
 * Infers the instance type created by a given constructor
 * type {@link C}.
 */
// deno-lint-ignore no-explicit-any
export type StrictInstanceOf<C extends StrictConstructorOf<any>> = C extends // deno-lint-ignore no-explicit-any
new (...args: any[]) => infer T ? T
  // deno-lint-ignore no-explicit-any
  : C extends { new (...args: any[]): infer T } ? T
  // deno-lint-ignore no-explicit-any
  : C extends abstract new (...args: any[]) => infer T ? T
  : never;

/**
 * A type representing a class constructor or factory
 * function for type {@link T}. This is used by TypeScript's
 * primitive types (e.g., String, Number, Boolean, BigInt).
 */
export type ConstructorOf<T> =
  | StrictConstructorOf<T>
  // deno-lint-ignore no-explicit-any
  | { (...args: any[]): T };

/**
 * Infers the instance type created by a given constructor
 * or factory function type {@link C}.
 */
// deno-lint-ignore no-explicit-any
export type InstanceOf<C extends ConstructorOf<any>> = C extends // deno-lint-ignore no-explicit-any
{ (...args: any[]): infer T } ? T
  // deno-lint-ignore no-explicit-any
  : C extends StrictConstructorOf<any> ? StrictInstanceOf<C>
  : never;
