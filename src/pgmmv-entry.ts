/**
 * Special entry point for webpack that ensures IIFE compatability is maintained
 * when importing the built plugin into PGMMV.
 *
 * @module
 */
import { createPlugin } from './create-plugin.function';

const plugin = createPlugin();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
return plugin;
