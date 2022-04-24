import { ChoicesLayerBackground } from './choices-layer-background.enum';
import { ChoicesLayerPosition } from './choices-layer-position.enum';

export interface ChoicesLayerDataService {
  destroyChoices(removeFromParent?: boolean): void;
  getBgImageId(): number;
  getBgType(): ChoicesLayerBackground;
  getFontId(): number;
  getLocale(): string;
  getNumChoices(): number;
  getPosition(): ChoicesLayerPosition;
  getScreenHeight(): number;
  getScreenWidth(): number;
  /**
   * Get PGMMV text ID for specified choice.
   *
   * @param choiceIndex 1-based indexing.
   */
  getTextId(choiceIndex: number): number;
  getVariableId(): number;
  isCancellable(): boolean;
  isShowing(): boolean;
  setSelectedInfo(objectId: number, instanceId: number, index: number, variableId: number): void;
}
