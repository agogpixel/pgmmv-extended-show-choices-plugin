import type { AgtkConstants, CCDrawNode, CCLayer, CCSize } from '@agogpixel/pgmmv-ts/api';

import type { InputService } from '../../../../input';

import type { ShowChoicesService } from '../../service';

import type { ChoicesLayerMode } from './choices-layer-mode.enum';

export interface ChoicesLayer extends CCLayer {
  currentIndex: number;
  choiceHeightList: number[];
  highlightGraphics: CCDrawNode;
  inputService: InputService;
  layers: {
    background: CCLayer;
    highlight: CCLayer;
    text: CCLayer;
  };
  mode: ChoicesLayerMode;
  modeCounter: number;
  showChoicesService: ShowChoicesService;
  windowDimensions: CCSize;

  /**
   * Update the display & behavior.
   *
   * @returns Action command behavior signal. Usually, Block is returned when
   * we are waiting for a choice to be made (hence this method will be called
   * again on the next frame); Next is returned once a choice is made and the
   * choices window has fully closed.
   */
  update(): AgtkConstants['actionCommands']['commandBehavior'];
}
