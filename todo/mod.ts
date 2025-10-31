/**
 * `@all/todo` is a one-export module that provides the
 * `Todo` type, a placeholder type representing a to-do
 * item. This type can be used during development when you
 * simply need a generic placeholder type while you work on
 * other parts of your application and eventually circle
 * back to define a more specific structure for your to-do
 * type.
 *
 * ```ts
 * import type Todo from "@all/todo";
 *
 * export type MyPayloadType = Todo;
 *
 * const payload: MyPayloadType = {
 *   testingSomething: 123,
 * };
 * ```
 *
 * @module
 */

/**
 * A placeholder type representing a type that isn't yet
 * defined.
 *
 * @example
 * ```ts
 * import type Todo from "@all/todo";
 *
 * export type MyPayloadType = Todo;
 *
 * const payload: MyPayloadType = {
 *   testingSomething: 123,
 * };
 * ```
 */
// deno-lint-ignore no-explicit-any
type Todo = any;

export default Todo;
