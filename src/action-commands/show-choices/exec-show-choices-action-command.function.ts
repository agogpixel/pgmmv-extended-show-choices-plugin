/**
 * Exports exec 'Show Choices' action command functions.
 *
 * @module action-commands/exec-show-choices-action-command.function
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import { ParameterId } from '../../parameters/parameter-id.enum';
import type { PluginProtectedApi } from '../../plugin-protected-api.interface';
import { createInputService } from '../../utils/input/create-input-service.function';
import type { InputService } from '../../utils/input/input-service.interface';

import { ShowChoicesBackgroundDisplayTypeParameterId } from './parameters/show-choices-background-display-type-parameter-id.enum';
import { ShowChoicesCancelParameterId } from './parameters/show-choices-cancel-parameter-id.enum';
import { ShowChoicesHorizontalPositionParameterId } from './parameters/show-choices-horizontal-position-parameter-id.enum';
import { ShowChoicesParameterId } from './parameters/show-choices-parameter-id.enum';
import { ShowChoicesVerticalPositionParameterId } from './parameters/show-choices-vertical-position-parameter-id.enum';
import { createShowChoicesService } from './service/create-show-choices-service.function';
import type { ShowChoicesService } from './service/show-choices-service.interface';
import type { ShowChoicesBackgroundDisplayType } from './show-choices-background-display-type.enum';
import type { ShowChoicesHorizontalPosition } from './show-choices-horizontal-position.enum';
import type { ShowChoicesVerticalPosition } from './show-choices-vertical-position.enum';
import { choiceIdBase, maxChoices } from './show-choices.const';

/**
 * Begin execution of the 'Show Choices' action command 'business' logic.
 *
 * @param internalApi The plugin's internal API.
 * @param parameter 'Show Choices' action command data that is set in &
 * provided by the PGMMV editor or runtime & subsequently normalized.
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
  parameter: Record<number, JsonValue>,
  objectId: number,
  instanceId: number
) {
  if (internalApi.showing) {
    if (
      internalApi.showChoicesContext.objectId !== objectId ||
      internalApi.showChoicesContext.instanceId !== instanceId
    ) {
      // Show Choices is requested by another instance.
      // Cancel the current choices.
      const result = internalApi.showChoicesContext.display.inputService.isCancellable()
        ? internalApi.showChoicesContext.display.showChoicesService.getCancelValue()
        : internalApi.showChoicesContext.display.currentIndex;

      internalApi.setSelectedInfo(
        internalApi.showChoicesContext.objectId,
        internalApi.showChoicesContext.instanceId,
        result,
        internalApi.showChoicesContext.variableId
      );

      internalApi.destroyChoices(true);
    }
  }

  if (internalApi.showing) {
    return internalApi.showChoicesContext.display.update();
  }

  return createChoices(internalApi, parameter, objectId, instanceId);
}

/**
 * Helper method for creating & showing choices for a given 'Show Choices'
 * action command.
 *
 * @param internalApi The plugin's internal API.
 * @param valueJson 'Show Choices' action command data that is set in &
 * provided by the PGMMV editor or runtime & subsequently normalized.
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
  valueJson: Record<number, JsonValue>,
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
  const services = createServices(internalApi, valueJson);
  internalApi.showChoicesContext = {
    display: new internalApi.ChoicesLayer(services[0], services[1]),
    instanceId,
    objectId,
    variableId: valueJson[ShowChoicesParameterId.Variable] as number
  };
  agtkLayer.addChild(internalApi.showChoicesContext.display, 0, internalApi.layerTag);

  // Update plugin state.
  internalApi.showing = true;
  internalApi.setSelectedInfo(
    internalApi.showChoicesContext.objectId,
    internalApi.showChoicesContext.instanceId,
    internalApi.showChoicesContext.display.showChoicesService.getNoChoiceMadeValue(),
    internalApi.showChoicesContext.variableId
  );

  // Block further action command processing on the object instance until
  // a choice is made.
  return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
}

function createServices(
  internalApi: PluginProtectedApi,
  valueJson: Record<number, JsonValue>
): [InputService, ShowChoicesService] {
  const inputService = createInputService({
    isCancellable: parseCancelParameterValue(internalApi, valueJson)
  });

  const showChoicesService = createShowChoicesService({
    backgroundBorderColor: parseBackgroundBorderColorParameterValue(internalApi, valueJson),
    backgroundColor: parseBackgroundColorParameterValue(internalApi, valueJson),
    backgroundDisplayType: parseBackgroundDisplayTypeParameterValue(internalApi, valueJson),
    backgroundImageId: parseBackgroundImageParameterValue(internalApi, valueJson),
    defaultChoice: 1,
    fontId: parseFontParameterValue(internalApi, valueJson),
    highlightColor: parseHighlightColorParameterValue(internalApi, valueJson),
    horizontalPosition: parseHorizontalPositionParameterValue(internalApi, valueJson),
    locale: internalApi.localization.getLocale(),
    maxChoices,
    textIds: parseChoiceParameterValues(internalApi, valueJson),
    verticalPosition: parseVerticalPositionParameterValue(internalApi, valueJson)
  });

  showChoicesService.destroyChoices = function (removeFromParent) {
    internalApi.destroyChoices(removeFromParent);
  };

  showChoicesService.setChoice = function (choiceIndex) {
    internalApi.setSelectedInfo(
      internalApi.showChoicesContext.objectId,
      internalApi.showChoicesContext.instanceId,
      choiceIndex,
      internalApi.showChoicesContext.variableId
    );
  };

  return [inputService, showChoicesService];
}

function normalizeColorString(rawValue: string) {
  return rawValue
    .split(',')
    .map((c) => {
      const n = parseInt(c.trim(), 10);
      return isNaN(n) ? undefined : cc.clampf(n, 0, 255);
    })
    .filter((c) => c !== undefined) as number[];
}

function parseBackgroundBorderColorParameterValue(
  internalApi: PluginProtectedApi,
  valueJson: Record<number, JsonValue>
) {
  let rawValue = ((valueJson[ShowChoicesParameterId.BackgroundBorderColor] as string) || '').trim();
  let value = normalizeColorString(rawValue);

  if (value.length < 3 || value.length > 4) {
    rawValue = ((internalApi.paramValue[ParameterId.BackgroundBorderColor] as string) || '').trim();
    value = normalizeColorString(rawValue);
  }

  if (value.length < 3 || value.length > 4) {
    return;
  }

  if (value.length === 3) {
    value.push(255);
  }

  return value as [number, number, number, number];
}

function parseBackgroundColorParameterValue(internalApi: PluginProtectedApi, valueJson: Record<number, JsonValue>) {
  let rawValue = ((valueJson[ShowChoicesParameterId.BackgroundColor] as string) || '').trim();
  let value = normalizeColorString(rawValue);

  if (value.length < 3 || value.length > 4) {
    rawValue = ((internalApi.paramValue[ParameterId.BackgroundColor] as string) || '').trim();
    value = normalizeColorString(rawValue);
  }

  if (value.length < 3 || value.length > 4) {
    return;
  }

  if (value.length === 3) {
    value.push(128);
  }

  return value as [number, number, number, number];
}

function parseBackgroundDisplayTypeParameterValue(
  internalApi: PluginProtectedApi,
  valueJson: Record<number, JsonValue>
) {
  let value = valueJson[ShowChoicesParameterId.BackgroundDisplayType];

  if (value === ShowChoicesBackgroundDisplayTypeParameterId.Default) {
    value = internalApi.paramValue[ParameterId.BackgroundDisplayType];
  }

  return value as ShowChoicesBackgroundDisplayType;
}

function parseBackgroundImageParameterValue(internalApi: PluginProtectedApi, valueJson: Record<number, JsonValue>) {
  let value = valueJson[ShowChoicesParameterId.BackgroundImage] as number;

  if (value < 0) {
    value = internalApi.paramValue[ParameterId.BackgroundImage] as number;
  }

  return value < 0 ? undefined : value;
}

function parseCancelParameterValue(internalApi: PluginProtectedApi, valueJson: Record<number, JsonValue>) {
  let value = valueJson[ShowChoicesParameterId.Cancel];

  if (value === ShowChoicesCancelParameterId.Default) {
    value = internalApi.paramValue[ParameterId.Cancel];
  }

  return value === ShowChoicesCancelParameterId.Enabled;
}

function parseChoiceParameterValues(internalApi: PluginProtectedApi, valueJson: Record<number, JsonValue>) {
  const values: number[] = [];

  for (let i = 0; i < maxChoices; ++i) {
    values.push(valueJson[choiceIdBase + i + 1] as number);
  }

  return values;
}

function parseFontParameterValue(internalApi: PluginProtectedApi, valueJson: Record<number, JsonValue>) {
  let value = valueJson[ShowChoicesParameterId.Font] as number;

  if (value < 0) {
    value = internalApi.paramValue[ParameterId.Font] as number;
  }

  return value;
}

function parseHighlightColorParameterValue(internalApi: PluginProtectedApi, valueJson: Record<number, JsonValue>) {
  let rawValue = ((valueJson[ShowChoicesParameterId.HighlightColor] as string) || '').trim();
  let value = normalizeColorString(rawValue);

  if (value.length < 3 || value.length > 4) {
    rawValue = ((internalApi.paramValue[ParameterId.HighlightColor] as string) || '').trim();
    value = normalizeColorString(rawValue);
  }

  if (value.length < 3 || value.length > 4) {
    return;
  }

  if (value.length === 3) {
    value.push(128);
  }

  return value as [number, number, number, number];
}

function parseHorizontalPositionParameterValue(internalApi: PluginProtectedApi, valueJson: Record<number, JsonValue>) {
  let value = valueJson[ShowChoicesParameterId.HorizontalPosition];

  if (value === ShowChoicesHorizontalPositionParameterId.Default) {
    value = internalApi.paramValue[ParameterId.HorizontalPosition];
  }

  return value as ShowChoicesHorizontalPosition;
}

function parseVerticalPositionParameterValue(internalApi: PluginProtectedApi, valueJson: Record<number, JsonValue>) {
  let value = valueJson[ShowChoicesParameterId.VerticalPosition];

  if (value === ShowChoicesVerticalPositionParameterId.Default) {
    value = internalApi.paramValue[ParameterId.VerticalPosition];
  }

  return value as ShowChoicesVerticalPosition;
}
