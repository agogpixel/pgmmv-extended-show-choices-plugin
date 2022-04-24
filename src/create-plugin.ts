import { createPlugin as createBasePlugin, PluginProtectedApi } from '@agogpixel/pgmmv-plugin-support';
import {
  AgtkActionCommandPlugin,
  AgtkLinkConditionPlugin,
  AgtkPluginInfoCategory,
  JsonValue
} from '@agogpixel/pgmmv-ts/api';

import {
  ActionCommandId,
  actionCommands,
  ShowChoicesCancelParameterId,
  ShowChoicesParameterId
} from './action-commands';
import {
  ChoicesLayer,
  ChoicesLayerBackground,
  ChoicesLayerClass,
  ChoicesLayerDataService,
  ChoicesLayerPosition,
  createChoicesLayerClass
} from './choices-layer';
import { ChoiceSelectedConditionParameterId, LinkConditionId, linkConditions } from './link-conditions';
import localizations from './locale';
import { ParameterId, parameters } from './parameters';

////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
type InternalData = JsonValue;

/**
 *
 */
type Parameter = {
  id: number;
  value: JsonValue;
};

////////////////////////////////////////////////////////////////////////////////
// Private Static Properties
////////////////////////////////////////////////////////////////////////////////

const actionCommandIndexMap = {
  [ActionCommandId.ShowChoices]: 0
};

const linkConditionIndexMap = {
  [LinkConditionId.ChoiceSelected]: 0
};

let ChoicesLayer: ChoicesLayerClass;

/**
 *
 * @returns
 */
export function createPlugin() {
  //////////////////////////////////////////////////////////////////////////////
  // Private Properties
  //////////////////////////////////////////////////////////////////////////////

  let choicesLayer: ChoicesLayer;

  let layerTag: number;

  let paramValue: Parameter[] = [];

  const selectedInfo: Record<string, number> = {};

  let showing = false;

  //////////////////////////////////////////////////////////////////////////////
  // Private Methods
  //////////////////////////////////////////////////////////////////////////////

  function completeValueJson(actionCommandIndex: number, valueJson: Parameter[]) {
    const vj = self.getInfo(AgtkPluginInfoCategory.ActionCommand)[actionCommandIndex];
    const parameter = vj.parameter;

    if (!!parameter) {
      for (let i = 0; i < parameter.length; i++) {
        const id = parameter[i].id;
        let found = false;

        for (let j = 0; j < valueJson.length; j++) {
          if (valueJson[j].id == id) {
            found = true;
            break;
          }
        }

        if (!found) {
          valueJson.push({ id: id, value: parameter[i].defaultValue as JsonValue });
        }
      }
    }

    return valueJson;
  }

  function createChoices(valueJson: Parameter[], objectId: number, instanceId: number) {
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
    setSelectedInfo(choicesLayer.objectId, choicesLayer.instanceId, -2, choicesLayer.service.getVariableId());

    // Block further action command processing on the object instance until
    // a choice is made.
    return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
  }

  function createChoicesLayerDataService(valueJson: Parameter[]): ChoicesLayerDataService {
    const winSize = cc.director.getWinSize();

    return {
      destroyChoices,
      getBgImageId: function () {
        return getValue(paramValue, ParameterId.Image) as number;
      },
      getBgType: function () {
        return getValue(valueJson, ShowChoicesParameterId.Background) as ChoicesLayerBackground;
      },
      getFontId: function () {
        return getValue(valueJson, ShowChoicesParameterId.Font) as number;
      },
      getLocale: function () {
        return internalApi.localization.getLocale();
      },
      getNumChoices: function () {
        return ShowChoicesParameterId.Choice6;
      },
      getPosition: function () {
        return getValue(valueJson, ShowChoicesParameterId.Position) as ChoicesLayerPosition;
      },
      getScreenHeight: function () {
        return winSize.height;
      },
      getScreenWidth: function () {
        return winSize.width;
      },
      getTextId: function (choiceIndex) {
        return getValue(valueJson, choiceIndex) as number;
      },
      getVariableId: function () {
        return getValue(valueJson, ShowChoicesParameterId.Variable) as number;
      },
      isCancellable: function () {
        return getValue(valueJson, ShowChoicesParameterId.Cancel) === ShowChoicesCancelParameterId.Enabled;
      },
      isShowing: function () {
        return showing;
      },
      setSelectedInfo
    };
  }

  function destroyChoices(removeFromParent = true) {
    if (choicesLayer) {
      if (removeFromParent) {
        choicesLayer.removeFromParent();
      }

      choicesLayer = undefined as unknown as ChoicesLayer;
    }

    showing = false;
  }

  function execShowChoices(actionCommandIndex: number, parameter: Parameter[], objectId: number, instanceId: number) {
    if (showing) {
      if (choicesLayer.objectId !== objectId || choicesLayer.instanceId !== instanceId) {
        // Show Choices is requested by another instance.
        // Cancel the current choices.
        const result = choicesLayer.service.isCancellable() ? -1 : choicesLayer.currentIndex;
        setSelectedInfo(choicesLayer.objectId, choicesLayer.instanceId, result, choicesLayer.service.getVariableId());
        destroyChoices(true);
      }
    }

    if (showing) {
      return choicesLayer.update();
    }

    const valueJson = completeValueJson(actionCommandIndex, parameter);
    return createChoices(valueJson, objectId, instanceId);
  }

  function getValue(valueJson: Parameter[], id: number) {
    for (let i = 0; i < valueJson.length; i++) {
      if (valueJson[i].id === id) {
        return valueJson[i].value;
      }
    }

    return null;
  }

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
   */
  const self = createBasePlugin<
    InternalData,
    AgtkActionCommandPlugin<InternalData> & AgtkLinkConditionPlugin<InternalData>
  >({ localizations, parameters, actionCommands, linkConditions }, internalApi);

  const _initialize = self.initialize;
  self.initialize = function (data) {
    _initialize(data);

    if (internalApi.inEditor()) {
      return;
    }

    layerTag = self.id << 16;
    ChoicesLayer = createChoicesLayerClass();
  };

  self.setParamValue = function (param) {
    paramValue = param;
  };

  self.execActionCommand = function (actionCommandIndex, parameter, objectId, instanceId) {
    switch (actionCommandIndex) {
      case actionCommandIndexMap[ActionCommandId.ShowChoices]:
        return execShowChoices(actionCommandIndex, parameter, objectId, instanceId);
      default:
        break;
    }
  };

  self.execLinkCondition = function (linkConditionIndex, parameter, objectId, instanceId) {
    let info = -2;
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
      if (info === -1) {
        return true;
      }

      return false;
    }

    return false;
  };

  return self;
}
