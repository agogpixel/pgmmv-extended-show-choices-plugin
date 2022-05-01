import { CCNode, CCSize } from '@agogpixel/pgmmv-ts/api';

import type { InputService } from '../../../../utils';

import type { ShowChoicesService } from '../../service';

import type { ChoicesLayerClass } from './choices-layer-class.type';
import { ChoicesLayerMode } from './choices-layer-mode.enum';
import type { ChoicesLayer } from './choices-layer.interface';

export function createChoicesLayerClass() {
  return cc.Layer.extend<ChoicesLayerClass>({
    ctor: function (this: ChoicesLayer, inputService: InputService, showChoicesService: ShowChoicesService) {
      this.inputService = inputService;
      this.showChoicesService = showChoicesService;

      createLayers.call(this);

      this.choiceHeightList = [];

      const textDimensions = new cc.Size(0, 0);
      renderChoicesText.call(this, textDimensions);

      this.windowDimensions = new cc.Size(textDimensions.width + 16, textDimensions.height + 16);

      if (showChoicesService.getBackgroundDisplayType() !== 'none') {
        createWindow.call(this, 0, 0, this.windowDimensions.width, this.windowDimensions.height);
        setChildrenOpacity(this.layers.background, 0);
      }

      this.currentIndex = 0;
      this.mode = ChoicesLayerMode.Opening;
      this.modeCounter = 0;

      setPosition.call(this);

      return true;
    },

    update: function (this: ChoicesLayer) {
      const inputService = this.inputService;
      const showChoicesService = this.showChoicesService;

      /*if (!this.service.isShowing()) {
        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
      }*/

      if (this.mode === ChoicesLayerMode.Opening) {
        this.layers.background.removeAllChildren();

        let winHeight = (this.modeCounter + 1) * 16;

        if (winHeight >= this.windowDimensions.height) {
          winHeight = this.windowDimensions.height;
        }

        const winY = (this.windowDimensions.height - winHeight) / 2;

        createWindow.call(this, 0, winY, this.windowDimensions.width, winHeight);

        if (winHeight >= this.windowDimensions.height) {
          this.mode = ChoicesLayerMode.WaitingForKey;
          this.modeCounter = 0;
          this.layers.text.visible = true;

          updateHighlightGraphics.call(this);
        } else {
          this.modeCounter++;
        }

        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
      }

      if (this.mode === ChoicesLayerMode.WaitingForKey) {
        if (inputService.isKeyUpJustPressed()) {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            updateHighlightGraphics.call(this);
          }
        } else if (inputService.isKeyDownJustPressed()) {
          if (this.currentIndex < showChoicesService.getMaxChoices() - 1) {
            this.currentIndex++;
            updateHighlightGraphics.call(this);
          }
        } else if (inputService.isKeyOkJustPressed()) {
          this.mode = ChoicesLayerMode.Closing;
          this.modeCounter = 0;
          this.layers.text.visible = false;
          this.layers.highlight.visible = false;
        } else if (inputService.isMouseLeftClickJustPressed()) {
          const index = getClickedIndex.call(this);

          if (index >= 0) {
            if (index === this.currentIndex) {
              this.mode = ChoicesLayerMode.Closing;
              this.modeCounter = 0;
              this.layers.text.visible = false;
              this.layers.highlight.visible = false;
            } else {
              this.currentIndex = index;
              updateHighlightGraphics.call(this);
            }
          }
        } else if (
          inputService.isCancellable() &&
          (inputService.isKeyCancelJustPressed() || inputService.isMouseRightClickJustPressed())
        ) {
          this.mode = ChoicesLayerMode.Closing;
          this.modeCounter = 0;
          this.currentIndex = showChoicesService.getCancelValue();
          this.layers.text.visible = false;
          this.layers.highlight.visible = false;
        }
      }

      if (this.mode === ChoicesLayerMode.Closing) {
        if (showChoicesService.getBackgroundDisplayType() === 'none') {
          this.mode = ChoicesLayerMode.End;
          this.modeCounter = 0;
        } else {
          this.layers.background.removeAllChildren();

          let winHeight = this.windowDimensions.height - (this.modeCounter + 1) * 16;

          if (winHeight < 16) {
            winHeight = 0;
            this.mode = ChoicesLayerMode.End;
            this.modeCounter = 0;
          } else {
            const winY = (this.windowDimensions.height - winHeight) / 2;
            createWindow.call(this, 0, winY, this.windowDimensions.width, winHeight);
            this.modeCounter++;
          }
        }

        if (this.mode != ChoicesLayerMode.End) {
          return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
        }
      }

      if (this.mode == ChoicesLayerMode.End) {
        showChoicesService.setChoice(this.currentIndex + 1);
        //this.service.destroyChoices(true);

        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
      }

      return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
    }
  });
}

////////////////////////////////////////////////////////////////////////////////
// Private Static Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * Set the opacity of all children attached to specified Cocos node.
 *
 * @param node Cocos node with children we will iterate.
 * @param alpha Alpha value to apply to all children.
 * @private
 * @static
 */
function setChildrenOpacity(node: CCNode, alpha: number) {
  const children = node.children;

  for (let i = 0; i < children.length; i++) {
    children[i].opacity = alpha;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Private Methods
////////////////////////////////////////////////////////////////////////////////

/**
 * @private
 */
function createLayers(this: ChoicesLayer) {
  const background = new cc.Layer();

  const highlight = new cc.Layer();
  highlight.x = 8;
  highlight.y = 8;

  const text = new cc.Layer();
  text.x = 8;
  text.y = 8;

  this.layers = {
    background,
    highlight,
    text
  };

  this.addChild(background);
  this.addChild(highlight);
  this.addChild(text);
}

/**
 * @param winX
 * @param winY
 * @param winWidth
 * @param winHeight
 * @private
 */
function createWindow(this: ChoicesLayer, winX: number, winY: number, winWidth: number, winHeight: number) {
  const showChoicesService = this.showChoicesService;

  switch (showChoicesService.getBackgroundDisplayType()) {
    case 'graphics':
      const bgGraphics = new cc.DrawNode();
      bgGraphics.drawRect(
        cc.p(winX, winY + winHeight - 8),
        cc.p(winX + winWidth - 8, winY),
        showChoicesService.getBackgroundColor() || null,
        8,
        showChoicesService.getBackgroundBorderColor()
      );
      this.layers.background.addChild(bgGraphics);
      break;
    case 'image':
      // TODO: 9-slice support...
      const bgImage = new cc.Sprite(showChoicesService.getBackgroundImageTexture());
      bgImage.setAnchorPoint(0, 0);
      bgImage.x = winX;
      bgImage.y = winY + winHeight - 8;
      this.layers.background.addChild(bgImage);
      break;
    case 'none':
      break;
  }
}

/**
 * Resolves current mouse position to a choice index (0-based indexing) when
 * a click is detected.
 *
 * @returns Choice index clicked (0-based indexing) or -1 if no choice is
 * resolved.
 */
function getClickedIndex(this: ChoicesLayer) {
  const screenSize = cc.director.getWinSize();
  const x = Agtk.variables.get(Agtk.variables.MouseXId).getValue();
  const y = screenSize.height - 1 - Agtk.variables.get(Agtk.variables.MouseYId).getValue();

  if (x < this.x + 4 || x >= this.x + this.windowDimensions.width - 4) {
    return -1;
  }

  let iy = this.y + 8;

  for (let i = this.choiceHeightList.length - 1; i >= 0; i--) {
    if (y >= iy - 4 && y < iy + this.choiceHeightList[i] + 4) {
      return i;
    }

    iy += 8 + this.choiceHeightList[i];
  }

  return -1;
}

/**
 * @param textDimensions
 * @private
 */
function renderChoicesText(this: ChoicesLayer, textDimensions: CCSize) {
  const showChoicesService = this.showChoicesService;

  const maxChoices = showChoicesService.getMaxChoices();
  for (let i = 0; i < maxChoices; ++i) {
    const choiceLines = showChoicesService.createTextSprites(i + 1);
    let choiceHeight = 0;

    for (let j = 0; j < choiceLines.length; ++j) {
      const letterLayer = new cc.Layer();
      letterLayer.setAnchorPoint(0, 0);
      this.layers.text.addChild(letterLayer, 1);

      const choiceLine = choiceLines[j];
      let choiceLineMaxHeight = 0;

      for (let k = 0; k < choiceLine.length; ++k) {
        const letterData = choiceLine[k];
        const endX = letterData.endX;
        const sprite = letterData.sprite;

        letterLayer.addChild(sprite);

        if (sprite.height > choiceLineMaxHeight) {
          choiceLineMaxHeight = sprite.height;
        }

        if (endX > textDimensions.width) {
          textDimensions.width = endX;
        }
      }

      letterLayer.x = 0;
      letterLayer.y = -textDimensions.height;

      textDimensions.height += choiceLineMaxHeight + 8;
      choiceHeight += choiceLineMaxHeight;
    }

    this.choiceHeightList.push(choiceHeight);
  }

  textDimensions.height -= 8;
  this.layers.text.x = 8;
  this.layers.text.y = textDimensions.height + 8;
  this.layers.text.visible = false;
}

/**
 * @private
 */
function setPosition(this: ChoicesLayer) {
  const showChoicesService = this.showChoicesService;
  const screenSize = cc.director.getWinSize();

  switch (showChoicesService.getHorizontalPosition()) {
    case 'left':
      this.x = 0;
      break;
    case 'center':
      this.x = (screenSize.width - this.windowDimensions.width) / 2;
      break;
    case 'right':
      this.x = screenSize.width = this.windowDimensions.width;
      break;
    default:
      break;
  }

  switch (showChoicesService.getVerticalPosition()) {
    case 'top':
      this.y = screenSize.height;
      break;
    case 'center':
      this.y = (screenSize.height - this.windowDimensions.height) / 2;
      break;
    case 'bottom':
      this.y = this.windowDimensions.height;
      break;
    default:
      break;
  }
}

function updateHighlightGraphics(this: ChoicesLayer) {
  if (this.highlightGraphics) {
    this.highlightGraphics.removeFromParent();
  }

  let y = 0;

  for (let i = this.choiceHeightList.length - 1; i > this.currentIndex; i--) {
    y += 8 + this.choiceHeightList[i];
  }

  this.highlightGraphics = new cc.DrawNode();

  this.highlightGraphics.drawRect(
    cc.p(-4, y - 4),
    cc.p(this.windowDimensions.width - 16 + 4, y + this.choiceHeightList[this.currentIndex] + 4),
    cc.color(0, 255, 255, 128),
    0,
    cc.color(0, 0, 0, 0)
  );

  this.layers.highlight.addChild(this.highlightGraphics);

  this.highlightGraphics.runAction(
    cc.sequence(cc.fadeIn(0.0), cc.repeat(cc.sequence(cc.fadeTo(0.5, 255), cc.fadeTo(0.5, 128)), Math.pow(2, 30)))
  );
}
