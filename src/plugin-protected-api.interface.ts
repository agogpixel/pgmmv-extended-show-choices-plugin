/**
 * Exports the plugin protected API.
 *
 * @module
 */
import type { PluginProtectedApi as BasePluginProtectedApi } from '@agogpixel/pgmmv-plugin-support/src/plugin-protected-api.interface';
import type { JsonValue } from '@agogpixel/pgmmv-ts/api/types/json';

import type { ChoicesLayerClass, ShowChoicesContext } from './action-commands/show-choices';
import type { InternalData } from './internal-data.type';

/**
 * The plugin's internal API.
 */
export interface PluginProtectedApi extends BasePluginProtectedApi<InternalData> {
  /**
   * References our custom ChoicesLayer class constructor that is created
   * during plugin initialization. Not set when in editor.
   *
   * In the original plugin, this class constructor was created each & every time
   * we showed choices. In this iteration, we create the class constructor once;
   * any differences in choices data is handled at the class instantiation level
   * (@see {@link ChoicesLayerDataService}).
   */
  ChoicesLayer: ChoicesLayerClass;

  /**
   * Reference to the current show choices context.
   */
  showChoicesContext: ShowChoicesContext;

  /**
   * Identifies our choices layer instance within Cocos. Set on plugin
   * initialization.
   */
  layerTag: number;

  /**
   * References the UI parameter values set in & provided by the PGMMV editor
   * or runtime, and subsequently normalized with default values as needed.
   */
  paramValue: Record<number, JsonValue>;

  /**
   * Maps concatenation of a given objectId/instanceId pair to its
   * corresponding choice index (0-based indexing), if any.
   */
  selectedInfo: Record<string, number>;

  /**
   * Choices layer display flag.
   */
  showing: boolean;

  /**
   * Hide & destroy the current choices layer, if set.
   *
   * @param removeFromParent (Default: true) Remove the current choices layer
   * from its scene graph parent?
   */
  destroyChoices(removeFromParent?: boolean): void;

  /**
   * For a given object instance's 'Show Choices' action command, sets the
   * selected choice (when made) in the specified variable.
   *
   * @param objectId The object ID of the object instance through which the
   * 'Show Choices' action command is executing.
   * @param instanceId The instance ID of the object instance through which the
   * 'Show Choices' action command is executing.
   * @param index Selected choice index (0-based indexing).
   * @param variableId The ID of the variable in which we will store the choice
   * index (1-based indexing).
   */
  setSelectedInfo(objectId: number, instanceId: number, index: number, variableId: number): void;
}
