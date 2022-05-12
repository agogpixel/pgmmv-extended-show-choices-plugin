import type { CCTexture2D } from '@agogpixel/pgmmv-ts/api/cc/texture-2d';

export interface ShowChoicesFontData {
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
