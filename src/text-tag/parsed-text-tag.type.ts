/**
 * Exports parsed text tag interfaces.
 *
 * @module text-tag/parsed-text-tag.interface
 */
import type { TextTagName } from './text-tag-name.enum';

/**
 * Properties common to all parsed tag types.
 */
interface BaseParsedTextTag {
  /**
   * Position index of the start of a tag within a string.
   */
  head: number;

  /**
   * Specifies the type of tag.
   */
  tagName?: TextTagName;
}

/**
 * Parsed color tag data.
 */
export interface ParsedColorTextTag extends BaseParsedTextTag {
  /**
   * This is a color tag.
   */
  tagName: TextTagName.Color;

  /**
   * 3-tuple representing RGB color channel data.
   */
  param: [number, number, number];
}

/**
 * Parsed font size data.
 */
export interface ParsedSizeTextTag extends BaseParsedTextTag {
  /**
   * This is a size tag.
   */
  tagName: TextTagName.Size;

  /**
   * A scalar value representing the absolute size.
   */
  param: number;
}

/**
 * Union type of parsed text tag function results.
 */
export type ParsedTextTag = ParsedColorTextTag | ParsedSizeTextTag;
