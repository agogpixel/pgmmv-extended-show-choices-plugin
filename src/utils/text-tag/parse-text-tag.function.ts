import type { ParsedTextTag } from './parsed-text-tag.type';
import { TextTagName } from './text-tag-name.enum';

export function parseTextTag(
  text: string,
  startIndex: number,
  context: { currentSize: number; defaultColor: [number, number, number]; defaultSize: number }
) {
  const candidateStartText = text.substring(startIndex, startIndex + 3);

  let index: number;
  let parsedTextTag: ParsedTextTag | undefined;

  switch (candidateStartText) {
    case `\\${TextTagName.Color}[`:
      index = text.indexOf(']', startIndex + 3);

      if (index >= 0) {
        const word = text.substring(startIndex + 3, index);
        let rgb: [number, number, number];

        if (word.length == 0) {
          rgb = context.defaultColor;
        } else if (word[0] == '#') {
          if (word.length == 3 + 1) {
            const v = parseInt(word.substring(1), 16);
            rgb = [((v >> 8) & 0x0f) * 0x11, ((v >> 4) & 0x0f) * 0x11, ((v >> 0) & 0x0f) * 0x11];
          } else if (word.length == 6 + 1) {
            const v = parseInt(word.substring(1), 16);
            rgb = [(v >> 16) & 0xff, (v >> 8) & 0xff, (v >> 0) & 0xff];
          } else {
            rgb = context.defaultColor;
          }
        } else {
          const list = word.split(',');

          if (list.length < 3) {
            rgb = context.defaultColor;
          } else {
            rgb = [
              Math.max(0, Math.min(255, getInt(list[0], 255))),
              Math.max(0, Math.min(255, getInt(list[1], 255))),
              Math.max(0, Math.min(255, getInt(list[2], 255)))
            ];
          }
        }

        parsedTextTag = { head: index + 1, tagName: TextTagName.Color, param: rgb };
      }
      break;
    case `\\${TextTagName.Size}[`:
      index = text.indexOf(']', startIndex + 3);

      if (index >= 0) {
        const word = text.substring(startIndex + 3, index);
        let size: number;

        if (word.length == 0) {
          size = context.defaultSize;
        } else if (word[0] == '+') {
          size = Math.max(0, context.currentSize + getInt(word.substring(1), 0));
        } else if (word[0] == '-') {
          size = Math.max(0, context.currentSize - getInt(word.substring(1), 0));
        } else {
          size = Math.max(0, getInt(word, context.defaultSize));
        }

        parsedTextTag = { head: index + 1, tagName: TextTagName.Size, param: size };
      }
      break;
    default:
      break;
  }

  return parsedTextTag;
}

/**
 * Helper function for resolving an integer string to a number type.
 *
 * @param numStr The string to parse
 * @param defValue Fallback value to return if parse fails.
 * @returns The parsed number. If parsing fails, then the default value is
 * returned.
 */
function getInt(numStr: string, defValue: number) {
  const n = parseInt(numStr, 10);
  return isNaN(n) ? defValue : n;
}
