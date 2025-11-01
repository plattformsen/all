// We use ES5 syntax to allow usage without new keyword
// here, i.e. `const key = AttributeKey<number>();` While
// still allowing `new` and proper prototype chain.
// `const key = new AttributeKey<number>();` is also valid.
// `key instanceof AttributeKey` will be true in both cases.

// deno-lint-ignore no-explicit-any
type Constructor<T = any> =
  // deno-lint-ignore no-explicit-any
  | (abstract new (...args: any[]) => T)
  // deno-lint-ignore no-explicit-any
  | (new (...args: any[]) => T)
  // deno-lint-ignore no-explicit-any
  | { new (...args: any[]): T }
  // deno-lint-ignore no-explicit-any
  | { (...args: any[]): T };

// deno-lint-ignore no-explicit-any
type InstanceOf<C extends Constructor<any>> = C extends // deno-lint-ignore no-explicit-any
{ (...args: any[]): infer T } ? T
  // deno-lint-ignore no-explicit-any
  : C extends new (...args: any[]) => infer T ? T
  // deno-lint-ignore no-explicit-any
  : C extends { new (...args: any[]): infer T } ? T
  // deno-lint-ignore no-explicit-any
  : C extends abstract new (...args: any[]) => infer T ? T
  : never;

/**
 * An attribute key is used to uniquely identify a type-safe
 * attribute in an Attributes instance.
 */
export interface AttributeKey<T = unknown> {
  /** The symbol associated with this attribute. */
  readonly symbol: symbol;
  /** An optional describing name of the attribute. */
  readonly name?: string;
}

export function AttributeKey<T>(): AttributeKey<T>;
export function AttributeKey<C extends Constructor>(
  constructor: C,
): AttributeKey<InstanceOf<C>>;
export function AttributeKey<T>(name: string): AttributeKey<T>;
export function AttributeKey<
  // deno-lint-ignore no-explicit-any
  C extends abstract new (...args: any[]) => unknown,
>(
  name: string,
  constructor: C,
): AttributeKey<InstanceOf<C>>;
export function AttributeKey<C extends Constructor>(
  constructor: C,
  name: string,
): AttributeKey<InstanceOf<C>>;
export function AttributeKey<T>(
  this: AttributeKey<T>,
  arg1?: string | Constructor<T>,
  arg2?: string | Constructor<T>,
): AttributeKey<T> {
  const typeofArg1 = typeof arg1;
  const typeofArg2 = typeof arg2;

  if (typeofArg1 === "string" && typeofArg2 === "string") {
    throw new TypeError("AttributeKey cannot have two names");
  }

  const name = typeofArg1 === "string"
    ? arg1 as string
    : typeofArg2 === "string"
    ? arg2 as string
    : undefined;

  const symbol = Symbol(name);

  const self: AttributeKey<T> = new.target
    ? this as AttributeKey<T>
    : Object.create(AttributeKey.prototype);

  Object.defineProperty(self, "symbol", {
    writable: false,
    enumerable: true,
    configurable: false,
    value: symbol,
  });

  Object.defineProperty(self, "name", {
    writable: false,
    enumerable: true,
    configurable: false,
    value: name,
  });

  Object.freeze(self);

  return self;
}

Object.defineProperty(AttributeKey.prototype, Symbol.toStringTag, {
  writable: false,
  enumerable: false,
  configurable: false,
  value: "AttributeKey",
});

function toString(this: AttributeKey<unknown>): string {
  return `AttributeKey(${this.name ?? ""})`;
}

Object.defineProperty(AttributeKey.prototype, "toString", {
  writable: false,
  enumerable: false,
  configurable: false,
  value: toString,
});

const unscopable = {
  symbol: true,
  name: true,
  toString: true,
};

Object.freeze(unscopable);

Object.defineProperty(AttributeKey.prototype, Symbol.unscopables, {
  writable: false,
  enumerable: false,
  configurable: false,
  value: unscopable,
});

Object.freeze(AttributeKey.prototype);
Object.freeze(AttributeKey);

export default AttributeKey;
