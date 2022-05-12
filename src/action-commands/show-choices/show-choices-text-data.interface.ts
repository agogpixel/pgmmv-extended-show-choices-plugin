import type { ShowChoicesFontData } from './show-choices-font-data.interface';

export interface ShowChoicesTextData {
  message: string;
  font?: ShowChoicesFontData;
  letterSpacing: number;
}
