/**
 * Exports exec action command functions.
 *
 * @module action-commands/exec-action-command.function
 */
import type { AgtkPluginParameterValue } from '@agogpixel/pgmmv-ts/api';

import type { PluginProtectedApi } from '../plugin-protected-api.interface';

import { ActionCommandId } from './action-command-id.enum';
import { actionCommandIndexMap } from './action-command-index-map.const';
import { execShowChoicesActionCommand } from './show-choices';

/**
 * Executes action command.
 *
 * @param internalApi The plugin's internal API.
 * @param actionCommandIndex The index of a given action command.
 * @param parameter Action command data that is set in & provided by the PGMMV
 * editor or runtime.
 * @param objectId The object ID of the object instance through which the
 * action command is executing.
 * @param instanceId The instance ID of the object instance through which the
 * action command is executing.
 * @returns Action command behavior signal.
 */
export function execActionCommand(
  internalApi: PluginProtectedApi,
  actionCommandIndex: number,
  parameter: AgtkPluginParameterValue[],
  objectId: number,
  instanceId: number
) {
  switch (actionCommandIndex) {
    case actionCommandIndexMap[ActionCommandId.ShowChoices]:
      return execShowChoicesActionCommand(internalApi, actionCommandIndex, parameter, objectId, instanceId);
    default:
      break;
  }

  return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
}
