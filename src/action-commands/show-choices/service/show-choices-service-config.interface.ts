import type { ChoicesServiceConfig } from '../../../utils/choices/choices-service-config.interface';

import type { ShowChoicesBackgroundDisplayType } from '../show-choices-background-display-type.enum';
import type { ShowChoicesHorizontalPosition } from '../show-choices-horizontal-position.enum';
import type { ShowChoicesVerticalPosition } from '../show-choices-vertical-position.enum';

export interface ShowChoicesServiceConfig extends ChoicesServiceConfig {
  backgroundBorderColor?: [number, number, number, number];
  backgroundColor?: [number, number, number, number];
  backgroundDisplayType: ShowChoicesBackgroundDisplayType;
  backgroundImageId?: number;
  fontId: number;
  highlightColor?: [number, number, number, number];
  horizontalPosition: ShowChoicesHorizontalPosition;
  locale: string;
  textIds: number[];
  verticalPosition: ShowChoicesVerticalPosition;
}
