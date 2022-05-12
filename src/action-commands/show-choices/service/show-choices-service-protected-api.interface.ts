import type { CCColor } from '@agogpixel/pgmmv-ts/api/cc/color';

import type { ChoicesServiceProtectedApi } from '../../../utils/choices/choices-service-protected-api.interface';

import type { ShowChoicesBackgroundData } from '../show-choices-background-data.interface';
import type { ShowChoicesFontData } from '../show-choices-font-data.interface';
import type { ShowChoicesPositionData } from '../show-choices-position-data.interface';
import type { ShowChoicesTextData } from '../show-choices-text-data.interface';

export interface ShowChoicesServiceProtectedApi extends ChoicesServiceProtectedApi {
  background: ShowChoicesBackgroundData;
  font: ShowChoicesFontData;
  highlightColor: CCColor;
  position: ShowChoicesPositionData;
  text: ShowChoicesTextData[];
}
