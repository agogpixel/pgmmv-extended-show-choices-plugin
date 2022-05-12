/**
 * Exports link condition configurations.
 *
 * @module link-conditions/link-conditions.config
 */
import type { AgtkPluginLinkCondition } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-link-condition';

import { choiceSelectedParameters } from './choice-selected';
import { LinkConditionId } from './link-condition-id.enum';

/**
 * Link condition configurations.
 */
export const linkConditions: AgtkPluginLinkCondition[] = [
  {
    id: LinkConditionId.ChoiceSelected,
    name: 'loca(LINK_CONDITION_CHOICE_SELECTED_NAME)',
    description: 'loca(LINK_CONDITION_CHOICE_SELECTED_DESCRIPTION)',
    parameter: choiceSelectedParameters
  }
];
