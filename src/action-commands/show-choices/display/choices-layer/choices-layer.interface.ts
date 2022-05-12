import type { AgtkConstants } from '@agogpixel/pgmmv-ts/api/agtk/constants';
import type { CCDrawNode } from '@agogpixel/pgmmv-ts/api/cc/draw-node';
import type { CCLayer } from '@agogpixel/pgmmv-ts/api/cc/layer';
import type { CCSize } from '@agogpixel/pgmmv-ts/api/cc/size';

import type { InputService } from '../../../../utils';

import type { ShowChoicesService } from '../../service';

import type { ChoicesLayerMode } from './choices-layer-mode.enum';

type CommandBehaviorObject = AgtkConstants['actionCommands']['commandBehavior'];
type CommandBehaviorKey = keyof CommandBehaviorObject;
type CommandBehavior = CommandBehaviorObject[CommandBehaviorKey];

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
  update(): CommandBehavior;
}
