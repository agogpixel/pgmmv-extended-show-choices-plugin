/**
 * Exports link condition configurations.
 *
 * @module link-conditions/link-conditions.config
 */
import { AgtkPluginUiParameterType, AgtkPluginLinkCondition } from '@agogpixel/pgmmv-ts/api';

import { ChoiceSelectedConditionParameterId, ChoiceSelectedParamaterId } from './choice-selected';
import { LinkConditionId } from './link-condition-id.enum';

/**
 * Link condition configurations.
 */
export const linkConditions: AgtkPluginLinkCondition[] = [
  /**
   * Choice Selected link condition configuration.
   */
  {
    id: LinkConditionId.ChoiceSelected,
    name: 'loca(LINK_CONDITION_0_NAME)',
    description: 'loca(LINK_CONDITION_0_DESCRIPTION)',
    parameter: [
      /**
       * Supports up to 6 choice 'slots' plus a cancel option.
       */
      {
        id: ChoiceSelectedParamaterId.Condition,
        name: 'loca(LINK_CONDITION_0_PARAMETER_0_NAME)',
        type: AgtkPluginUiParameterType.CustomId,
        customParam: [
          { id: ChoiceSelectedConditionParameterId.Choice1, name: 'loca(LINK_CONDITION_0_PARAMETER_0_PARAM_0_NAME)' },
          { id: ChoiceSelectedConditionParameterId.Choice2, name: 'loca(LINK_CONDITION_0_PARAMETER_0_PARAM_1_NAME)' },
          { id: ChoiceSelectedConditionParameterId.Choice3, name: 'loca(LINK_CONDITION_0_PARAMETER_0_PARAM_2_NAME)' },
          { id: ChoiceSelectedConditionParameterId.Choice4, name: 'loca(LINK_CONDITION_0_PARAMETER_0_PARAM_3_NAME)' },
          { id: ChoiceSelectedConditionParameterId.Choice5, name: 'loca(LINK_CONDITION_0_PARAMETER_0_PARAM_4_NAME)' },
          { id: ChoiceSelectedConditionParameterId.Choice6, name: 'loca(LINK_CONDITION_0_PARAMETER_0_PARAM_5_NAME)' },
          { id: ChoiceSelectedConditionParameterId.Cancel, name: 'loca(LINK_CONDITION_0_PARAMETER_0_PARAM_6_NAME)' }
        ],
        defaultValue: ChoiceSelectedConditionParameterId.Choice1
      }
    ]
  }
];
