import type { CCLabelTTF } from '@agogpixel/pgmmv-ts/api/cc/label-ttf';
import type { CCSprite } from '@agogpixel/pgmmv-ts/api/cc/sprite';

export interface ShowChoicesLetterData {
  endX: number;
  sprite: CCSprite | CCLabelTTF;
}
