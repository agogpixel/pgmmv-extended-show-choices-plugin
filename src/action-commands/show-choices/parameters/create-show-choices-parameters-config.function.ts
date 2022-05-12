/**
 * Exports 'Show Choices' plugin UI parameter configurations.
 *
 * @module action-commands/show-choices/parameters/create-show-choices-parameters-config.function
 */
import { AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter-type';
import type { AgtkPluginUiParameter } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter';

import { ShowChoicesBackgroundDisplayTypeParameterId } from './show-choices-background-display-type-parameter-id.enum';
import { ShowChoicesCancelParameterId } from './show-choices-cancel-parameter-id.enum';
import { ShowChoicesHorizontalPositionParameterId } from './show-choices-horizontal-position-parameter-id.enum';
import { ShowChoicesParameterId } from './show-choices-parameter-id.enum';
import { ShowChoicesVerticalPositionParameterId } from './show-choices-vertical-position-parameter-id.enum';

export function createShowChoicesParametersConfig(maxChoices: number, choiceIdBase = 100, embeddedChoiceIdBase = 1000) {
  const config: AgtkPluginUiParameter[] = [
    {
      id: ShowChoicesParameterId.BackgroundDisplayType,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_BACKGROUND_DISPLAY_TYPE_NAME)',
      type: AgtkPluginUiParameterType.CustomId,
      defaultValue: ShowChoicesBackgroundDisplayTypeParameterId.Default,
      customParam: [
        {
          id: ShowChoicesBackgroundDisplayTypeParameterId.Graphics,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_BACKGROUND_DISPLAY_TYPE_CUSTOM_PARAM_GRAPHICS_NAME)'
        },
        {
          id: ShowChoicesBackgroundDisplayTypeParameterId.Image,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_BACKGROUND_DISPLAY_TYPE_CUSTOM_PARAM_IMAGE_NAME)'
        },
        {
          id: ShowChoicesBackgroundDisplayTypeParameterId.None,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_BACKGROUND_DISPLAY_TYPE_CUSTOM_PARAM_NONE_NAME)'
        },
        {
          id: ShowChoicesBackgroundDisplayTypeParameterId.Default,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_BACKGROUND_DISPLAY_TYPE_CUSTOM_PARAM_DEFAULT_NAME)'
        }
      ]
    },
    {
      id: ShowChoicesParameterId.BackgroundImage,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_BACKGROUND_IMAGE_NAME)',
      type: AgtkPluginUiParameterType.ImageId,
      defaultValue: -1
    },
    {
      id: ShowChoicesParameterId.BackgroundColor,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_BACKGROUND_COLOR_NAME)',
      type: AgtkPluginUiParameterType.String,
      defaultValue: ''
    },
    {
      id: ShowChoicesParameterId.BackgroundBorderColor,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_BACKGROUND_BORDER_COLOR_NAME)',
      type: AgtkPluginUiParameterType.String,
      defaultValue: ''
    },
    {
      id: ShowChoicesParameterId.HighlightColor,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_HIGHLIGHT_COLOR_NAME)',
      type: AgtkPluginUiParameterType.String,
      defaultValue: ''
    },
    {
      id: ShowChoicesParameterId.Font,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_FONT_NAME)',
      type: AgtkPluginUiParameterType.FontId,
      defaultValue: -1
    },
    {
      id: ShowChoicesParameterId.HorizontalPosition,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_HORIZONTAL_POSITION_NAME)',
      type: AgtkPluginUiParameterType.CustomId,
      defaultValue: ShowChoicesHorizontalPositionParameterId.Default,
      customParam: [
        {
          id: ShowChoicesHorizontalPositionParameterId.Left,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_HORIZONTAL_POSITION_CUSTOM_PARAM_LEFT_NAME)'
        },
        {
          id: ShowChoicesHorizontalPositionParameterId.Center,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_HORIZONTAL_POSITION_CUSTOM_PARAM_CENTER_NAME)'
        },
        {
          id: ShowChoicesHorizontalPositionParameterId.Right,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_HORIZONTAL_POSITION_CUSTOM_PARAM_RIGHT_NAME)'
        },
        {
          id: ShowChoicesHorizontalPositionParameterId.Default,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_HORIZONTAL_POSITION_CUSTOM_PARAM_DEFAULT_NAME)'
        }
      ]
    },
    {
      id: ShowChoicesParameterId.VerticalPosition,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_VERTICAL_POSITION_NAME)',
      type: AgtkPluginUiParameterType.CustomId,
      defaultValue: ShowChoicesVerticalPositionParameterId.Default,
      customParam: [
        {
          id: ShowChoicesVerticalPositionParameterId.Top,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_VERTICAL_POSITION_CUSTOM_PARAM_TOP_NAME)'
        },
        {
          id: ShowChoicesVerticalPositionParameterId.Center,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_VERTICAL_POSITION_CUSTOM_PARAM_CENTER_NAME)'
        },
        {
          id: ShowChoicesVerticalPositionParameterId.Bottom,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_VERTICAL_POSITION_CUSTOM_PARAM_BOTTOM_NAME)'
        },
        {
          id: ShowChoicesVerticalPositionParameterId.Default,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_VERTICAL_POSITION_CUSTOM_PARAM_DEFAULT_NAME)'
        }
      ]
    },
    {
      id: ShowChoicesParameterId.Cancel,
      name: 'loca(PARAMETER_CANCEL_NAME)',
      type: AgtkPluginUiParameterType.CustomId,
      defaultValue: ShowChoicesCancelParameterId.Default,
      customParam: [
        {
          id: ShowChoicesCancelParameterId.Enabled,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_CANCEL_CUSTOM_PARAM_ENABLED_NAME)'
        },
        {
          id: ShowChoicesCancelParameterId.Disabled,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_CANCEL_CUSTOM_PARAM_DISABLED_NAME)'
        },
        {
          id: ShowChoicesCancelParameterId.Default,
          name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_CANCEL_CUSTOM_PARAM_DEFAULT_NAME)'
        }
      ]
    },
    {
      id: ShowChoicesParameterId.Variable,
      name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_VARIABLE_NAME)',
      type: AgtkPluginUiParameterType.VariableId,
      defaultValue: -1
    }
  ];

  for (let i = 1; i <= maxChoices; ++i) {
    const choiceId = choiceIdBase + i;
    const embeddedChoiceId = embeddedChoiceIdBase + i;

    config.push(
      {
        id: choiceId,
        name: 'loca(ACTION_COMMAND_SHOW_CHOICES_PARAMETER_CHOICE_NAME)',
        type: AgtkPluginUiParameterType.TextId,
        defaultValue: -1,
        withNewButton: true
      },
      {
        id: embeddedChoiceId,
        name: '',
        type: AgtkPluginUiParameterType.EmbeddedEditable,
        sourceId: choiceId,
        reference: 'text',
        width: 256,
        height: 48
      }
    );
  }

  return config;
}
