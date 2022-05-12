/**
 * Exports 'Show Choices' action command horizontal position parameter ID
 * enumeration.
 *
 * @module action-commands/show-choices/parameters/show-choices-horizontal-position-parameter-id.enum
 */

/**
 * 'Show Choices' action command horizontal position parameter ID enumeration.
 */
export enum ShowChoicesHorizontalPositionParameterId {
  /**
   * Position on left side of screen.
   */
  Left = 1,

  /**
   * Position in center of screen.
   */
  Center,

  /**
   * Position on right side of screen.
   */
  Right,

  /**
   * Fallback to plugin default.
   */
  Default
}
