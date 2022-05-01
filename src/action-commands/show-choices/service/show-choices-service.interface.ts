import type { CCColor, CCTexture2D } from '@agogpixel/pgmmv-ts/api';

import type { ChoicesService } from '../../../choices';

import type { ShowChoicesLetterData } from './show-choices-letter-data.interface';

export interface ShowChoicesService extends ChoicesService {
  createTextSprites(choiceIndex: number): ShowChoicesLetterData[][];
  getBackgroundBorderColor(): CCColor | undefined;
  getBackgroundColor(): CCColor | undefined;
  getBackgroundDisplayType(): 'graphics' | 'image' | 'none';
  getBackgroundImageTexture(): CCTexture2D | undefined;
  getChoice(): number;
  getHighlightColor(): CCColor;
  getHorizontalPosition(): 'left' | 'center' | 'right';
  getVerticalPosition(): 'top' | 'center' | 'bottom';
  setChoice(choiceIndex: number): void;
}
