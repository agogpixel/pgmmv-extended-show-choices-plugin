import { AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter-type';
import type { AgtkPluginUiParameter } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter';

import { ChoiceSelectedParamaterId } from './choice-selected-parameter-id.enum';

export const choiceSelectedParameters: AgtkPluginUiParameter[] = [
  {
    id: ChoiceSelectedParamaterId.Choice,
    name: 'loca(LINK_CONDITION_CHOICE_SELECTED_PARAMETER_CHOICE_NAME)',
    type: AgtkPluginUiParameterType.Number,
    defaultValue: -1
  }
];
