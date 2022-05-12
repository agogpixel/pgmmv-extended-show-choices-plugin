import type { ChoicesLayer } from './display';

export interface ShowChoicesContext {
  display: ChoicesLayer;
  instanceId: number;
  objectId: number;
  variableId: number;
}
