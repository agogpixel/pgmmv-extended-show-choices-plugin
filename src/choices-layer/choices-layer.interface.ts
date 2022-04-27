/**
 * Exports ChoiceLayer interfaces.
 *
 * @module choices-layer/choices-layer.interface
 */
import type { CCDrawNode, CCLayer, CCLayerNamespace, CCNode, CCTexture2D } from '@agogpixel/pgmmv-ts/api';

import type { ChoicesLayerDataService } from './choices-layer-data-service.interface';
import type { ChoicesLayerMode } from './choices-layer-mode.enum';

/**
 * ChoicesLayer class constructor type.
 */
export type ChoicesLayerClass = {
  /**
   * Instantiate a ChoicesLayer instance.
   *
   * @param service Choices layer data service.
   * @param objectId The object ID of the object instance through which the
   * ChoicesLayer is executing.
   * @param instanceId The instance ID of the object instance through which the
   * ChoicesLayer is executing.
   */
  new (service: ChoicesLayerDataService, objectId: number, instanceId: number): ChoicesLayer;
} & CCLayerNamespace;

/**
 * ChoicesLayer class instance API.
 */
export interface ChoicesLayer extends CCLayer {
  /**
   * ChoicesLayer data provider service.
   */
  service: ChoicesLayerDataService;

  /**
   * The object ID of the object instance through which the ChoicesLayer is
   * executing.
   */
  objectId: number;

  /**
   * The instance ID of the object instance through which the ChoicesLayer is
   * executing.
   */
  instanceId: number;

  /**
   * Currently selected choice index (1-based indexing).
   */
  currentIndex: number;

  /**
   * Currently pressed operation key.
   */
  pressedKey: number;

  /**
   * Currently pressed mouse operation key.
   */
  mousePressedKey: number;

  /**
   * Current mode/state for this ChoicesLayer instance.
   */
  mode: ChoicesLayerMode;

  /**
   * Used as an internal parameter for various display logic, based on current
   * mode/state for this ChoicesLayer instance.
   */
  modeCounter: number;

  /**
   * Background image texture referece.
   */
  bgImageTex: CCTexture2D;

  /**
   * Frame layer reference.
   */
  frameLayer: CCLayer;

  /**
   * Highlight layer reference.
   */
  highlightLayer: CCLayer;

  /**
   * Text layer reference.
   */
  textLayer: CCLayer;

  /**
   * Tracks the number of choices currently displaying.
   */
  choiceCount: number;

  /**
   * Tracks the maximum character height for each choice/line.
   */
  choiceHeightList: number[];

  /**
   * Calculated width of the current choices window.
   */
  winWidth: number;

  /**
   * Calculate heigh of the current choices window.
   */
  winHeight: number;

  /**
   * Highlight layer reference.
   */
  highlight: CCDrawNode | null;

  /**
   * Choice window filename (not really used atm).
   */
  windowFilename: string;

  /**
   * Update the display & behavior of the displaying choice layer.
   *
   * @returns Action command behavior signal. Usually, Block is returned when we
   * are waiting for a choice to be made (hence this method will be called again
   * on the next frame); Next is returned once a choice is made and the choices
   * window has fully closed.
   */
  update(): number;

  /**
   * Resolves current mouse position to a choice index (0-based indexing) when a
   * click is detected.
   *
   * @returns Choice index clicked (0-based indexing) or -1 if no choice is
   * resolved.
   */
  getClickedIndex(): number;

  /**
   * Clean up this ChoicesLayer instance when the choices menu is exited.
   */
  onExit(): void;

  /**
   * Create & display the choices window.
   *
   * @param winX Horizontal position of top left corner of window.
   * @param winY Vertical position of top left corner of window.
   * @param winWidth Window width.
   * @param winHeight Window height.
   * @param windowFilename Window filename.
   */
  createWindow(winX: number, winY: number, winWidth: number, winHeight: number, windowFilename?: string): void;

  /**
   * Update the display & behavior of the highlight layer within the displaying
   * choice layer.
   */
  updateHighlight(): void;

  /**
   * Was the OK operation key just pressed?
   *
   * @returns True if OK operation key was pressed, false otherwise.
   */
  isKeyOkJustPressed(): boolean;

  /**
   * Was the CANCEL operation key just pressed?
   *
   * @returns True if CANCEL operation key was pressed, false otherwise.
   */
  isKeyCancelJustPressed(): boolean;

  /**
   * Was the UP operation key just pressed?
   *
   * @returns True if UP operation key was pressed, false otherwise.
   */
  isKeyUpJustPressed(): boolean;

  /**
   * Was the DOWN operation key just pressed?
   *
   * @returns True if DOWN operation key was pressed, false otherwise.
   */
  isKeyDownJustPressed(): boolean;

  /**
   * Was the left mouse button just pressed?
   *
   * @returns True if left mouse button was pressed, false otherwise.
   */
  isMouseLeftClickJustPressed(): boolean;

  /**
   * Was the right mouse button just pressed?
   *
   * @returns True if right mouse button was pressed, false otherwise.
   */
  isMouseRightClickJustPressed(): boolean;

  /**
   * Is specified operation key pressed?
   *
   * @param keyId Operation key ID.
   * @returns True if operation key is pressed, false otherwise.
   */
  isKeyPressed(keyId: number): boolean;

  /**
   * Was the specified operation key just pressed?
   *
   * @param keyId Operation key ID.
   * @returns True if operation key was pressed, false otherwise.
   */
  isKeyJustPressed(keyId: number): boolean;

  /**
   * Is specified mouse button pressed?
   *
   * @param keyCode Mouse key code.
   * @returns True if mouse button is pressed, false otherwise.
   */
  isMousePressed(keyCode: number): boolean;

  /**
   * Was the specified mouse button just pressed?
   *
   * @param keyCode Mouse key code.
   * @returns True if mouse button was pressed, false otherwise.
   */
  isMouseJustPressed(keyCode: number): boolean;

  /**
   * Set the opacity of all children attached to specified Cocos node.
   *
   * @param node Cocos node with children we will iterate.
   * @param alpha Alpha value to apply to all children.
   */
  setChildrenOpacity(node: CCNode, alpha: number): void;
}
