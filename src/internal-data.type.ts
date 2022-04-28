/**
 * Exports the plugin internal data type.
 *
 * @module
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api';

/**
 * Internal data type for the plugin.
 *
 * Format is limited to information that can be converted to text strings by
 * JSON.stringify.
 *
 * Saved and restored on gameplay save/load.
 */
export type InternalData = JsonValue;
