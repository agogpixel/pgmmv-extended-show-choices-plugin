import type { AgtkFont, CCLayer, CCTexture2D } from '@agogpixel/pgmmv-ts/api';

import type { FontDraw } from './font-draw.interface';
import type { ParsedTag } from './parsed-tag.interface';
import { TagName } from './tag-name.enum';

export function createFontDraw(layer: CCLayer, zIndex: number, fontData: AgtkFont, letterSpacing: number) {
  const letterLayer = new cc.Layer();
  letterLayer.setAnchorPoint(0, 0);
  layer.addChild(letterLayer, zIndex);

  const letterY = 0;
  let currentColor: [number, number, number] = [255, 255, 255];
  let currentLineMaxHeight = -1;
  let letterX = 0;

  let aliasThreshold: number;
  let fixedWidth: boolean;
  let fontImageTex: CCTexture2D;
  let fontSize: number;
  let hankakuWidth: number;
  let layoutLineList: string[];
  let letterWidth: number;
  let letterHeight: number;
  let ttfFilename: string;
  let zenkakuWidth: number;

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

  const winHeight = letterHeight;
  let currentSize = letterHeight;

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

  function getInt(numStr: string, defValue: number) {
    const n = parseInt(numStr, 10);
    return isNaN(n) ? defValue : n;
  }

  function parseTag(message: string, head: number, size: number): ParsedTag {
    //ret: {head: <next head position>, tagName: <'S', 'C', or null>, param: <if 'S' then <size: int>. if 'C' then [<R: int>, <G: int>, <B: int>]. > }
    //const tag = message.substr(head, 3);
    const tag = message.substring(head, head + 3);

    if (tag == '\\S[') {
      const index = message.indexOf(']', head + 3);

      if (index >= 0) {
        //const word = message.substr(head + 3, index - (head + 3));
        const word = message.substring(head + 3, index);

        if (word.length == 0) {
          size = letterHeight;
        } else if (word[0] == '+') {
          //size = Math.max(0, size + getInt(word.substr(1), 0));
          size = Math.max(0, size + getInt(word.substring(1), 0));
        } else if (word[0] == '-') {
          //size = Math.max(0, size - getInt(word.substr(1), 0));
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
        //const word = message.substr(head + 3, index - (head + 3));
        const word = message.substring(head + 3, index);
        let rgb: [number, number, number];

        if (word.length == 0) {
          rgb = [255, 255, 255];
        } else if (word[0] == '#') {
          if (word.length == 3 + 1) {
            //const v = parseInt(word.substr(1), 16);
            const v = parseInt(word.substring(1), 16);
            rgb = [((v >> 8) & 0x0f) * 0x11, ((v >> 4) & 0x0f) * 0x11, ((v >> 0) & 0x0f) * 0x11];
          } else if (word.length == 6 + 1) {
            //const v = parseInt(word.substr(1), 16);
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

  const self = {} as FontDraw;

  self.clearLetters = function () {
    letterLayer.removeAllChildren();
  };

  self.drawLetters = function (text, textWidth, textHeight) {
    for (let j = 0; j < text.length; j++) {
      if (text[j] == '\n') {
        break;
      }

      //if (text.substr(j, 2) == '\\\\') {
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

  return self;
}
