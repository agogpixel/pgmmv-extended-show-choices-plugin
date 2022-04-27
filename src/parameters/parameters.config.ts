/**
 * Exports plugin UI parameter configurations.
 *
 * @module parameters/parameters.config
 */
import { AgtkPluginUiParameterType, AgtkPluginUiParameter } from '@agogpixel/pgmmv-ts/api';

import { ParameterId } from './parameter-id.enum';

/**
 * Plugin UI parameter configurations.
 */
export const parameters: AgtkPluginUiParameter[] = [
  /**
   * Background image parameter.
   */
  { id: ParameterId.Image, name: 'loca(PARAMETER_0_NAME)', type: AgtkPluginUiParameterType.ImageId, defaultValue: -1 }
];
