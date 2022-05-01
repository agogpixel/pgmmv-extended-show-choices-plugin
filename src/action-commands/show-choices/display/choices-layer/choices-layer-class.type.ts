import type { CCLayerNamespace } from '@agogpixel/pgmmv-ts/api';

import type { InputService } from '../../../../input';

import type { ShowChoicesService } from '../../service';

import type { ChoicesLayer } from './choices-layer.interface';

/**
 * Choices layer class type.
 */
export type ChoicesLayerClass = {
  /**
   * Instantiate a choices layer instance.
   *
   */
  new (inputService: InputService, showChoicesService: ShowChoicesService): ChoicesLayer;
} & CCLayerNamespace;
