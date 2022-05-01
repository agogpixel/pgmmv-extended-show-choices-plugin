/**
 * Exports input service interface.
 *
 * @module input/input-service.interface
 */

/**
 * Exposes common input API.
 */
export interface InputService {
  /**
   * Is current input state cancellable?
   *
   * @returns True if input state is cancellable, false otherwise.
   */
  isCancellable(): boolean;

  /**
   * Was the OK operation key just pressed?
   *
   * @returns True if OK operation key was pressed, false otherwise.
   */
  isKeyOkJustPressed(): boolean;

  /**
   * Was the CANCEL operation key just pressed?
   *
   * @returns True if CANCEL operation key was pressed, false otherwise.
   */
  isKeyCancelJustPressed(): boolean;

  /**
   * Was the UP operation key just pressed?
   *
   * @returns True if UP operation key was pressed, false otherwise.
   */
  isKeyUpJustPressed(): boolean;

  /**
   * Was the DOWN operation key just pressed?
   *
   * @returns True if DOWN operation key was pressed, false otherwise.
   */
  isKeyDownJustPressed(): boolean;

  /**
   * Was the left mouse button just pressed?
   *
   * @returns True if left mouse button was pressed, false otherwise.
   */
  isMouseLeftClickJustPressed(): boolean;

  /**
   * Was the right mouse button just pressed?
   *
   * @returns True if right mouse button was pressed, false otherwise.
   */
  isMouseRightClickJustPressed(): boolean;
}
