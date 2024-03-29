/**
 * Exports 'Show Choices' action command cancel parameter ID enumerations.
 *
 * @module action-commands/show-choices/parameters/show-choices-cancel-parameter-id.enum
 */

/**
 * 'Show Choices' action command cancel parameter ID enumeration.
 */
export enum ShowChoicesCancelParameterId {
  /**
   * Cancel handling enabled.
   */
  Enabled = 1,

  /**
   * User can't cancel the choices menu.
   */
  Disabled,

  /**
   * Fallback to plugin default.
   */
  Default
}
