/**
 * Exports action command index map.
 *
 * @module action-commands/action-command-index-map.const
 */
import { ActionCommandId } from './action-command-id.enum';
import { actionCommands } from './action-commands.config';

/**
 * Map an action command ID to its corresponding index within the
 * {@link AgtkPluginActionCommand} parameter data provided by this plugin.
 *
 * Populated at runtime.
 */
export const actionCommandIndexMap = {} as Record<ActionCommandId, number>;

for (let i = 0; i < actionCommands.length; ++i) {
  actionCommandIndexMap[actionCommands[i].id as ActionCommandId] = i;
}
