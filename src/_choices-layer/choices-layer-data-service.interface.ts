/**
 * Exports {@link ChoicesLayer} data service interface.
 *
 * @module choices-layer/choices-layer-data-service.interface
 */
import { ChoicesLayerBackground } from './choices-layer-background.enum';
import { ChoicesLayerPosition } from './choices-layer-position.enum';

/**
 * {@link ChoicesLayer} data service interface. Provides data specific for a
 * given 'Show Choices' action command to a given {@link ChoicesLayer} instance.
 */
export interface ChoicesLayerDataService {
  /**
   * Hide & destroy the current choices layer.
   *
   * @param removeFromParent (Default: true) Remove the current choices layer
   * from its scene graph parent?
   */
  destroyChoices(removeFromParent?: boolean): void;

  /**
   * Get the background image ID.
   */
  getBgImageId(): number;

  /**
   * Get the background type.
   */
  getBgType(): ChoicesLayerBackground;

  /**
   * Get the font ID.
   */
  getFontId(): number;

  /**
   * Get the current locale.
   */
  getLocale(): string;

  /**
   * Get the fixed number of 'choice slots' available.
   */
  getNumChoices(): number;

  /**
   * Get the display position for the choices.
   */
  getPosition(): ChoicesLayerPosition;

  /**
   * Get screen height.
   */
  getScreenHeight(): number;

  /**
   * Get screen width.
   */
  getScreenWidth(): number;

  /**
   * Get PGMMV text ID for specified choice.
   *
   * @param choiceIndex 1-based indexing.
   */
  getTextId(choiceIndex: number): number;

  /**
   * Get the variable ID for storing a selected choice.
   */
  getVariableId(): number;

  /**
   * Is this choices menu cancellable?
   */
  isCancellable(): boolean;

  /**
   * Is this choices menu currently displaying?
   */
  isShowing(): boolean;

  /**
   * For a given object instance's 'Show Choices' action command, sets the
   * selected choice (when made) in the specified variable.
   *
   * @param objectId The object ID of the object instance through which the
   * 'Show Choices' action command is executing.
   * @param instanceId The instance ID of the object instance through which the
   * 'Show Choices' action command is executing.
   * @param index Selected choice index (1-based indexing).
   * @param variableId The ID of the variable in which we will store the choice
   * index (1-based indexing).
   */
  setSelectedInfo(objectId: number, instanceId: number, index: number, variableId: number): void;
}
