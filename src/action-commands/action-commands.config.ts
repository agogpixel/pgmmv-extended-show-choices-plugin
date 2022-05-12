/**
 * Exports action command configurations.
 *
 * @module action-commands/action-commands.config
 */
import type { AgtkPluginActionCommand } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-action-command';

import { ActionCommandId } from './action-command-id.enum';
import { createShowChoicesParametersConfig, maxChoices, choiceIdBase, embeddedChoiceIdBase } from './show-choices';

/**
 * Action command configurations.
 */
export const actionCommands: AgtkPluginActionCommand[] = [
  {
    id: ActionCommandId.ShowChoices,
    name: 'loca(ACTION_COMMAND_SHOW_CHOICES_NAME)',
    description: 'loca(ACTION_COMMAND_SHOW_CHOICES_DESCRIPTION)',
    parameter: createShowChoicesParametersConfig(maxChoices, choiceIdBase, embeddedChoiceIdBase)
  }
];
