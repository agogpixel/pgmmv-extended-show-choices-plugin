import type { TagName } from './tag-name.enum';

interface BaseParsedTag {
  head: number;
  tagName?: TagName;
}

export interface ParsedColorTag extends BaseParsedTag {
  tagName: TagName.Color;
  param: [number, number, number];
}

export interface ParsedSizeTag extends BaseParsedTag {
  tagName: TagName.Size;
  param: number;
}

export type ParsedTag = ParsedColorTag | ParsedSizeTag;
