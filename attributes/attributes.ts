import type AttributeKey from "./attribute_key.ts";

/**
 * An Attributes instance is a collection of typed
 * attributes identified by their AttributeKey(s).
 */
export default class Attributes {
  #map = new Map<AttributeKey, unknown>();

  /** Clears all attributes from this instance. */
  public clear(): void {
    this.#map.clear();
  }

  /**
   * Deletes the attribute identified by the given key.
   *
   * @param key The attribute key.
   * @returns `true` if an attribute with the given key
   *          existed and was deleted.
   */
  public delete(key: AttributeKey): boolean {
    return this.#map.delete(key);
  }

  /**
   * Returns an iterable of key, value pairs for every
   * attribute in this instance.
   *
   * @returns An iterable of key, value pairs.
   */
  public entries(): MapIterator<[AttributeKey, unknown]> {
    return this.#map.entries();
  }

  /**
   * Iterates over each attribute in this instance,
   * calling the given callback with the attribute's
   * value and key.
   *
   * @param callback The callback to call for each
   *                 attribute.
   * @param thisArg An optional `this` argument for the
   *                callback.
   */
  public forEach(
    callback: <T>(value: T, key: AttributeKey<T>) => void,
  ): void;

  /**
   * Iterates over each attribute in this instance,
   * calling the given callback with the attribute's
   * value and key.
   *
   * @param callback The callback to call for each
   *                 attribute.
   * @param thisArg An optional `this` argument for the
   *                callback.
   */
  public forEach<This = unknown>(
    callback: <T>(
      this: This,
      value: T,
      key: AttributeKey<T>,
      source: Attributes,
    ) => void,
    thisArg: This,
  ): void;

  public forEach<This = unknown>(
    callback: <T>(
      this: This,
      value: T,
      key: AttributeKey<T>,
      source: Attributes,
    ) => void,
    thisArg?: This,
  ): void {
    for (const [key, value] of this.#map) {
      callback.call(thisArg as This, value, key, this);
    }
  }

  /**
   * Gets the attribute value identified by the given key.
   *
   * @param key The attribute key.
   * @returns The attribute value, or `undefined` if no
   *          attribute with the given key exists.
   */
  public get<T>(key: AttributeKey<T>): T | undefined {
    return this.#map.get(key) as T | undefined;
  }

  /**
   * Gets the attribute value identified by the given key,
   * or throws if no such attribute exists.
   *
   * @param key The attribute key.
   * @returns The attribute value.
   * @throws If no attribute with the given key exists.
   */
  public getOrThrow<T>(key: AttributeKey<T>): T {
    if (!this.#map.has(key)) {
      throw new Error(
        `Attribute with key${key.name ? ` "${key.name}"` : ""} not found`,
      );
    }
    return this.#map.get(key) as T;
  }

  /**
   * Gets the attribute value identified by the given key,
   * or returns the given default value if no such attribute
   * exists.
   *
   * The default value is returned as-is; it is not stored
   * in the Attributes instance.
   *
   * @param key The attribute key.
   * @param defaultValue The default value to return if
   *                     no such attribute exists.
   * @returns The attribute value, or the default value.
   */
  public getOrDefault<T>(
    key: AttributeKey<T>,
    defaultValue: T,
  ): T {
    if (!this.#map.has(key)) {
      return defaultValue;
    }
    return this.#map.get(key) as T;
  }

  /**
   * Gets the attribute value identified by the given key,
   * or sets and returns the given value if no such
   * attribute exists.
   *
   * @param key The attribute key.
   * @param value The value to set and return if no such
   *              attribute exists.
   * @returns The attribute value.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/getOrInsert
   */
  public getOrInsert<T>(
    key: AttributeKey<T>,
    value: T,
  ): T {
    if (!this.#map.has(key)) {
      this.#map.set(key, value);
      return value;
    }
    return this.#map.get(key) as T;
  }

  /**
   * Gets the attribute value identified by the given key,
   * or computes, sets, and returns the value from the
   * given function if no such attribute exists.
   *
   * @param key The attribute key.
   * @param value The function to compute, set, and
   *              return the value if no such attribute
   *              exists.
   * @returns The attribute value.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/getOrInsertComputed
   */
  public getOrInsertComputed<T>(
    key: AttributeKey<T>,
    value: () => T,
  ): T {
    if (!this.#map.has(key)) {
      const computed = value();
      this.#map.set(key, computed);
      return computed;
    }
    return this.#map.get(key) as T;
  }

  /**
   * Checks whether an attribute with the given key exists
   * in this instance.
   *
   * @param key The attribute key.
   * @returns `true` if an attribute with the given key
   *          exists, `false` otherwise.
   */
  public has(key: AttributeKey): boolean {
    return this.#map.has(key);
  }

  // keys(): MapIterator<AttributeKey>;
  /**
   * Returns an iterable of all attribute keys in this
   * instance.
   *
   * @returns An iterable of all attribute keys.
   */
  public keys(): MapIterator<AttributeKey> {
    return this.#map.keys();
  }

  /**
   * Sets the attribute value identified by the given key.
   *
   * @param key The attribute key.
   * @param value The attribute value.
   */
  public set<T>(key: AttributeKey<T>, value: T): void {
    this.#map.set(key, value);
  }

  /**
   * Returns an iterable of all attribute values in this
   * instance.
   *
   * @returns An iterable of all attribute values.
   */
  public values(): MapIterator<unknown> {
    return this.#map.values();
  }

  /**
   * Returns an iterator over the key, value pairs of
   * attributes in this instance.
   *
   * @returns An iterator over the key, value pairs.
   */
  public [Symbol.iterator](): MapIterator<[AttributeKey, unknown]> {
    return this.#map[Symbol.iterator]();
  }

  /**
   * The number of attributes in this instance.
   */
  public get size(): number {
    return this.#map.size;
  }

  /**
   * Returns a JSON-serializable representation of this
   * Attributes instance.
   *
   * Note that any attribute without a name will not be
   * included in the output.
   *
   * Also note: conflicting attribute names will overwrite
   * each other in the output.
   *
   * @returns A JSON-serializable representation.
   */
  public toJSON(): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of this.#map) {
      if (key.name === undefined) continue;
      obj[key.name] = value;
    }
    return obj;
  }

  /**
   * The string tag of this Attributes instance.
   */
  public get [Symbol.toStringTag](): string {
    return "Attributes";
  }
}
