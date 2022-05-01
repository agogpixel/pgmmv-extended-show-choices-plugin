/**
 * Exports {@link ChoicesLayer} mode enumerations.
 *
 * @module action-commands/show-choices/display/choices-layer/choices-layer-mode.enum
 */

/**
 * {@link ChoicesLayer} mode enumeration.
 */
export enum ChoicesLayerMode {
  /**
   * Choices layer is opening.
   */
  Opening = 0,

  /**
   * Choices layer is open & awaiting input.
   */
  WaitingForKey = 1,

  /**
   * Selection has been made, choices layer is closing.
   */
  Closing = 2,

  /**
   * Choices layer has completed closing or is otherwise not displaying.
   */
  End = 3
}
