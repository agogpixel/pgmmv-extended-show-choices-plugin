/**
 * Exports exec 'Show Choices' action command functions.
 *
 * @module action-commands/exec-show-choices-action-command.function
 */
import type { AgtkPluginParameterValue } from '@agogpixel/pgmmv-ts/api';
import { AgtkPluginInfoCategory } from '@agogpixel/pgmmv-ts/api';

import { cancelChoiceMade, noChoiceMade } from '../../choices';
import type { ChoicesLayerBackground, ChoicesLayerDataService, ChoicesLayerPosition } from '../../choices-layer';
import { ParameterId } from '../../parameters';
import type { PluginProtectedApi } from '../../plugin-protected-api.interface';

import { ShowChoicesCancelParameterId, ShowChoicesParameterId } from './parameters';

/**
 * Begin execution of the 'Show Choices' action command 'business' logic.
 *
 * @param internalApi The plugin's internal API.
 * @param actionCommandIndex The current index of the 'Show Choices' action
 * command.
 * @param parameter 'Show Choices' action command data that is set in &
 * provided by the PGMMV editor or runtime.
 * @param objectId The object ID of the object instance through which the
 * 'Show Choices' action command is executing.
 * @param instanceId The instance ID of the object instance through which the
 * 'Show Choices' action command is executing.
 * @returns Action command behavior signal. Usually, Block is returned when we
 * are waiting for a choice to be made (hence this method will be called again
 * on the next frame); Next is returned once a choice is made, or an error
 * occured.
 */
export function execShowChoicesActionCommand(
  internalApi: PluginProtectedApi,
  actionCommandIndex: number,
  parameter: AgtkPluginParameterValue[],
  objectId: number,
  instanceId: number
) {
  if (internalApi.showing) {
    if (internalApi.choicesLayer.objectId !== objectId || internalApi.choicesLayer.instanceId !== instanceId) {
      // Show Choices is requested by another instance.
      // Cancel the current choices.
      const result = internalApi.choicesLayer.service.isCancellable()
        ? cancelChoiceMade
        : internalApi.choicesLayer.currentIndex;
      internalApi.setSelectedInfo(
        internalApi.choicesLayer.objectId,
        internalApi.choicesLayer.instanceId,
        result,
        internalApi.choicesLayer.service.getVariableId()
      );
      internalApi.destroyChoices(true);
    }
  }

  if (internalApi.showing) {
    return internalApi.choicesLayer.update();
  }

  const valueJson = internalApi.populateParameterDefaults(
    AgtkPluginInfoCategory.ActionCommand,
    actionCommandIndex,
    parameter
  );

  return createChoices(internalApi, valueJson, objectId, instanceId);
}

/**
 * Helper method for creating & showing choices for a given 'Show Choices'
 * action command.
 *
 * @param internalApi The plugin's internal API.
 * @param valueJson 'Show Choices' action command data that is set in &
 * provided by the PGMMV editor or runtime.
 * @param objectId The object ID of the object instance through which the
 * 'Show Choices' action command is executing.
 * @param instanceId The instance ID of the object instance through which the
 * 'Show Choices' action command is executing.
 * @returns Action command behavior signal. Normally, this will be a Block
 * signal but Next can be returned if there are errors encountered.
 * @private
 */
function createChoices(
  internalApi: PluginProtectedApi,
  valueJson: AgtkPluginParameterValue[],
  objectId: number,
  instanceId: number
) {
  // We will show the choices on our implicit menu/ui/hud layer provided by PGMMV runtime.
  const agtkLayer = Agtk.sceneInstances.getCurrent().getMenuLayerById(Agtk.constants.systemLayers.HudLayerId);

  if (!agtkLayer) {
    // Bail out on creating & displaying the choices.
    // Continue action command processing on the object instance.
    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
  }

  // Create & display the choices.
  const service = createChoicesLayerDataService(internalApi, valueJson);
  internalApi.choicesLayer = new internalApi.ChoicesLayer(service, objectId, instanceId);
  agtkLayer.addChild(internalApi.choicesLayer, 0, internalApi.layerTag);

  // Update plugin state.
  internalApi.showing = true;
  internalApi.setSelectedInfo(
    internalApi.choicesLayer.objectId,
    internalApi.choicesLayer.instanceId,
    noChoiceMade,
    internalApi.choicesLayer.service.getVariableId()
  );

  // Block further action command processing on the object instance until
  // a choice is made.
  return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
}

/**
 * Create a choices layer data service instance with specified action command data.
 *
 * @param internalApi The plugin's internal API.
 * @param valueJson 'Show Choices' action command data that is set in &
 * provided by the PGMMV editor or runtime.
 * @returns A choices layer data service with data specific for this
 * 'Show Choices' action command.
 * @private
 */
function createChoicesLayerDataService(
  internalApi: PluginProtectedApi,
  valueJson: AgtkPluginParameterValue[]
): ChoicesLayerDataService {
  const winSize = cc.director.getWinSize();

  return {
    destroyChoices: internalApi.destroyChoices,
    getBgImageId: function () {
      return internalApi.getParameterValueById(internalApi.paramValue, ParameterId.Image) as number;
    },
    getBgType: function () {
      return internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Background) as ChoicesLayerBackground;
    },
    getFontId: function () {
      return internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Font) as number;
    },
    getLocale: function () {
      return internalApi.localization.getLocale();
    },
    getNumChoices: function () {
      return ShowChoicesParameterId.Choice6;
    },
    getPosition: function () {
      return internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Position) as ChoicesLayerPosition;
    },
    getScreenHeight: function () {
      return winSize.height;
    },
    getScreenWidth: function () {
      return winSize.width;
    },
    getTextId: function (choiceIndex) {
      return internalApi.getParameterValueById(valueJson, choiceIndex) as number;
    },
    getVariableId: function () {
      return internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Variable) as number;
    },
    isCancellable: function () {
      return (
        internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Cancel) ===
        ShowChoicesCancelParameterId.Enabled
      );
    },
    isShowing: function () {
      return internalApi.showing;
    },
    setSelectedInfo: internalApi.setSelectedInfo
  };
}
