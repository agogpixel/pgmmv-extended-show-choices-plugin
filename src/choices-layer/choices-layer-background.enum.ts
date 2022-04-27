/**
 * Exports {@link ChoicesLayer} background enumerations.
 *
 * @module choices-layer/choices-layer-background.enum
 */
import { ShowChoicesBackgroundParameterId } from '../action-commands/show-choices';

/**
 * {@link ChoicesLayer} background enumeration.
 *
 * @see {@link ShowChoicesBackgroundParameterId}
 */
export enum ChoicesLayerBackground {
  /**
   * Display with a white frame.
   */
  WhiteFrame = ShowChoicesBackgroundParameterId.WhiteFrame,

  /**
   * Display with black background.
   */
  Black = ShowChoicesBackgroundParameterId.Black,

  /**
   * No background.
   */
  None = ShowChoicesBackgroundParameterId.None
}
