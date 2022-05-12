/**
 * Exports create input service function.
 *
 * @module input/create-input-service.function
 */
import type { InputServiceConfig } from './input-service-config.interface';
import type { InputServiceProtectedApi } from './input-service-protected-api.interface';
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

export function createInputService(config: InputServiceConfig, internal?: InputServiceProtectedApi): InputService {
  const self = {} as InputService;
  const internalApi = internal || ({} as InputServiceProtectedApi);

  //////////////////////////////////////////////////////////////////////////////
  // Protected API
  //////////////////////////////////////////////////////////////////////////////

  internalApi.isCancellable = !!config.isCancellable;

  internalApi.pressedMouseKey = ~0;

  internalApi.pressedOperationKey = ~0;

  internalApi.isOperationKeyJustPressed = function (keyId: number) {
    const pressed = isKeyPressed(keyId);

    if (!(internalApi.pressedOperationKey & (1 << keyId)) && pressed) {
      internalApi.pressedOperationKey = (internalApi.pressedOperationKey & ~(1 << keyId)) | (pressed ? 1 << keyId : 0);
      return true;
    }

    internalApi.pressedOperationKey = (internalApi.pressedOperationKey & ~(1 << keyId)) | (pressed ? 1 << keyId : 0);

    return false;
  };

  internalApi.isMouseKeyJustPressed = function (keyCode: number) {
    const pressed = isMousePressed(keyCode);

    if (!(internalApi.pressedMouseKey & (1 << keyCode)) && pressed) {
      internalApi.pressedMouseKey = (internalApi.pressedMouseKey & ~(1 << keyCode)) | (pressed ? 1 << keyCode : 0);
      return true;
    }

    internalApi.pressedMouseKey = (internalApi.pressedMouseKey & ~(1 << keyCode)) | (pressed ? 1 << keyCode : 0);

    return false;
  };

  //////////////////////////////////////////////////////////////////////////////
  // Public API
  //////////////////////////////////////////////////////////////////////////////

  self.isCancellable = function () {
    return internalApi.isCancellable;
  };

  self.isKeyOkJustPressed = function () {
    return internalApi.isOperationKeyJustPressed(Agtk.constants.controllers.OperationKeyOk);
  };

  self.isKeyCancelJustPressed = function () {
    return internalApi.isOperationKeyJustPressed(Agtk.constants.controllers.OperationKeyCancel);
  };

  self.isKeyUpJustPressed = function () {
    return internalApi.isOperationKeyJustPressed(Agtk.constants.controllers.OperationKeyUp);
  };

  self.isKeyDownJustPressed = function () {
    return internalApi.isOperationKeyJustPressed(Agtk.constants.controllers.OperationKeyDown);
  };

  self.isMouseLeftClickJustPressed = function () {
    return internalApi.isMouseKeyJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_LeftClick);
  };

  self.isMouseRightClickJustPressed = function () {
    return internalApi.isMouseKeyJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_RightClick);
  };

  return self;
}
