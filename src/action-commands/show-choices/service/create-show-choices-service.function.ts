import { createChoicesService } from '../../../utils/choices/create-choices-service.function';
import { parseTextTag } from '../../../utils/text-tag/parse-text-tag.function';
import { TextTagName } from '../../../utils/text-tag/text-tag-name.enum';

import { ShowChoicesBackgroundDisplayType } from '../show-choices-background-display-type.enum';
import type { ShowChoicesLetterData } from '../show-choices-letter-data.interface';

import type { ShowChoicesServiceConfig } from './show-choices-service-config.interface';
import type { ShowChoicesServiceProtectedApi } from './show-choices-service-protected-api.interface';
import type { ShowChoicesService } from './show-choices-service.interface';

export function createShowChoicesService(config: ShowChoicesServiceConfig, internal?: ShowChoicesServiceProtectedApi) {
  const internalApi = internal || ({} as ShowChoicesServiceProtectedApi);
  const self = createChoicesService(config, internalApi) as ShowChoicesService;

  internalApi.background = createBackgroundData({
    borderColor: config.backgroundBorderColor,
    color: config.backgroundColor,
    imageId: config.backgroundImageId,
    type: config.backgroundDisplayType
  });

  internalApi.font = createFontData(config.fontId);

  internalApi.highlightColor = createHighlightColor();

  internalApi.position = {
    horizontal: config.horizontalPosition,
    vertical: config.verticalPosition
  };

  internalApi.text = createTextData(config.textIds, config.locale);
  internalApi.maxChoices = internalApi.text.length;

  self.createTextSprites = function (choiceIndex) {
    const letterData: ShowChoicesLetterData[][] = [];

    const index = choiceIndex - 1;

    if (index < 0 || index >= internalApi.text.length) {
      return letterData;
    }

    const textData = internalApi.text[index];

    const fontData = textData.font || internalApi.font;
    const letterHeight = fontData[fontData.type]?.letterHeight as number;

    let currentColor = [255, 255, 255];
    let currentSize = letterHeight;
    let letterX = 0;

    function createSprite(letter: string): ShowChoicesLetterData {
      switch (fontData.type) {
        case 'bitmap':
          const bitmapData = (fontData as Required<ShowChoicesServiceProtectedApi['font']>)[fontData.type];
          const layoutLineList = bitmapData.layoutLineList;
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
              bitmapData.texture,
              cc.rect(cx * bitmapData.letterWidth, cy * letterHeight, bitmapData.letterWidth, letterHeight)
            );

            sprite.setAnchorPoint(0, 0);
            sprite.x = letterX;
            sprite.y = letterHeight - (currentSize - letterHeight);
            sprite.width = (bitmapData.letterWidth * currentSize) / letterHeight;
            sprite.height = currentSize;
            sprite.color = cc.color(currentColor[0], currentColor[1], currentColor[2]);

            letterX +=
              ((bitmapData.fixedWidth
                ? bitmapData.letterWidth
                : isHankaku
                ? bitmapData.hankakuWidth
                : bitmapData.zenkakuWidth) *
                currentSize) /
                letterHeight +
              textData.letterSpacing;

            return { endX: letterX, sprite };
          }
          break;
        case 'ttf':
          const ttfData = (fontData as Required<ShowChoicesServiceProtectedApi['font']>)[fontData.type];

          const label = new cc.LabelTTF(
            letter,
            ttfData.filename,
            (ttfData.size * currentSize) / letterHeight,
            undefined,
            undefined,
            undefined,
            ttfData.aliasThreshold
          );

          label.color = cc.color(currentColor[0], currentColor[1], currentColor[2]);
          label.setAnchorPoint(0, 0);
          label.x = letterX;
          label.y = letterHeight - (currentSize - letterHeight) - currentSize / 8;

          letterX += label.width + textData.letterSpacing;

          return { endX: letterX, sprite: label };
        default:
          break;
      }

      return { endX: -1, sprite: new cc.Sprite() };
    }

    const lines = textData.message.split('\n');

    for (let i = 0; i < lines.length; ++i) {
      const text = lines[i];

      letterData.push([]);

      for (let j = 0; j < text.length; ++j) {
        if (text.substring(j, j + 2) == '\\\\') {
          j += 2 - 1;
          letterData[i].push(createSprite('\\'));
          continue;
        }

        const data = parseTextTag(text, j, {
          currentSize,
          defaultColor: [255, 255, 255],
          defaultSize: letterHeight
        });

        if (data) {
          switch (data.tagName) {
            case TextTagName.Size:
              currentSize = data.param;
              break;
            case TextTagName.Color:
              currentColor = data.param;
              break;
            default:
              break;
          }
          continue;
        }

        letterData[i].push(createSprite(text[j]));
      }

      letterX = 0; // Reset x position for multiline choice...
    }

    return letterData;
  };

  self.getBackgroundBorderColor = function () {
    return internalApi.background.borderColor;
  };

  self.getBackgroundColor = function () {
    return internalApi.background.color;
  };

  self.getBackgroundDisplayType = function () {
    return internalApi.background.type;
  };

  self.getBackgroundImageTexture = function () {
    return internalApi.background.texture;
  };

  self.getHighlightColor = function () {
    return internalApi.highlightColor;
  };

  self.getHorizontalPosition = function () {
    return internalApi.position.horizontal;
  };

  self.getVerticalPosition = function () {
    return internalApi.position.vertical;
  };

  return self;
}

function createBackgroundData(config: {
  borderColor?: [number, number, number, number];
  color?: [number, number, number, number];
  type: ShowChoicesBackgroundDisplayType;
  imageId?: number;
}) {
  const backgroundData = {} as ShowChoicesServiceProtectedApi['background'];

  switch (config.type) {
    case ShowChoicesBackgroundDisplayType.Graphics:
      const borderColor = config.borderColor || [255, 255, 255, 255];
      const color = config.color || [0, 0, 0, 128];

      backgroundData.type = ShowChoicesBackgroundDisplayType.Graphics;
      backgroundData.borderColor = new cc.Color(...borderColor);
      backgroundData.color = new cc.Color(...color);
      break;
    case ShowChoicesBackgroundDisplayType.Image:
      if (!config.imageId) {
        // TODO: error handling...
      }

      const agtkImage = Agtk.images.get(config.imageId as number);

      if (!agtkImage) {
        // TODO: error handling...
      }

      const texture = cc.textureCache.addImage(agtkImage.filename);
      texture.setAliasTexParameters();

      backgroundData.type = ShowChoicesBackgroundDisplayType.Image;
      backgroundData.texture = texture;

      break;
    case ShowChoicesBackgroundDisplayType.None:
    default:
      backgroundData.type = ShowChoicesBackgroundDisplayType.None;
      break;
  }

  return backgroundData;
}

function createFontData(fontId: number) {
  const agtkFont = Agtk.fonts.get(fontId);
  const fontData = {} as ShowChoicesServiceProtectedApi['font'];

  if (!agtkFont) {
    // TODO: error handling...
  }

  if (agtkFont.imageFontFlag) {
    const agtkImage = Agtk.images.get(agtkFont.imageId);

    if (!agtkImage) {
      // TODO: error handling...
    }

    const texture = cc.textureCache.addImage(agtkImage.filename);

    if (!texture) {
      // TODO: error handling...
    }

    texture.setAliasTexParameters();

    const layoutLineList = agtkFont.letterLayout.split('\n');
    const bitmapData = {
      fixedWidth: agtkFont.fixedWidth,
      hankakuWidth: agtkFont.hankakuWidth,
      layoutLineList,
      texture,
      zenkakuWidth: agtkFont.zenkakuWidth
    } as Required<ShowChoicesServiceProtectedApi['font']>['bitmap'];

    const layoutLines = layoutLineList.length;
    let maxLetters = 0;

    for (let i = 0; i < layoutLines; i++) {
      maxLetters = Math.max(maxLetters, layoutLineList[i].length);
    }

    bitmapData.letterWidth = Math.floor(texture.width / maxLetters);
    bitmapData.letterHeight = Math.floor(texture.height / layoutLines);

    fontData.type = 'bitmap';
    fontData.bitmap = bitmapData;
  } else {
    fontData.type = 'ttf';
    fontData.ttf = {
      aliasThreshold: agtkFont.antialiasDisabled ? agtkFont.aliasThreshold : -1,
      filename: `fonts/${agtkFont.fontName}.ttf`,
      letterHeight: agtkFont.fontSize,
      size: agtkFont.fontSize
    };
  }

  return fontData;
}

function createHighlightColor(color?: [number, number, number, number]) {
  return new cc.Color(...(color || [0, 255, 255, 128]));
}

function createTextData(textIds: number[], locale: string) {
  const textData: ShowChoicesServiceProtectedApi['text'] = [];

  for (let i = 0; i < textIds.length; i++) {
    const textId = textIds[i];
    const agtkText = Agtk.texts.get(textId);

    if (!agtkText) {
      continue;
    }

    const message = agtkText.getText(locale);

    if (!message) {
      continue;
    }

    let font: ShowChoicesServiceProtectedApi['font'] | undefined = undefined;

    if (agtkText.fontId >= 0) {
      font = createFontData(agtkText.fontId);
    }

    textData.push({ message, font, letterSpacing: agtkText.letterSpacing });
  }

  return textData;
}
