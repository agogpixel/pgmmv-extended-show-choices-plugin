/**
 * Exports 'Show Choices' action command background display type parameter ID
 * enumeration.
 *
 * @module action-commands/show-choices/parameters/show-choices-background-display-type-paramerter-id.enum
 */

/**
 * 'Show Choices' action command background display type parameter ID
 * enumeration.
 */
export enum ShowChoicesBackgroundDisplayTypeParameterId {
  /**
   * Display using ccDrawLayer.
   */
  Graphics = 1,

  /**
   * Display using image.
   */
  Image,

  /**
   * No background.
   */
  None,

  /**
   * Fallback to plugin default.
   */
  Default
}
