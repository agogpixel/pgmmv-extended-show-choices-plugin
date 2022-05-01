import type { ChoicesServiceConfig } from '../../../choices';

export interface ShowChoicesServiceConfig extends ChoicesServiceConfig {
  backgroundBorderColor?: [number, number, number, number];
  backgroundColor?: [number, number, number, number];
  backgroundDisplayType: 'graphics' | 'image' | 'none';
  backgroundImageId?: number;
  fontId: number;
  highlightColor?: [number, number, number, number];
  horizontalPosition: 'left' | 'center' | 'right';
  locale: string;
  textIds: number[];
  verticalPosition: 'top' | 'center' | 'bottom';
}
