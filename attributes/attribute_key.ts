// We use ES5 syntax to allow usage without new keyword
// here, i.e. `const key = AttributeKey<number>();` While
// still allowing `new` and proper prototype chain.
// `const key = new AttributeKey<number>();` is also valid.
// `key instanceof AttributeKey` will be true in both cases.

import type { ConstructorOf, InstanceOf } from "@all/reflection";

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

/**
 * Creates a new AttributeKey with a value type of
 * {@link T}, with no attribute name.
 *
 * @returns A new AttributeKey instance.
 */
export function AttributeKey<T>(): AttributeKey<T>;

/**
 * Creates a new AttributeKey with a value type of
 * {@link InstanceOf<C> InstanceType}<{@link C}>, with no
 * attribute name.
 *
 * @param constructor The constructor function of the
 *                    attribute type.
 * @returns A new AttributeKey instance.
 */
export function AttributeKey<C extends ConstructorOf>(
  constructor: C,
): AttributeKey<InstanceOf<C>>;

/**
 * Creates a new AttributeKey with a value type of
 * {@link T}, with the given attribute name.
 *
 * @param name The name of the attribute.
 * @returns A new AttributeKey instance.
 */
export function AttributeKey<T>(name: string): AttributeKey<T>;

/**
 * Creates a new AttributeKey with a value type of
 * {@link InstanceOf<C> InstanceType}<{@link C}>, with
 * the given attribute name.
 *
 * @param name The name of the attribute.
 * @param constructor The constructor function of the
 *                    attribute type.
 * @returns A new AttributeKey instance.
 */
export function AttributeKey<C extends ConstructorOf>(
  constructor: C,
  name: string,
): AttributeKey<InstanceOf<C>>;

/**
 * Creates a new AttributeKey with a value type of
 * {@link InstanceOf<C> InstanceType}<{@link C}>, with
 * the given attribute name.
 *
 * @param name The name of the attribute.
 * @param constructor The constructor function of the
 *                    attribute type.
 * @returns A new AttributeKey instance.
 */
export function AttributeKey<C extends ConstructorOf>(
  name: string,
  constructor: C,
): AttributeKey<InstanceOf<C>>;

export function AttributeKey<T>(
  this: AttributeKey<T>,
  arg1?: string | ConstructorOf<T>,
  arg2?: string | ConstructorOf<T>,
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
