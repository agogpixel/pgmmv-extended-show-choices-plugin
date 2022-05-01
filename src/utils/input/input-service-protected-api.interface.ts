/**
 * Exports input service protected API.
 *
 * @module input/input-service-protected-api.interface
 */

/**
 * Input service protected API.
 */
export interface InputServiceProtectedApi {
  /**
   * Is current input state cancellable?
   */
  isCancellable: boolean;

  /**
   * Currently pressed mouse key.
   */
  pressedMouseKey: number;

  /**
   * Currently pressed operation key.
   */
  pressedOperationKey: number;

  /**
   * Was the specified operation key just pressed?
   *
   * @param keyId Operation key ID.
   * @returns True if operation key was pressed, false otherwise.
   */
  isOperationKeyJustPressed(keyId: number): boolean;

  /**
   * Was the specified mouse button just pressed?
   *
   * @param keyCode Mouse key code.
   * @returns True if mouse button was pressed, false otherwise.
   */
  isMouseKeyJustPressed(keyCode: number): boolean;
}
