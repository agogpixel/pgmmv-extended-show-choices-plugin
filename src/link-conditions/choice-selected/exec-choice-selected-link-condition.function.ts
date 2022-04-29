/**
 * Exports exec 'Choice Selected' link condition functions.
 *
 * @module link-conditions/choice-selected/exec-choice-selected-link-condition.function
 */
import { AgtkPluginInfoCategory, AgtkPluginParameterValue } from '@agogpixel/pgmmv-ts/api';

import { cancelChoiceMade, noChoiceMade } from '../../choices.const';
import { PluginProtectedApi } from '../../plugin-protected-api.interface';

import { ChoiceSelectedConditionParameterId } from './choice-selected-condition-parameter-id.enum';
import { ChoiceSelectedParamaterId } from './choice-selected-parameter-id.enum';

/**
 * Begin evaluation of the 'Choice Selected' link condition 'business' logic.
 *
 * @param internalApi The plugin's internal API.
 * @param linkConditionIndex The index of a given link condition.
 * @param parameter Link condition data that is set in & provided by the PGMMV
 * editor or runtime.
 * @param objectId The object ID of the object instance through which the
 * link condition is evaluating.
 * @param instanceId The instance ID of the object instance through which the
 * link condition is evaluating.
 * @returns True if link condition is satisfied, false otherwise.
 */
export function execChoiceSelectedLinkCondition(
  internalApi: PluginProtectedApi,
  linkConditionIndex: number,
  parameter: AgtkPluginParameterValue[],
  objectId: number,
  instanceId: number
) {
  let info = noChoiceMade;
  const key = `${objectId}-${instanceId}`;

  if (key in internalApi.selectedInfo) {
    info = internalApi.selectedInfo[key];
  }

  const valueJson = internalApi.populateParameterDefaults(
    AgtkPluginInfoCategory.LinkCondition,
    linkConditionIndex,
    parameter
  );

  const target = internalApi.getParameterValueById(valueJson, ChoiceSelectedParamaterId.Condition) as number;

  if (target >= ChoiceSelectedConditionParameterId.Choice1 && target <= ChoiceSelectedConditionParameterId.Choice6) {
    // info is 0-based indexing, target is 1-based indexing.
    if (info === target - 1) {
      return true;
    }

    return false;
  } else if (target === ChoiceSelectedConditionParameterId.Cancel) {
    if (info === cancelChoiceMade) {
      return true;
    }

    return false;
  }

  return false;
}
