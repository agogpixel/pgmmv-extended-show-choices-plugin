/**
 * Exports plugin UI parameter ID enumerations.
 *
 * @module parameters/parameter-id.enum
 */

import { ShowChoicesParameterId } from '../action-commands/show-choices';

/**
 * Plugin UI parameter ID enumeration.
 */
export enum ParameterId {
  /**
   * Background display type.
   */
  BackgroundDisplayType = ShowChoicesParameterId.BackgroundDisplayType,

  /**
   * Background image.
   */
  BackgroundImage = ShowChoicesParameterId.BackgroundImage,

  /**
   * Background color.
   */
  BackgroundColor = ShowChoicesParameterId.BackgroundColor,

  /**
   * Background border color.
   */
  BackgroundBorderColor = ShowChoicesParameterId.BackgroundBorderColor,

  /**
   * Highlight color.
   */
  HighlightColor = ShowChoicesParameterId.HighlightColor,

  /**
   * Font.
   */
  Font = ShowChoicesParameterId.Font,

  /**
   * Horizontal position.
   */
  HorizontalPosition = ShowChoicesParameterId.HorizontalPosition,

  /**
   * Vertical position.
   */
  VerticalPosition = ShowChoicesParameterId.VerticalPosition,

  /**
   * Cancel setting.
   */
  Cancel = ShowChoicesParameterId.Cancel
}
