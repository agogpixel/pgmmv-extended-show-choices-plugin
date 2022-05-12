import type { CCColor } from '@agogpixel/pgmmv-ts/api/cc/color';
import type { CCTexture2D } from '@agogpixel/pgmmv-ts/api/cc/texture-2d';

import type { ChoicesService } from '../../../utils/choices/choices-service.interface';

import type { ShowChoicesBackgroundDisplayType } from '../show-choices-background-display-type.enum';
import type { ShowChoicesHorizontalPosition } from '../show-choices-horizontal-position.enum';
import type { ShowChoicesLetterData } from '../show-choices-letter-data.interface';
import type { ShowChoicesVerticalPosition } from '../show-choices-vertical-position.enum';

export interface ShowChoicesService extends ChoicesService {
  createTextSprites(choiceIndex: number): ShowChoicesLetterData[][];
  destroyChoices(removeFromParent?: boolean): void;
  getBackgroundBorderColor(): CCColor | undefined;
  getBackgroundColor(): CCColor | undefined;
  getBackgroundDisplayType(): ShowChoicesBackgroundDisplayType;
  getBackgroundImageTexture(): CCTexture2D | undefined;
  getHighlightColor(): CCColor;
  getHorizontalPosition(): ShowChoicesHorizontalPosition;
  getVerticalPosition(): ShowChoicesVerticalPosition;
  setChoice(choiceIndex: number): void;
}
