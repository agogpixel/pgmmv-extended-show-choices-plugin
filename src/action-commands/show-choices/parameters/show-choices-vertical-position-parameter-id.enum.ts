/**
 * Exports 'Show Choices' action command vertical position parameter ID
 * enumeration.
 *
 * @module action-commands/show-choices/parameters/show-choices-vertical-position-parameter-id.enum
 */

/**
 * 'Show Choices' action command vertical position parameter ID enumeration.
 */
export enum ShowChoicesVerticalPositionParameterId {
  /**
   * Position at top of screen.
   */
  Top = 1,

  /**
   * Position in center of screen.
   */
  Center,

  /**
   * Position at bottom of screen.
   */
  Bottom,

  /**
   * Fallback to plugin default.
   */
  Default
}
