/**
 * Exports exec 'Choice Selected' link condition functions.
 *
 * @module link-conditions/choice-selected/exec-choice-selected-link-condition.function
 */
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import { noChoiceMade } from '../../utils';
import { PluginProtectedApi } from '../../plugin-protected-api.interface';

import { ChoiceSelectedParamaterId } from './parameters';

/**
 * Begin evaluation of the 'Choice Selected' link condition 'business' logic.
 *
 * @param internalApi The plugin's internal API.
 * @param parameter Link condition data that is set in & provided by the PGMMV
 * editor or runtime & subsequently normalized.
 * @param objectId The object ID of the object instance through which the
 * link condition is evaluating.
 * @param instanceId The instance ID of the object instance through which the
 * link condition is evaluating.
 * @returns True if link condition is satisfied, false otherwise.
 */
export function execChoiceSelectedLinkCondition(
  internalApi: PluginProtectedApi,
  parameter: Record<number, JsonValue>,
  objectId: number,
  instanceId: number
) {
  let info = noChoiceMade;
  const key = `${objectId}-${instanceId}`;

  if (key in internalApi.selectedInfo) {
    info = internalApi.selectedInfo[key];
  }

  const target = parameter[ChoiceSelectedParamaterId.Choice] as number;

  // info is 0-based indexing, target is 1-based indexing.
  return info === target - 1;
}
