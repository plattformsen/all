import type { StrictConstructorOf } from "./types.ts";

const ROOT_CLASS = Object.getPrototypeOf({}).constructor;

/**
 * Gets the class (constructor function) of a value.
 *
 * @param value The value to get the class of.
 * @returns The class (constructor function) of the value.
 *          If the value is `null` or `undefined`,
 *          `undefined` is returned. If the value does not
 *          have a backing class with a constructor,
 *          `undefined` is returned.
 */
export function classOf(
  value: unknown,
): StrictConstructorOf<unknown> | undefined {
  if (value === null || value === undefined) return undefined;
  return Object.getPrototypeOf(value)?.constructor;
}

/**
 * Gets all superclasses of a given class (constructor
 * function). The returned set includes the root class
 * (`Object`), but does not include the given class itself.
 *
 * @param value The class (constructor function) to get
 *              the superclasses of.
 * @returns A set of all superclasses of the given class.
 */
export function superclassesOfType(
  value: StrictConstructorOf<unknown>,
): Set<StrictConstructorOf<unknown>> {
  const superclasses = new Set<StrictConstructorOf<unknown>>();

  while (
    (value = Object.getPrototypeOf(value.prototype)?.constructor) &&
    value !== ROOT_CLASS
  ) {
    superclasses.add(value);
  }

  superclasses.add(ROOT_CLASS);

  return superclasses;
}
