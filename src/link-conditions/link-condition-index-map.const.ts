/**
 * Exports link condition index map.
 *
 * @module link-conditions/link-condition-index-map.const
 */
import { LinkConditionId } from './link-condition-id.enum';
import { linkConditions } from './link-conditions.config';

/**
 * Map a link condition ID to its corresponding index within the
 * {@link AgtkPluginLinkCondition} parameter data provided by this plugin.
 *
 * Populated at runtime.
 */
export const linkConditionIndexMap = {} as Record<LinkConditionId, number>;

for (let i = 0; i < linkConditions.length; ++i) {
  linkConditionIndexMap[linkConditions[i].id as LinkConditionId] = i;
}
