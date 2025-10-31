/**
 * `@all/awaitable` is a one-export module that provides the `Awaitable` type,
 * which represents a value that can be either a direct value of type `T`,
 * a `Promise` resolving to `T`, or a `PromiseLike` object.
 *
 * This type is particularly useful in scenarios where a function may return
 * either a synchronous value or an asynchronous one, allowing for greater
 * flexibility in handling different return types.
 *
 * ```ts
 * import type Awaitable from "@all/awaitable";
 *
 * function fetchData(): Awaitable<string> {
 *   if (Math.random() > 0.5) {
 *     return "Immediate Data"; // Synchronous return
 *   } else {
 *     // Asynchronous return
 *     return new Promise((resolve) => {
 *       setTimeout(() => resolve("Async Data"), 1000);
 *     });
 *   }
 * }
 * ```
 *
 * @module
 */

/**
 * A type that represents a value of type {@link T} that may be a
 * {@link Promise}, {@link PromiseLike} or {@link T}.
 *
 * @example
 * ```ts
 * import type Awaitable from "@all/awaitable";
 *
 * function fetchData(): Awaitable<string> {
 *   if (Math.random() > 0.5) {
 *     return "Immediate Data"; // Synchronous return
 *   } else {
 *     // Asynchronous return
 *     return new Promise((resolve) => {
 *       setTimeout(() => resolve("Async Data"), 1000);
 *     });
 *   }
 * }
 */
type Awaitable<T> = T | PromiseLike<T> | Promise<T>;

export default Awaitable;
