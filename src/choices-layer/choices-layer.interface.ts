import type { CCDrawNode, CCLayer, CCLayerNamespace, CCNode, CCTexture2D } from '@agogpixel/pgmmv-ts/api';

import type { ChoicesLayerDataService } from './choices-layer-data-service.interface';
import type { ChoicesLayerMode } from './choices-layer-mode.enum';

export type ChoicesLayerClass = {
  new (service: ChoicesLayerDataService, objectId: number, instanceId: number): ChoicesLayer;
} & CCLayerNamespace;

export interface ChoicesLayer extends CCLayer {
  service: ChoicesLayerDataService;

  objectId: number;
  instanceId: number;
  //bgType: ChoicesLayerBackground;
  currentIndex: number;
  pressedKey: number;
  mousePressedKey: number;
  //cancellable: boolean;
  //variableId: number;
  mode: ChoicesLayerMode;
  modeCounter: number;
  bgImageTex: CCTexture2D;

  frameLayer: CCLayer;
  highlightLayer: CCLayer;
  textLayer: CCLayer;

  choiceCount: number;
  choiceHeightList: number[];

  winWidth: number;
  winHeight: number;

  highlight: CCDrawNode | null;

  windowFilename: string;

  update(): number;

  getClickedIndex(): number;

  onExit(): void;

  createWindow(winX: number, winY: number, winWidth: number, winHeight: number, windowFilename?: string): void;

  updateHighlight(): void;

  isKeyOkJustPressed(): boolean;

  isKeyCancelJustPressed(): boolean;

  isKeyUpJustPressed(): boolean;

  isKeyDownJustPressed(): boolean;

  isMouseLeftClickJustPressed(): boolean;

  isMouseRightClickJustPressed(): boolean;

  isKeyPressed(keyId: number): boolean;

  isKeyJustPressed(keyId: number): boolean;

  isMousePressed(keyCode: number): boolean;

  isMouseJustPressed(keyCode: number): boolean;

  setChildrenOpacity(node: CCNode, alpha: number): void;
}
