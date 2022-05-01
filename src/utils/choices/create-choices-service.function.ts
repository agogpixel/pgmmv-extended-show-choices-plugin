import type { ChoicesServiceConfig } from './choices-service-config.interface';
import type { ChoicesServiceProtectedApi } from './choices-service-protected-api.interface';
import type { ChoicesService } from './choices-service.interface';
import { cancelChoiceMade, noChoiceMade } from './choices.const';

export function createChoicesService(config: ChoicesServiceConfig, internal?: ChoicesServiceProtectedApi) {
  const self = {} as ChoicesService;
  const internalApi = internal || ({} as ChoicesServiceProtectedApi);

  internalApi.cancelValue = config.cancelValue === undefined ? cancelChoiceMade : config.cancelValue;
  internalApi.defaultChoice = config.defaultChoice;
  internalApi.maxChoices = config.maxChoices;
  internalApi.noChoiceMadeValue = config.noChoiceMadeValue === undefined ? noChoiceMade : config.noChoiceMadeValue;

  self.getCancelValue = function () {
    return internalApi.cancelValue;
  };

  self.getDefaultChoice = function () {
    return internalApi.defaultChoice;
  };

  self.getMaxChoices = function () {
    return internalApi.maxChoices;
  };

  self.getNoChoiceMadeValue = function () {
    return internalApi.noChoiceMadeValue;
  };

  return self;
}
