import { AgtkPluginUiParameterType, AgtkPluginUiParameter } from '@agogpixel/pgmmv-ts/api';

import { ParameterId } from './parameter-id.enum';

export const parameters: AgtkPluginUiParameter[] = [
  { id: ParameterId.Image, name: 'loca(PARAMETER_0_NAME)', type: AgtkPluginUiParameterType.ImageId, defaultValue: -1 }
];
