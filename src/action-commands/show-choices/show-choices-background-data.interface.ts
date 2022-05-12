import type { CCColor } from '@agogpixel/pgmmv-ts/api/cc/color';
import type { CCTexture2D } from '@agogpixel/pgmmv-ts/api/cc/texture-2d';

import type { ShowChoicesBackgroundDisplayType } from './show-choices-background-display-type.enum';

export interface ShowChoicesBackgroundData {
  borderColor?: CCColor;
  color?: CCColor;
  texture?: CCTexture2D;
  type: ShowChoicesBackgroundDisplayType;
}
