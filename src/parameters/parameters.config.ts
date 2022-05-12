/**
 * Exports plugin UI parameter configurations.
 *
 * @module parameters/parameters.config
 */
import { AgtkPluginUiParameterType } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter-type';
import type { AgtkPluginUiParameter } from '@agogpixel/pgmmv-ts/api/agtk/plugin/plugin-ui-parameter';

import {
  ShowChoicesBackgroundDisplayTypeParameterId,
  ShowChoicesCancelParameterId,
  ShowChoicesHorizontalPositionParameterId,
  ShowChoicesVerticalPositionParameterId
} from '../action-commands/show-choices';

import { ParameterId } from './parameter-id.enum';

/**
 * Plugin UI parameter configurations.
 */
export const parameters: AgtkPluginUiParameter[] = [
  {
    id: ParameterId.BackgroundDisplayType,
    name: 'loca(PARAMETER_BACKGROUND_DISPLAY_TYPE_NAME)',
    type: AgtkPluginUiParameterType.CustomId,
    defaultValue: ShowChoicesBackgroundDisplayTypeParameterId.None,
    customParam: [
      {
        id: ShowChoicesBackgroundDisplayTypeParameterId.Graphics,
        name: 'loca(PARAMETER_BACKGROUND_DISPLAY_TYPE_CUSTOM_PARAM_GRAPHICS_NAME)'
      },
      {
        id: ShowChoicesBackgroundDisplayTypeParameterId.Image,
        name: 'loca(PARAMETER_BACKGROUND_DISPLAY_TYPE_CUSTOM_PARAM_IMAGE_NAME)'
      },
      {
        id: ShowChoicesBackgroundDisplayTypeParameterId.None,
        name: 'loca(PARAMETER_BACKGROUND_DISPLAY_TYPE_CUSTOM_PARAM_NONE_NAME)'
      }
    ]
  },
  {
    id: ParameterId.BackgroundImage,
    name: 'loca(PARAMETER_BACKGROUND_IMAGE_NAME)',
    type: AgtkPluginUiParameterType.ImageId,
    defaultValue: -1
  },
  {
    id: ParameterId.BackgroundColor,
    name: 'loca(PARAMETER_BACKGROUND_COLOR_NAME)',
    type: AgtkPluginUiParameterType.String,
    defaultValue: '0,0,0,255'
  },
  {
    id: ParameterId.BackgroundBorderColor,
    name: 'loca(PARAMETER_BACKGROUND_BORDER_COLOR_NAME)',
    type: AgtkPluginUiParameterType.String,
    defaultValue: '255,255,255,255'
  },
  {
    id: ParameterId.HighlightColor,
    name: 'loca(PARAMETER_HIGHLIGHT_COLOR_NAME)',
    type: AgtkPluginUiParameterType.String,
    defaultValue: '255,255,255,255'
  },
  {
    id: ParameterId.Font,
    name: 'loca(PARAMETER_FONT_NAME)',
    type: AgtkPluginUiParameterType.FontId,
    defaultValue: -1
  },
  {
    id: ParameterId.HorizontalPosition,
    name: 'loca(PARAMETER_HORIZONTAL_POSITION_NAME)',
    type: AgtkPluginUiParameterType.CustomId,
    defaultValue: ShowChoicesHorizontalPositionParameterId.Center,
    customParam: [
      {
        id: ShowChoicesHorizontalPositionParameterId.Left,
        name: 'loca(PARAMETER_HORIZONTAL_POSITION_CUSTOM_PARAM_LEFT_NAME)'
      },
      {
        id: ShowChoicesHorizontalPositionParameterId.Center,
        name: 'loca(PARAMETER_HORIZONTAL_POSITION_CUSTOM_PARAM_CENTER_NAME)'
      },
      {
        id: ShowChoicesHorizontalPositionParameterId.Right,
        name: 'loca(PARAMETER_HORIZONTAL_POSITION_CUSTOM_PARAM_RIGHT_NAME)'
      }
    ]
  },
  {
    id: ParameterId.VerticalPosition,
    name: 'loca(PARAMETER_VERTICAL_POSITION_NAME)',
    type: AgtkPluginUiParameterType.CustomId,
    defaultValue: ShowChoicesVerticalPositionParameterId.Center,
    customParam: [
      {
        id: ShowChoicesVerticalPositionParameterId.Top,
        name: 'loca(PARAMETER_VERTICAL_POSITION_CUSTOM_PARAM_TOP_NAME)'
      },
      {
        id: ShowChoicesVerticalPositionParameterId.Center,
        name: 'loca(PARAMETER_VERTICAL_POSITION_CUSTOM_PARAM_CENTER_NAME)'
      },
      {
        id: ShowChoicesVerticalPositionParameterId.Bottom,
        name: 'loca(PARAMETER_VERTICAL_POSITION_CUSTOM_PARAM_BOTTOM_NAME)'
      }
    ]
  },
  {
    id: ParameterId.Cancel,
    name: 'loca(PARAMETER_CANCEL_NAME)',
    type: AgtkPluginUiParameterType.CustomId,
    defaultValue: ShowChoicesCancelParameterId.Disabled,
    customParam: [
      { id: ShowChoicesCancelParameterId.Enabled, name: 'loca(PARAMETER_CANCEL_CUSTOM_PARAM_ENABLED_NAME)' },
      { id: ShowChoicesCancelParameterId.Disabled, name: 'loca(PARAMETER_CANCEL_CUSTOM_PARAM_DISABLED_NAME)' }
    ]
  }
];
