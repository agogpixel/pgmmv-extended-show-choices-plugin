/**
 * Exports choices service interface.
 *
 * @module choices/choices-service.interface
 */

/**
 * Exposes a simple choices API.
 */
export interface ChoicesService {
  /**
   * Get the 'cancel current choices' value.
   */
  getCancelValue(): number;

  /**
   * Get the default choice value.
   */
  getDefaultChoice(): number;

  /**
   * Get the maximum number of choices available.
   */
  getMaxChoices(): number;

  /**
   * Get the 'no choice made' value.
   */
  getNoChoiceMadeValue(): number;
}
