import type { CCColor, CCTexture2D } from '@agogpixel/pgmmv-ts/api';

import type { ChoicesServiceProtectedApi } from '../../../utils';

export interface ShowChoicesServiceProtectedApi extends ChoicesServiceProtectedApi {
  background: BackgroundData;
  choice: number;
  font: FontData;
  highlightColor: CCColor;
  position: PositionData;
  text: TextData[];
}

interface BackgroundData {
  borderColor?: CCColor;
  color?: CCColor;
  texture?: CCTexture2D;
  type: 'graphics' | 'image' | 'none';
}

interface FontData {
  bitmap?: {
    fixedWidth: boolean;
    hankakuWidth: number;
    layoutLineList: string[];
    letterHeight: number;
    letterWidth: number;
    texture: CCTexture2D;
    zenkakuWidth: number;
  };
  ttf?: {
    aliasThreshold: number;
    filename: string;
    letterHeight: number;
    size: number;
  };
  type: 'bitmap' | 'ttf';
}

interface PositionData {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
}

interface TextData {
  message: string;
  font?: FontData;
  letterSpacing: number;
}
