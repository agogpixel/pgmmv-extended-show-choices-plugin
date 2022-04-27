/**
 * Exports {@link FontDraw} factory functions.
 *
 * @module choices-layer/font-draw/create-font-draw.function
 */
import type { AgtkFont, CCLayer, CCTexture2D } from '@agogpixel/pgmmv-ts/api';

import type { FontDraw } from './font-draw.interface';
import type { ParsedTag } from './parsed-tag.interface';
import { TagName } from './tag-name.enum';

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Helper function for resolving an integer string to a number type.
 *
 * @param numStr The string to parse
 * @param defValue Fallback value to return if parse fails.
 * @returns The parsed number. If parsing fails, then the default value is
 * returned.
 *
 * @private
 * @static
 */
function getInt(numStr: string, defValue: number) {
  const n = parseInt(numStr, 10);
  return isNaN(n) ? defValue : n;
}

/**
 * Create a font draw instance.
 *
 * @param layer The layer to which we attach the font draw layer.
 * @param zIndex The position at which the new layer will display among any
 * sibling layers/nodes.
 * @param fontData Font data.
 * @param letterSpacing Letter spacing.
 * @returns A font draw instance capable of parsing inline tags & drawing a line
 * of text to the screen.
 */
export function createFontDraw(layer: CCLayer, zIndex: number, fontData: AgtkFont, letterSpacing: number) {
  //////////////////////////////////////////////////////////////////////////////
  // Private Properties
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Cocos layer to which we draw our letters.
   *
   * @private
   */
  const letterLayer = new cc.Layer();
  letterLayer.setAnchorPoint(0, 0);
  layer.addChild(letterLayer, zIndex);

  /**
   * Current letter's Y position.
   *
   * @private
   */
  const letterY = 0;

  /**
   * Current text color.
   *
   * @private
   */
  let currentColor: [number, number, number] = [255, 255, 255];

  /**
   * Current line's maximum height.
   *
   * @private
   */
  let currentLineMaxHeight = -1;

  /**
   * Current letter's X position.
   *
   * @private
   */
  let letterX = 0;

  /**
   * Font's anti-alias threshold.
   *
   * @private
   */
  let aliasThreshold: number;

  /**
   * Font's fixed width.
   *
   * @private
   */
  let fixedWidth: boolean;

  /**
   * Font's texture.
   *
   * @private
   */
  let fontImageTex: CCTexture2D;

  /**
   * Font's size.
   *
   * @private
   */
  let fontSize: number;

  /**
   * Font's Hankaku width.
   *
   * @private
   */
  let hankakuWidth: number;

  /**
   * Font's layout line list.
   */
  let layoutLineList: string[];

  /**
   * Font's letter width.
   */
  let letterWidth: number;

  /**
   * Font's letter height.
   */
  let letterHeight: number;

  /**
   * True-type font filename.
   */
  let ttfFilename: string;

  /**
   * Font's Zenkaku width.
   */
  let zenkakuWidth: number;

  // Initialize font handling.

  /**
   * Does the font use an image texture?
   */
  const imageFontFlag = fontData.imageFontFlag;

  if (imageFontFlag) {
    const fontImageData = Agtk.images.get(fontData.imageId);

    if (fontImageData === null) {
      return;
    }

    fontImageTex = cc.textureCache.addImage(fontImageData.filename);

    if (fontImageTex === null) {
      return;
    }

    fontImageTex.setAliasTexParameters();

    fixedWidth = fontData.fixedWidth;
    hankakuWidth = fontData.hankakuWidth;
    zenkakuWidth = fontData.zenkakuWidth;

    layoutLineList = fontData.letterLayout.split('\n');

    const layoutLines = layoutLineList.length;
    let maxLetters = 0;

    for (let i = 0; i < layoutLines; i++) {
      maxLetters = Math.max(maxLetters, layoutLineList[i].length);
    }

    letterWidth = Math.floor(fontImageTex.width / maxLetters);
    letterHeight = Math.floor(fontImageTex.height / layoutLines);
  } else {
    fontSize = fontData.fontSize;
    letterHeight = fontSize;
    ttfFilename = `fonts/${fontData.fontName}.ttf`;
    aliasThreshold = fontData.antialiasDisabled ? fontData.aliasThreshold : -1;
  }

  /**
   * The height of the area we will draw to.
   */
  const winHeight = letterHeight;

  /**
   * Tracks our current font size.
   */
  let currentSize = letterHeight;

  //////////////////////////////////////////////////////////////////////////////
  // Private Methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Applies parsed text tag function data to our current FontDraw state.
   *
   * @param data Either a parsed color tag or a parsed size tag.
   * @returns Position index within a string to continue parsing from.
   */
  function applyTagData(data: ParsedTag) {
    switch (data.tagName) {
      case TagName.Size:
        currentSize = data.param;
        break;
      case TagName.Color:
        currentColor = data.param;
        break;
      default:
        break;
    }

    return data.head;
  }

  /**
   * Parse a detected text tag function. Currently supported text tag functions:
   * - Increase font size by `\S[+{number}]`
   * - Decrease font size by `\S[-{number}]`
   * - Return to original font size `\S[]`
   * - Use specific font size `\S[{number}]` (assumed to be a positive,
   *   non-zero, scalar value).
   * - Set text color `\C[#rgb]` or `\C[#rrggbb]`.
   * - Return to original text color `\C[]`.
   *
   * @param message Current line of text being drawn.
   * @param head Start position index (within the message string) of the text
   * function tag.
   * @param size The current font size.
   * @returns A parsed text tag function that takes the form of:
   * ```
   * {
   *   head: <next head position>,
   *   tagName: <'S', 'C', or undefined>,
   *   param: <if 'S' then <size: int>. if 'C' then [<R: int>, <G: int>, <B: int>]. >
   * }
   * ```
   * @private
   */
  function parseTag(message: string, head: number, size: number): ParsedTag {
    const tag = message.substring(head, head + 3);

    if (tag == '\\S[') {
      const index = message.indexOf(']', head + 3);

      if (index >= 0) {
        const word = message.substring(head + 3, index);

        if (word.length == 0) {
          size = letterHeight;
        } else if (word[0] == '+') {
          size = Math.max(0, size + getInt(word.substring(1), 0));
        } else if (word[0] == '-') {
          size = Math.max(0, size - getInt(word.substring(1), 0));
        } else {
          size = Math.max(0, getInt(word, letterHeight));
        }

        head = index + 1;

        return { head, tagName: TagName.Size, param: size };
      }
    } else if (tag == '\\C[') {
      const index = message.indexOf(']', head + 3);

      if (index >= 0) {
        const word = message.substring(head + 3, index);
        let rgb: [number, number, number];

        if (word.length == 0) {
          rgb = [255, 255, 255];
        } else if (word[0] == '#') {
          if (word.length == 3 + 1) {
            const v = parseInt(word.substring(1), 16);
            rgb = [((v >> 8) & 0x0f) * 0x11, ((v >> 4) & 0x0f) * 0x11, ((v >> 0) & 0x0f) * 0x11];
          } else if (word.length == 6 + 1) {
            const v = parseInt(word.substring(1), 16);
            rgb = [(v >> 16) & 0xff, (v >> 8) & 0xff, (v >> 0) & 0xff];
          } else {
            rgb = [255, 255, 255];
          }
        } else {
          const list = word.split(',');

          if (list.length < 3) {
            rgb = [255, 255, 255];
          } else {
            rgb = [
              Math.max(0, Math.min(255, getInt(list[0], 255))),
              Math.max(0, Math.min(255, getInt(list[1], 255))),
              Math.max(0, Math.min(255, getInt(list[2], 255)))
            ];
          }
        }

        head = index + 1;

        return { head, tagName: TagName.Color, param: rgb };
      }
    }

    return { head } as ParsedTag;
  }

  /**
   * Draw a specified letter to the screen. Updates current FontDraw state as
   * appropriate (letter positioning, etc.).
   *
   * @param letter UTF-16 character.
   * @private
   */
  function putLetter(letter: string) {
    if (imageFontFlag) {
      const isHankaku = !letter.match(/[^\x01-\x7E]/) || !letter.match(/[^\uFF65-\uFF9F]/);

      let cx = -1;
      let cy = -1;

      for (let i = 0; i < layoutLineList.length; i++) {
        const index = layoutLineList[i].indexOf(letter);

        if (index >= 0) {
          cx = index;
          cy = i;
          break;
        }
      }
      if (cx >= 0 && cy >= 0) {
        const sprite = new cc.Sprite(
          fontImageTex,
          cc.rect(cx * letterWidth, cy * letterHeight, letterWidth, letterHeight)
        );

        sprite.setAnchorPoint(0, 0);
        sprite.x = letterX;
        sprite.y = winHeight - letterHeight * 2 - (currentSize - letterHeight) - letterY;
        sprite.width = (letterWidth * currentSize) / letterHeight;
        sprite.height = (letterHeight * currentSize) / letterHeight;
        sprite.color = cc.color(currentColor[0], currentColor[1], currentColor[2]);

        letterLayer.addChild(sprite);

        letterX +=
          ((fixedWidth ? letterWidth : isHankaku ? hankakuWidth : zenkakuWidth) * currentSize) / letterHeight +
          letterSpacing;
      }
    } else {
      const label = new cc.LabelTTF(
        letter,
        ttfFilename,
        (fontSize * currentSize) / letterHeight,
        undefined,
        undefined,
        undefined,
        aliasThreshold
      );

      label.color = cc.color(currentColor[0], currentColor[1], currentColor[2]);
      label.setAnchorPoint(0, 0);
      label.x = letterX;
      //label.y = this.winHeight - this.fontSize * 2 - this.letterY;
      label.y = winHeight - letterHeight * 2 - (currentSize - letterHeight) - letterY - currentSize / 8;
      letterLayer.addChild(label);
      letterX += label.width + letterSpacing;
    }

    if (currentSize > currentLineMaxHeight) {
      currentLineMaxHeight = currentSize;
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public API
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Our base FontDraw instance.
   */
  const self = {} as FontDraw;

  // Implement the FontDraw interface.

  self.clearLetters = function () {
    letterLayer.removeAllChildren();
  };

  self.drawLetters = function (text, textWidth, textHeight) {
    for (let j = 0; j < text.length; j++) {
      if (text[j] == '\n') {
        break;
      }

      if (text.substring(j, j + 2) == '\\\\') {
        j += 2 - 1;
        putLetter('\\');
        continue;
      }

      const data = parseTag(text, j, currentSize);

      if (data.tagName != null) {
        j = applyTagData(data) - 1;
        continue;
      }

      putLetter(text[j]);
    }

    if (currentLineMaxHeight < 0) {
      currentLineMaxHeight = currentSize;
    }

    letterLayer.x = 0;
    letterLayer.y = -textHeight;

    if (letterX > textWidth) {
      textWidth = letterX;
    }

    textHeight += currentLineMaxHeight + 8;

    return [textWidth, textHeight];
  };

  self.getCurrentLineMaxHeight = function () {
    return currentLineMaxHeight;
  };

  //////////////////////////////////////////////////////////////////////////////
  // FontDraw Ready!
  //////////////////////////////////////////////////////////////////////////////
  return self;
}
