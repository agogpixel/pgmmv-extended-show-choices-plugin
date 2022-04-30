/**
 * Exports choices service interface.
 *
 * @module choices/choices-service.interface
 */

/**
 * Exposes simple choices API.
 */
export interface ChoicesService {
  /**
   * Get the maximum number of choices available.
   */
  getMaxChoices(): number;

  /**
   * Set a choice represented by specified index.
   *
   * @param index Choice index.
   */
  setChoice(index: number): void;
}
