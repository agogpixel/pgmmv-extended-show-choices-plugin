/**
 * Exports a plugin instance factory.
 *
 * @module
 */
import { createPlugin as createBasePlugin } from '@agogpixel/pgmmv-plugin-support/src/create-plugin.function';
import type { AgtkActionCommandPlugin } from '@agogpixel/pgmmv-ts/api/agtk/plugin/action-command-plugin';
import type { AgtkLinkConditionPlugin } from '@agogpixel/pgmmv-ts/api/agtk/plugin/link-condition-plugin';

import { actionCommands, execActionCommand } from './action-commands';
import { createChoicesLayerClass, ShowChoicesContext } from './action-commands/show-choices';
import type { InternalData } from './internal-data.type';
import { execLinkCondition, linkConditions } from './link-conditions';
import localizations from './locale';
import { parameters } from './parameters';
import type { PluginProtectedApi } from './plugin-protected-api.interface';

/**
 * Creates a plugin instance.
 *
 * @returns Extended Show Choices plugin instance.
 */
export function createPlugin() {
  /**
   * Contains methods and properties from the base plugin that are meant for
   * internal use in our plugin.
   */
  const internalApi = {} as PluginProtectedApi;

  /**
   * Create our plugin instance - we provide our plugin localizations,
   * UI parameters, action commands, link conditions, and our internal
   * API object.
   */
  const self = createBasePlugin<
    InternalData,
    AgtkActionCommandPlugin<InternalData> & AgtkLinkConditionPlugin<InternalData>
  >({ localizations, parameters, actionCommands, linkConditions }, internalApi);

  //////////////////////////////////////////////////////////////////////////////
  // Internal API
  //////////////////////////////////////////////////////////////////////////////

  internalApi.paramValue = [];
  internalApi.selectedInfo = {};
  internalApi.showing = false;

  internalApi.destroyChoices = function (removeFromParent = true) {
    if (internalApi.showChoicesContext) {
      const showChoicesContext = internalApi.showChoicesContext as Partial<ShowChoicesContext>;
      const display = showChoicesContext.display;

      if (display && removeFromParent) {
        display.removeFromParent();
      }

      delete showChoicesContext.display;
      delete showChoicesContext.instanceId;
      delete showChoicesContext.objectId;
      delete showChoicesContext.variableId;
    }

    internalApi.showing = false;
  };

  internalApi.setSelectedInfo = function (objectId, instanceId, index, variableId) {
    internalApi.selectedInfo[`${objectId}-${instanceId}`] = index;

    if (variableId >= 0) {
      const instance = Agtk.objectInstances.get(instanceId);

      if (instance !== null) {
        const variable = instance.variables.get(variableId);

        if (variable !== null) {
          // Store selected choice with 1-based indexing.
          variable.setValue(index + 1);
        }
      }
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  // Public API
  //////////////////////////////////////////////////////////////////////////////

  // Reference the 'parent' initialize implementation.
  const _initialize = self.initialize;

  /**
   * Initializes plugin. Called from PGMMV editor & runtime.
   *
   * @param data Internal data that is saved/retrieved for this plugin.
   * @public
   */
  self.initialize = function (data) {
    // Invoke our 'parent' plugin method (sets or initializes internal data,
    // etc.).
    _initialize(data);

    if (internalApi.inEditor()) {
      // Global APIs such as `Agtk` or `cc` or whatever are not really available
      // when the plugin is initializing within the PGMMV editor environment.
      // Bail out here.
      return;
    }

    // Initialize any runtime dependencies.

    // For Cocos scene graph stuffs.
    internalApi.layerTag = self.id << 16;

    // Treat this class constructor as a singleton within the scope of this
    // plugin.
    internalApi.ChoicesLayer = createChoicesLayerClass();
  };

  /**
   * Sets data configured in plugin parameters. Called from PGMMV editor & runtime.
   *
   * User defined default values will be set & stored here.
   *
   * @param param Plugin UI parameters.
   * @public
   */
  self.setParamValue = function (param) {
    internalApi.paramValue = internalApi.normalizeUiParameters(param);
  };

  /**
   * Executes action command.
   *
   * @param actionCommandIndex The index of a given action command.
   * @param parameter Action command data that is set in & provided by the PGMMV
   * editor or runtime.
   * @param objectId The object ID of the object instance through which the
   * action command is executing.
   * @param instanceId The instance ID of the object instance through which the
   * action command is executing.
   * @returns Action command behavior signal.
   * @public
   */
  self.execActionCommand = function (actionCommandIndex, parameter, objectId, instanceId) {
    return execActionCommand(
      internalApi,
      actionCommandIndex,
      internalApi.normalizeActionCommandParameters(actionCommandIndex, parameter),
      objectId,
      instanceId
    );
  };

  /**
   * Evaluates link condition.
   *
   * @param linkConditionIndex The index of a given link condition.
   * @param parameter Link condition data that is set in & provided by the PGMMV
   * editor or runtime.
   * @param objectId The object ID of the object instance through which the
   * link condition is evaluating.
   * @param instanceId The instance ID of the object instance through which the
   * link condition is evaluating.
   * @returns True if link condition is satisfied, false otherwise.
   * @public
   */
  self.execLinkCondition = function (linkConditionIndex, parameter, objectId, instanceId) {
    return execLinkCondition(
      internalApi,
      linkConditionIndex,
      internalApi.normalizeLinkConditionParameters(linkConditionIndex, parameter),
      objectId,
      instanceId
    );
  };

  //////////////////////////////////////////////////////////////////////////////
  // Plugin Ready!
  //////////////////////////////////////////////////////////////////////////////
  return self;
}
