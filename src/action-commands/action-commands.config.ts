/**
 * Exports action command configurations.
 *
 * @module action-commands/action-commands.config
 */
import { AgtkPluginUiParameterType, AgtkPluginActionCommand } from '@agogpixel/pgmmv-ts/api';

import { ActionCommandId } from './action-command-id.enum';
import {
  ShowChoicesBackgroundParameterId,
  ShowChoicesCancelParameterId,
  ShowChoicesParameterId,
  ShowChoicesPositionParameterId
} from './show-choices';

/**
 * Common default values for the 'Show Choices' action command configuration.
 */
const showChoicesDefaults = {
  /**
   * Default value for ID based parameters.
   */
  idParameter: -1,

  /**
   * Default value for embedded parameter names.
   */
  embeddedName: '',

  /**
   * Default value for embedded parameter references.
   */
  embeddedReference: 'text',

  /**
   * Default value for embedded parameter UI width.
   */
  embeddedWidth: 256,

  /**
   * Default value for embedded parameter UI height.
   */
  embeddedHeight: 48
};

/**
 * Action command configurations.
 */
export const actionCommands: AgtkPluginActionCommand[] = [
  /**
   * Show Choices action command configuration.
   */
  {
    id: ActionCommandId.ShowChoices,
    name: 'loca(ACTION_COMMAND_0_NAME)',
    description: 'loca(ACTION_COMMAND_0_DESCRIPTION)',
    /**
     * - Fixed number of choices.
     * - Each choice has an editable embedded text reference.
     * - Font & background inputs.
     * - Variable storage & cancel behavior inputs.
     */
    parameter: [
      // Configurable choice 'slots'.
      {
        id: ShowChoicesParameterId.Choice1,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_0_NAME)',
        type: AgtkPluginUiParameterType.TextId,
        defaultValue: showChoicesDefaults.idParameter,
        withNewButton: true
      },
      {
        id: ShowChoicesParameterId.Choice1Embedded,
        name: showChoicesDefaults.embeddedName,
        type: AgtkPluginUiParameterType.EmbeddedEditable,
        sourceId: ShowChoicesParameterId.Choice1,
        reference: showChoicesDefaults.embeddedReference,
        width: showChoicesDefaults.embeddedWidth,
        height: showChoicesDefaults.embeddedHeight
      },
      {
        id: ShowChoicesParameterId.Choice2,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_1_NAME)',
        type: AgtkPluginUiParameterType.TextId,
        defaultValue: showChoicesDefaults.idParameter,
        withNewButton: true
      },
      {
        id: ShowChoicesParameterId.Choice2Embedded,
        name: showChoicesDefaults.embeddedName,
        type: AgtkPluginUiParameterType.EmbeddedEditable,
        sourceId: ShowChoicesParameterId.Choice2,
        reference: showChoicesDefaults.embeddedReference,
        width: showChoicesDefaults.embeddedWidth,
        height: showChoicesDefaults.embeddedHeight
      },
      {
        id: ShowChoicesParameterId.Choice3,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_2_NAME)',
        type: AgtkPluginUiParameterType.TextId,
        defaultValue: showChoicesDefaults.idParameter,
        withNewButton: true
      },
      {
        id: ShowChoicesParameterId.Choice3Embedded,
        name: showChoicesDefaults.embeddedName,
        type: AgtkPluginUiParameterType.EmbeddedEditable,
        sourceId: ShowChoicesParameterId.Choice3,
        reference: showChoicesDefaults.embeddedReference,
        width: showChoicesDefaults.embeddedWidth,
        height: showChoicesDefaults.embeddedHeight
      },
      {
        id: ShowChoicesParameterId.Choice4,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_3_NAME)',
        type: AgtkPluginUiParameterType.TextId,
        defaultValue: showChoicesDefaults.idParameter,
        withNewButton: true
      },
      {
        id: ShowChoicesParameterId.Choice4Embedded,
        name: showChoicesDefaults.embeddedName,
        type: AgtkPluginUiParameterType.EmbeddedEditable,
        sourceId: ShowChoicesParameterId.Choice4,
        reference: showChoicesDefaults.embeddedReference,
        width: showChoicesDefaults.embeddedWidth,
        height: showChoicesDefaults.embeddedHeight
      },
      {
        id: ShowChoicesParameterId.Choice5,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_4_NAME)',
        type: AgtkPluginUiParameterType.TextId,
        defaultValue: showChoicesDefaults.idParameter,
        withNewButton: true
      },
      {
        id: ShowChoicesParameterId.Choice5Embedded,
        name: showChoicesDefaults.embeddedName,
        type: AgtkPluginUiParameterType.EmbeddedEditable,
        sourceId: ShowChoicesParameterId.Choice5,
        reference: showChoicesDefaults.embeddedReference,
        width: showChoicesDefaults.embeddedWidth,
        height: showChoicesDefaults.embeddedHeight
      },
      {
        id: ShowChoicesParameterId.Choice6,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_5_NAME)',
        type: AgtkPluginUiParameterType.TextId,
        defaultValue: showChoicesDefaults.idParameter,
        withNewButton: true
      },
      {
        id: ShowChoicesParameterId.Choice6Embedded,
        name: showChoicesDefaults.embeddedName,
        type: AgtkPluginUiParameterType.EmbeddedEditable,
        sourceId: ShowChoicesParameterId.Choice6,
        reference: showChoicesDefaults.embeddedReference,
        width: showChoicesDefaults.embeddedWidth,
        height: showChoicesDefaults.embeddedHeight
      },

      // Display Options.
      {
        id: ShowChoicesParameterId.Font,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_6_NAME)',
        type: AgtkPluginUiParameterType.FontId,
        defaultValue: showChoicesDefaults.idParameter
      },
      {
        id: ShowChoicesParameterId.Background,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_7_NAME)',
        type: AgtkPluginUiParameterType.CustomId,
        customParam: [
          { id: ShowChoicesBackgroundParameterId.WhiteFrame, name: 'loca(ACTION_COMMAND_0_PARAMETER_7_PARAM_0_NAME)' },
          { id: ShowChoicesBackgroundParameterId.Black, name: 'loca(ACTION_COMMAND_0_PARAMETER_7_PARAM_1_NAME)' },
          { id: ShowChoicesBackgroundParameterId.None, name: 'loca(ACTION_COMMAND_0_PARAMETER_7_PARAM_2_NAME)' }
        ],
        defaultValue: ShowChoicesBackgroundParameterId.WhiteFrame
      },
      {
        id: ShowChoicesParameterId.Position,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_8_NAME)',
        type: AgtkPluginUiParameterType.CustomId,
        customParam: [
          { id: ShowChoicesPositionParameterId.Left, name: 'loca(ACTION_COMMAND_0_PARAMETER_8_PARAM_0_NAME)' },
          { id: ShowChoicesPositionParameterId.Center, name: 'loca(ACTION_COMMAND_0_PARAMETER_8_PARAM_1_NAME)' },
          { id: ShowChoicesPositionParameterId.Right, name: 'loca(ACTION_COMMAND_0_PARAMETER_8_PARAM_2_NAME)' }
        ],
        defaultValue: ShowChoicesPositionParameterId.Center
      },

      // Behavior Options.
      {
        id: ShowChoicesParameterId.Variable,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_9_NAME)',
        type: AgtkPluginUiParameterType.VariableId,
        defaultValue: showChoicesDefaults.idParameter,
        withNewButton: true
      },
      {
        id: ShowChoicesParameterId.Cancel,
        name: 'loca(ACTION_COMMAND_0_PARAMETER_10_NAME)',
        type: AgtkPluginUiParameterType.CustomId,
        customParam: [
          { id: ShowChoicesCancelParameterId.Enabled, name: 'loca(ACTION_COMMAND_0_PARAMETER_10_PARAM_0_NAME)' },
          { id: ShowChoicesCancelParameterId.Disabled, name: 'loca(ACTION_COMMAND_0_PARAMETER_10_PARAM_1_NAME)' }
        ],
        defaultValue: ShowChoicesCancelParameterId.Disabled
      }
    ]
  }
];
