/**
 * Exports a plugin instance factory.
 *
 * @module
 */
import { createPlugin as createBasePlugin, PluginProtectedApi } from '@agogpixel/pgmmv-plugin-support';
import {
  AgtkActionCommandPlugin,
  AgtkLinkConditionPlugin,
  AgtkPluginInfoCategory,
  AgtkPluginParameterValue,
  JsonValue
} from '@agogpixel/pgmmv-ts/api';

import { ActionCommandId, actionCommands } from './action-commands';
import { ShowChoicesCancelParameterId, ShowChoicesParameterId } from './action-commands/show-choices';
import {
  ChoicesLayer,
  ChoicesLayerBackground,
  ChoicesLayerClass,
  ChoicesLayerDataService,
  ChoicesLayerPosition,
  createChoicesLayerClass
} from './choices-layer';
import { LinkConditionId, linkConditions } from './link-conditions';
import { ChoiceSelectedConditionParameterId } from './link-conditions/choice-selected';
import localizations from './locale';
import { ParameterId, parameters } from './parameters';

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////

/**
 * Internal data type for the plugin.
 *
 * Format is limited to information that can be converted to text strings by
 * JSON.stringify.
 *
 * Saved and restored on gameplay save/load.
 */
type InternalData = JsonValue;

/**
 * Helper type for individual parameters listed in the data that is provided to
 * {@link AgtkPlugin.setParamValue}.
 */
/*type Parameter = {
  id: number;
  value: JsonValue;
};*/

////////////////////////////////////////////////////////////////////////////////
// Private Static Properties
////////////////////////////////////////////////////////////////////////////////

/**
 * Map an action command ID to its corresponding index within the
 * {@link AgtkPluginActionCommand} parameter data provided by this plugin.
 *
 * @private
 * @static
 */
const actionCommandIndexMap = {
  [ActionCommandId.ShowChoices]: 0
};

/**
 * Map a link condition ID to its corresponding index within the
 * {@link AgtkPluginLinkCondition} parameter data provided by this plugin.
 *
 * @private
 * @static
 */
const linkConditionIndexMap = {
  [LinkConditionId.ChoiceSelected]: 0
};

/**
 * References our custom ChoicesLayer class constructor that is created
 * during plugin initialization. Not set when in editor.
 *
 * In the original plugin, this class constructor was created each & every time
 * we showed choices. In this iteration, we create the class constructor once;
 * any differences in choices data is handled at the class instantiation level
 * (@see {@link ChoicesLayerDataService}).
 *
 * @private
 * @static
 */
let ChoicesLayer: ChoicesLayerClass;

const noChoiceMade = -2;
const cancelChoiceMade = -1;

/**
 * Creates a plugin instance.
 *
 * @returns Extended Show Choices plugin instance.
 */
export function createPlugin() {
  //////////////////////////////////////////////////////////////////////////////
  // Private Properties
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Reference to the current choices layer instance.
   *
   * @private
   */
  let choicesLayer: ChoicesLayer;

  /**
   * Identifies our choices layer instance within Cocos. Set on plugin
   * initialization.
   *
   * @private
   */
  let layerTag: number;

  /**
   * References the UI parameter values set in & provided by the PGMMV editor
   * or runtime.
   *
   * @private
   */
  let paramValue: AgtkPluginParameterValue[] = [];

  /**
   * Maps concatenation of a given objectId/instanceId pair to its
   * corresponding choice index (0-based indexing), if any.
   *
   * @private
   */
  const selectedInfo: Record<string, number> = {};

  /**
   * Choices layer display flag.
   *
   * @private
   */
  let showing = false;

  //////////////////////////////////////////////////////////////////////////////
  // Private Methods
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Helper method for creating & showing choices for a given 'Show Choices'
   * action command.
   *
   * @param valueJson 'Show Choices' action command data that is set in &
   * provided by the PGMMV editor or runtime.
   * @param objectId The object ID of the object instance through which the
   * 'Show Choices' action command is executing.
   * @param instanceId The instance ID of the object instance through which the
   * 'Show Choices' action command is executing.
   * @returns Action command behavior signal. Normally, this will be a Block
   * signal but Next can be returned if there are errors encountered.
   * @private
   */
  function createChoices(valueJson: AgtkPluginParameterValue[], objectId: number, instanceId: number) {
    // We will show the choices on our implicit menu/ui/hud layer provided by PGMMV runtime.
    const agtkLayer = Agtk.sceneInstances.getCurrent().getMenuLayerById(Agtk.constants.systemLayers.HudLayerId);

    if (!agtkLayer) {
      // Bail out on creating & displaying the choices.
      // Continue action command processing on the object instance.
      return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
    }

    // Create & display the choices.
    const service = createChoicesLayerDataService(valueJson);
    choicesLayer = new ChoicesLayer(service, objectId, instanceId);
    agtkLayer.addChild(choicesLayer, 0, layerTag);

    // Update plugin state.
    showing = true;
    setSelectedInfo(choicesLayer.objectId, choicesLayer.instanceId, noChoiceMade, choicesLayer.service.getVariableId());

    // Block further action command processing on the object instance until
    // a choice is made.
    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
  }

  /**
   * Create a choices layer data service instance with specified action command data.
   *
   * @param valueJson 'Show Choices' action command data that is set in &
   * provided by the PGMMV editor or runtime.
   * @returns A choices layer data service with data specific for this
   * 'Show Choices' action command.
   * @private
   */
  function createChoicesLayerDataService(valueJson: AgtkPluginParameterValue[]): ChoicesLayerDataService {
    const winSize = cc.director.getWinSize();

    return {
      destroyChoices,
      getBgImageId: function () {
        return internalApi.getParameterValueById(paramValue, ParameterId.Image) as number;
      },
      getBgType: function () {
        return internalApi.getParameterValueById(
          valueJson,
          ShowChoicesParameterId.Background
        ) as ChoicesLayerBackground;
      },
      getFontId: function () {
        return internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Font) as number;
      },
      getLocale: function () {
        return internalApi.localization.getLocale();
      },
      getNumChoices: function () {
        return ShowChoicesParameterId.Choice6;
      },
      getPosition: function () {
        return internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Position) as ChoicesLayerPosition;
      },
      getScreenHeight: function () {
        return winSize.height;
      },
      getScreenWidth: function () {
        return winSize.width;
      },
      getTextId: function (choiceIndex) {
        return internalApi.getParameterValueById(valueJson, choiceIndex) as number;
      },
      getVariableId: function () {
        return internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Variable) as number;
      },
      isCancellable: function () {
        return (
          internalApi.getParameterValueById(valueJson, ShowChoicesParameterId.Cancel) ===
          ShowChoicesCancelParameterId.Enabled
        );
      },
      isShowing: function () {
        return showing;
      },
      setSelectedInfo
    };
  }

  /**
   * Hide & destroy the current choices layer, if set.
   *
   * @param removeFromParent (Default: true) Remove the current choices layer
   * from its scene graph parent?
   * @private
   */
  function destroyChoices(removeFromParent = true) {
    if (choicesLayer) {
      if (removeFromParent) {
        choicesLayer.removeFromParent();
      }

      choicesLayer = undefined as unknown as ChoicesLayer;
    }

    showing = false;
  }

  /**
   * Begin execution of the 'Show Choices' action command 'business' logic.
   *
   * @param actionCommandIndex The current index of the 'Show Choices' action
   * command.
   * @param parameter 'Show Choices' action command data that is set in &
   * provided by the PGMMV editor or runtime.
   * @param objectId The object ID of the object instance through which the
   * 'Show Choices' action command is executing.
   * @param instanceId The instance ID of the object instance through which the
   * 'Show Choices' action command is executing.
   * @returns Action command behavior signal. Usually, Block is returned when we
   * are waiting for a choice to be made (hence this method will be called again
   * on the next frame); Next is returned once a choice is made, or an error
   * occured.
   * @private
   */
  function execShowChoices(
    actionCommandIndex: number,
    parameter: AgtkPluginParameterValue[],
    objectId: number,
    instanceId: number
  ) {
    if (showing) {
      if (choicesLayer.objectId !== objectId || choicesLayer.instanceId !== instanceId) {
        // Show Choices is requested by another instance.
        // Cancel the current choices.
        const result = choicesLayer.service.isCancellable() ? cancelChoiceMade : choicesLayer.currentIndex;
        setSelectedInfo(choicesLayer.objectId, choicesLayer.instanceId, result, choicesLayer.service.getVariableId());
        destroyChoices(true);
      }
    }

    if (showing) {
      return choicesLayer.update();
    }

    const valueJson = internalApi.populateParameterDefaults(
      AgtkPluginInfoCategory.ActionCommand,
      actionCommandIndex,
      parameter
    );

    return createChoices(valueJson, objectId, instanceId);
  }

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
   * @private
   */
  function setSelectedInfo(objectId: number, instanceId: number, index: number, variableId: number) {
    selectedInfo[`${objectId}-${instanceId}`] = index;

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
  }

  //////////////////////////////////////////////////////////////////////////////
  // Protected API
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Contains methods and properties from the base plugin that are meant for
   * internal use in our plugin.
   *
   * @protected
   */
  const internalApi = {} as PluginProtectedApi<InternalData>;

  //////////////////////////////////////////////////////////////////////////////
  // Public API
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Create our plugin instance - we provide our plugin localizations,
   * UI parameters, action commands, link conditions, and our internal
   * API object.
   *
   * @public
   */
  const self = createBasePlugin<
    InternalData,
    AgtkActionCommandPlugin<InternalData> & AgtkLinkConditionPlugin<InternalData>
  >({ localizations, parameters, actionCommands, linkConditions }, internalApi);

  // Reference the 'parent' implementation.
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
    layerTag = self.id << 16;

    // Treat this class constructor as a singleton within the scope of this
    // plugin.
    ChoicesLayer = createChoicesLayerClass();
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
    paramValue = param;
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
    switch (actionCommandIndex) {
      case actionCommandIndexMap[ActionCommandId.ShowChoices]:
        return execShowChoices(actionCommandIndex, parameter, objectId, instanceId);
      default:
        break;
    }

    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
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
    let info = noChoiceMade;
    const key = `${objectId}-${instanceId}`;

    if (key in selectedInfo) {
      info = selectedInfo[key];
    }

    const vj = self.getInfo(AgtkPluginInfoCategory.LinkCondition)[linkConditionIndex];
    let target = vj.parameter[0].defaultValue as number;

    if (parameter.length > 0) {
      target = parameter[linkConditionIndexMap[LinkConditionId.ChoiceSelected]].value as number;
    }

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
  };

  //////////////////////////////////////////////////////////////////////////////
  // Plugin Ready!
  //////////////////////////////////////////////////////////////////////////////
  return self;
}
