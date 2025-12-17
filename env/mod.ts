/**
 * `@all/env` provides utilities for retrieving and
 * transforming environment variables in a type-safe manner.
 * It supports both Deno and Node.js/Bun environments,
 * allowing developers to easily access environment
 * variables with custom transformations.
 *
 * ```ts
 * import { env, required, optional, string, number } from "@all/env";
 *
 * const port = env("PORT", required(number));
 * const host = env("HOST", optional(string)) ?? "127.0.0.1";
 *
 * console.log(`Server running at http://${host}:${port}`);
 *
 * const DATABASE_URL = env("DATABASE_URL", required(string));
 *
 * console.log(`Database URL: ${DATABASE_URL}`);
 * ```
 *
 * @module
 */

/**
 * A transformer function that takes an environment variable
 * key and its value, and transforms it into a desired
 * output type.
 *
 * @template I The input type, which can be `string` or
 *             `undefined`.
 * @template O The output type after transformation.
 */
export type Transformer<I, O> = (
  key: string,
  value: I,
) => O;

const proc = (globalThis as {
  process?: { env: Record<string, string | undefined> };
}).process;

/**
 * Retrieves the value of an environment variable by its
 * key.
 *
 * @param key The environment variable key.
 * @returns The value of the environment variable, or
 *          `undefined` if not found.
 */
function getEnvironmentVariableValue(key: string): string | undefined {
  if (
    typeof Deno !== "undefined" && Deno.env &&
    typeof Deno.env.get === "function"
  ) {
    return Deno.env.get(key);
  } else if (typeof proc !== "undefined" && proc.env) {
    return proc.env[key];
  }
  return undefined;
}

/**
 * Retrieves and transforms an environment variable using
 * the provided transformer.
 *
 * @param key The environment variable key.
 * @param transformer The transformer function to convert
 *                    the environment variable value.
 * @template T The output type after transformation.
 * @returns The transformed environment variable value.
 */
export function env<T>(
  key: string,
  transformer: Transformer<string | undefined, T>,
): T {
  const value = getEnvironmentVariableValue(key);
  return transformer(key, value);
}

/**
 * Transforms an optional environment variable using the
 * provided transformer. If the variable is not set, it
 * returns `undefined`.
 *
 * @param transformer The transformer function to convert
 *                    the environment variable value.
 * @param defaultValue An optional default value if the
 *                     environment variable is not set.
 * @template T The output type after transformation.
 * @returns A transformer that handles optional values.
 */
export function optional<T, DT extends T>(
  transformer: Transformer<string, T>,
  defaultValue: DT,
): Transformer<string | undefined, Exclude<T, undefined> | DT>;

/**
 * Transforms an optional environment variable using the
 * provided transformer. If the variable is not set, it
 * returns `undefined`.
 *
 * @param transformer The transformer function to convert
 *                    the environment variable value.
 * @template T The output type after transformation.
 * @returns A transformer that handles optional values.
 */
export function optional<T>(
  transformer: Transformer<string, T>,
): Transformer<string | undefined, T | undefined>;

export function optional<T>(
  transformer: Transformer<string, T>,
  defaultValue?: T,
): Transformer<string | undefined, T | undefined> {
  return (key, value) => {
    if (value === undefined) return defaultValue;
    const transformedValue = transformer(key, value);
    return transformedValue === undefined ? defaultValue : transformedValue;
  };
}

/**
 * Transforms a required environment variable using the
 * provided transformer. If the variable is not set, it
 * throws an error.
 *
 * @param transformer The transformer function to convert
 *                    the environment variable value.
 * @template T The output type after transformation.
 * @returns A transformer that ensures the value is present.
 */
export function required<T>(
  transformer: Transformer<string, T>,
): Transformer<string | undefined, Exclude<T, undefined>> {
  return (key, value) => {
    if (value === undefined) {
      throw new Error(`Environment variable "${key}" is required.`);
    }
    const transformedValue = transformer(key, value);
    if (transformedValue === undefined) {
      throw new Error(`Environment variable "${key}" is required.`);
    }
    return transformedValue as Exclude<T, undefined>;
  };
}

/**
 * Transforms the environment variable value to a string.
 *
 * Strings will be trimmed of whitespace by default, and
 * empty strings will be treated as `undefined`.
 *
 * @param _key The environment variable key.
 * @param value The environment variable value.
 * @returns The string value.
 */
export function string(_key: string, value: string): string | undefined {
  value = value.trim();
  return value === "" ? undefined : value;
}

/**
 * Transforms the environment variable value to a number.
 *
 * @param key The environment variable key.
 * @param value The environment variable value.
 * @returns The number value.
 * @throws If the value cannot be parsed as a number.
 */
export function number(key: string, value: string): number {
  const parsed = Number(value.trim());

  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable "${key}" is not a valid number.`);
  }

  return parsed;
}

/**
 * Transforms the environment variable value to a boolean.
 *
 * Recognizes the following case-insensitive values as
 * `true`: `1`, `true`, `t`, `yes`, `y`, `on`, `enable`,
 * `enabled`.
 *
 * Recognizes the following case-insensitive values as
 * `false`: `0`, `false`, `f`, `no`, `n`, `off`, `disable`,
 * `disabled`.
 *
 * @param key The environment variable key.
 * @param value The environment variable value.
 * @returns The boolean value.
 * @throws If the value cannot be parsed as a boolean.
 */
export function boolean(key: string, value: string): boolean {
  const lower = value.trim().toLowerCase();
  if (
    lower === "1" ||
    lower === "true" ||
    lower === "t" ||
    lower === "yes" ||
    lower === "y" ||
    lower === "on" ||
    lower === "enable" ||
    lower === "enabled"
  ) {
    return true;
  } else if (
    lower === "0" ||
    lower === "false" ||
    lower === "f" ||
    lower === "no" ||
    lower === "n" ||
    lower === "off" ||
    lower === "disable" ||
    lower === "disabled"
  ) {
    return false;
  } else {
    throw new Error(
      `Environment variable "${key}" is not a valid boolean.`,
    );
  }
}

/**
 * Options for creating a CryptoKey.
 */
export interface CryptoKeyOptions {
  /**
   * The format of the key.
   *
   * @remarks
   * Only "raw" is supported in this context.
   *
   * @default "raw"
   */
  format?: "raw";

  /**
   * The algorithm of the key.
   */
  algorithm:
    | AlgorithmIdentifier
    | RsaHashedImportParams
    | EcKeyImportParams
    | HmacImportParams
    | AesKeyAlgorithm;

  /**
   * Whether the key is extractable.
   *
   * @default false
   */
  extractable?: boolean;

  /**
   * The intended usages of the key.
   */
  keyUsages: KeyUsage[];
}

const textEncoder = new TextEncoder();

/**
 * Transforms the environment variable value to a CryptoKey.
 * @param options The options for creating the CryptoKey.
 */
export function cryptoKey(
  options: CryptoKeyOptions,
): Transformer<string, Promise<CryptoKey>> {
  return async (_key: string, value: string): Promise<CryptoKey> => {
    const rawKey = textEncoder.encode(value);
    return await crypto.subtle.importKey(
      options.format ?? "raw",
      rawKey,
      options.algorithm,
      options.extractable ?? false,
      options.keyUsages,
    );
  };
}

/**
 * Predefined CryptoKey transformer for HMAC with SHA-256.
 */
export const Sha256HmacCryptoKey: Transformer<string, Promise<CryptoKey>> =
  cryptoKey({
    format: "raw",
    algorithm: { name: "HMAC", hash: "SHA-256" },
    keyUsages: ["sign", "verify"],
  });

/**
 * Predefined CryptoKey transformer for HMAC with SHA-512.
 */
export const Sha512HmacCryptoKey: Transformer<string, Promise<CryptoKey>> =
  cryptoKey({
    format: "raw",
    algorithm: { name: "HMAC", hash: "SHA-512" },
    keyUsages: ["sign", "verify"],
  });

/**
 * Predefined CryptoKey transformer for AES-GCM-128.
 *
 * @remarks
 * The key length must be 16 bytes (128 bits).
 */
export const AesGcm128CryptoKey: Transformer<string, Promise<CryptoKey>> =
  cryptoKey({
    format: "raw",
    algorithm: { name: "AES-GCM", length: 128 },
    keyUsages: ["encrypt", "decrypt"],
  });

/**
 * Predefined CryptoKey transformer for AES-GCM-192.
 *
 * @remarks
 * The key length must be 24 bytes (192 bits).
 */
export const AesGcm256CryptoKey: Transformer<string, Promise<CryptoKey>> =
  cryptoKey({
    format: "raw",
    algorithm: { name: "AES-GCM", length: 192 },
    keyUsages: ["encrypt", "decrypt"],
  });

/**
 * Predefined CryptoKey transformer for AES-GCM-256.
 *
 * @remarks
 * The key length must be 32 bytes (256 bits).
 */
export const AesGcm192CryptoKey: Transformer<string, Promise<CryptoKey>> =
  cryptoKey({
    format: "raw",
    algorithm: { name: "AES-GCM", length: 256 },
    keyUsages: ["encrypt", "decrypt"],
  });
