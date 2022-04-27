/**
 * Exports {@link ChoicesLayer} position enumerations.
 *
 * @module choices-layer/choices-layer-position.enum
 */
import { ShowChoicesPositionParameterId } from '../action-commands/show-choices';

/**
 * {@link ChoicesLayer} position enumeration.
 *
 * @see {@link ShowChoicesPositionParameterId}
 */
export enum ChoicesLayerPosition {
  /**
   * Position on left side of screen.
   */
  Left = ShowChoicesPositionParameterId.Left,

  /**
   * Position in center of screen.
   */
  Center = ShowChoicesPositionParameterId.Center,

  /**
   * Position on right side of screen.
   */
  Right = ShowChoicesPositionParameterId.Right
}
