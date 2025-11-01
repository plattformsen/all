/**
 * `@all/attributes` implements a typed container for
 * key-value pairs, `Attributes`. Each key is represented
 * by an `AttributeKey`, which defines the type of value
 * that can be associated with it.
 *
 * ```ts
 * import { Attributes, AttributeKey } from "@all/attributes";
 *
 * const Name = new AttributeKey(String);
 * const Age = new AttributeKey<number>();
 *
 * const attrs = new Attributes();
 * attrs.set(Name, "Alice");
 * attrs.set(Age, 30);
 *
 * const name = attrs.get(Name); // "Alice" (string)
 * const age = attrs.get(Age);   // 30 (number)
 * ```
 *
 * The Attributes class is also serializable to JSON,
 * allowing for easy storage and transmission of the
 * key-value pairs. But, for serialization, only keys
 * with a name are included.
 *
 * ```ts
 * import { Attributes, AttributeKey } from "@all/attributes";
 *
 * const Name = new AttributeKey("name", String);
 * const Age = new AttributeKey<number>("age");
 *
 * const attrs = new Attributes();
 * attrs.set(Name, "Alice");
 * attrs.set(Age, 30);
 *
 * const json = JSON.stringify(attrs);
 * // '{"name":"Alice","age":30}'
 * ```
 *
 * It's worth noting that Attributes does not check for
 * type consistency or name collisions between different
 * attribute keys.
 *
 * @module
 */

export { default as AttributeKey } from "./attribute_key.ts";
export { default as Attributes } from "./attributes.ts";
