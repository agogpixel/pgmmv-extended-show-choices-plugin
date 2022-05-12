/**
 * Exports ParsedTag interfaces.
 *
 * @module choices-layer/font-draw/parsed-tag.interface
 */
import type { TagName } from './tag-name.enum';

/**
 * Properties common to all parsed tag types.
 */
interface BaseParsedTag {
  /**
   * Position index of the start of a tag within a string.
   */
  head: number;

  /**
   * Specifies the type of tag.
   */
  tagName?: TagName;
}

/**
 * Parsed color tag data.
 */
export interface ParsedColorTag extends BaseParsedTag {
  /**
   * This is a color tag.
   */
  tagName: TagName.Color;

  /**
   * 3-tuple representing RGB color channel data.
   */
  param: [number, number, number];
}

/**
 * Parsed font size data.
 */
export interface ParsedSizeTag extends BaseParsedTag {
  /**
   * This is a size tag.
   */
  tagName: TagName.Size;

  /**
   * A scalar value representing the absolute size.
   */
  param: number;
}

/**
 * Union type of parsed text tag function results.
 */
export type ParsedTag = ParsedColorTag | ParsedSizeTag;
