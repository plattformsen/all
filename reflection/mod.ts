/**
 * `@all/reflection` adds types and utilities for runtime
 * type introspection and reflection in TypeScript.
 *
 * ```ts
 * import { classOf, superclassesOfType } from "@all/reflection";
 *
 * console.log(classOf([]));
 * // [Function: Array]
 *
 * console.log(superclassesOfType(Array));
 * // Set { [Function: Object] }
 *
 * class A {}
 * class B extends A {}
 * class C extends B {}
 *
 * console.log(superclassesOfType(C));
 * // Set {
 * //   [class B extends A],
 * //   [class A],
 * //   [Function: Object],
 * // }
 * ```
 *
 * @module
 */

export * from "./types.ts";
export * from "./classes.ts";
