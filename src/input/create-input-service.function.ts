/**
 * Exports create input service function.
 *
 * @module input/create-input-service.function
 */
import type { InputService } from './input-service.interface';

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Is specified operation key pressed?
 *
 * @param keyId Operation key ID.
 * @returns True if operation key is pressed, false otherwise.
 * @private
 * @static
 */
function isKeyPressed(keyId: number) {
  for (let i = 0; i <= Agtk.controllers.MaxControllerId; i++) {
    if (Agtk.controllers.getOperationKeyPressed(i, keyId)) {
      return true;
    }
  }

  return false;
}

/**
 * Is specified mouse button pressed?
 *
 * @param keyCode Mouse key code.
 * @returns True if mouse button is pressed, false otherwise.
 * @private
 * @static
 */
function isMousePressed(keyCode: number) {
  if (Agtk.controllers.getKeyValue(0, keyCode) !== 0) {
    return true;
  }

  return false;
}

export function createInputService(isCancellable?: boolean): InputService {
  //////////////////////////////////////////////////////////////////////////////
  // Private Properties
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Currently pressed operation key.
   *
   * @private
   */
  let pressedKey = ~0;

  /**
   * Currently pressed mouse operation key.
   *
   * @private
   */
  let mousePressedKey = ~0;

  //////////////////////////////////////////////////////////////////////////////
  // Private Methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Was the specified operation key just pressed?
   *
   * @param keyId Operation key ID.
   * @returns True if operation key was pressed, false otherwise.
   */
  function isKeyJustPressed(keyId: number) {
    const pressed = isKeyPressed(keyId);

    if (!(pressedKey & (1 << keyId)) && pressed) {
      pressedKey = (pressedKey & ~(1 << keyId)) | (pressed ? 1 << keyId : 0);
      return true;
    }

    pressedKey = (pressedKey & ~(1 << keyId)) | (pressed ? 1 << keyId : 0);

    return false;
  }

  /**
   * Was the specified mouse button just pressed?
   *
   * @param keyCode Mouse key code.
   * @returns True if mouse button was pressed, false otherwise.
   */
  function isMouseJustPressed(keyCode: number) {
    const pressed = isMousePressed(keyCode);

    if (!(mousePressedKey & (1 << keyCode)) && pressed) {
      mousePressedKey = (mousePressedKey & ~(1 << keyCode)) | (pressed ? 1 << keyCode : 0);
      return true;
    }

    mousePressedKey = (mousePressedKey & ~(1 << keyCode)) | (pressed ? 1 << keyCode : 0);

    return false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Public API
  //////////////////////////////////////////////////////////////////////////////

  return {
    isCancellable: function () {
      return !!isCancellable;
    },

    isKeyOkJustPressed: function () {
      return isKeyJustPressed(Agtk.constants.controllers.OperationKeyOk);
    },

    isKeyCancelJustPressed: function () {
      return isKeyJustPressed(Agtk.constants.controllers.OperationKeyCancel);
    },

    isKeyUpJustPressed: function () {
      return isKeyJustPressed(Agtk.constants.controllers.OperationKeyUp);
    },

    isKeyDownJustPressed: function () {
      return isKeyJustPressed(Agtk.constants.controllers.OperationKeyDown);
    },

    isMouseLeftClickJustPressed: function () {
      return isMouseJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_LeftClick);
    },

    isMouseRightClickJustPressed: function () {
      return isMouseJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_RightClick);
    }
  };
}
