/**
 * Exports {@link ChoicesLayerClass} factory functions.
 *
 * @module choices-layer/create-choices-layer-class.function
 */
import { CCNode } from '@agogpixel/pgmmv-ts/api';

import { ShowChoicesParameterId } from '../action-commands/show-choices';

import { ChoicesLayerBackground } from './choices-layer-background.enum';
import type { ChoicesLayerDataService } from './choices-layer-data-service.interface';
import { ChoicesLayerMode } from './choices-layer-mode.enum';
import { ChoicesLayerPosition } from './choices-layer-position.enum';
import type { ChoicesLayer, ChoicesLayerClass } from './choices-layer.interface';
import { createFontDraw } from './font-draw';

/**
 * Creates the ChoicesLayer class constructor, which is extended from `cc.Layer`.
 *
 * @returns ChoicesLayer class constructor.
 */
export function createChoicesLayerClass() {
  /**
   * Implementation of our {@link ChoicesLayer} using Cocos class extension
   * feature.
   */
  return cc.Layer.extend<ChoicesLayerClass>({
    /**
     * Special method, used by Cocos, that contains our class constructor logic.
     *
     * @param service Choices layer data service.
     * @param objectId The object ID of the object instance through which the
     * ChoicesLayer is executing.
     * @param instanceId The instance ID of the object instance through which the
     * ChoicesLayer is executing.
     * @returns True if instantiate was successful, false otherwise.
     */
    ctor: function (this: ChoicesLayer, service: ChoicesLayerDataService, objectId: number, instanceId: number) {
      this._super();

      this.service = service;
      this.objectId = objectId;
      this.instanceId = instanceId;

      this.currentIndex = 0;
      this.mode = ChoicesLayerMode.End;

      this.pressedKey = ~0;
      this.mousePressedKey = ~0;

      const bgImageId = service.getBgImageId();

      if (bgImageId === null) {
        return false;
      }

      const bgImageData = Agtk.images.get(bgImageId);

      if (bgImageData == null) {
        return false;
      }

      this.bgImageTex = cc.textureCache.addImage(bgImageData.filename);
      this.bgImageTex.setAliasTexParameters();

      const fontId = service.getFontId();

      if (fontId === null) {
        return false;
      }

      const fontData = Agtk.fonts.get(fontId);

      this.frameLayer = new cc.Layer();
      this.addChild(this.frameLayer);

      this.highlightLayer = new cc.Layer();
      this.highlightLayer.x = 8;
      this.highlightLayer.y = 8;
      this.addChild(this.highlightLayer);

      this.textLayer = new cc.Layer();
      this.textLayer.x = 8;
      this.textLayer.y = 8;
      this.addChild(this.textLayer);

      this.choiceCount = 0;
      this.choiceHeightList = [];
      let textWidth = 0;
      let textHeight = 0;

      // Render choices.
      for (let i = 0; i < ShowChoicesParameterId.Choice6; i++) {
        const textId = service.getTextId(1 + i);
        const textData = Agtk.texts.get(textId);

        if (textData == null) {
          break;
        }

        let fdata = fontData;

        if (fdata === null) {
          if (textData.fontId >= 0) {
            fdata = Agtk.fonts.get(textData.fontId);
          }
        }

        if (fdata === null) {
          break;
        }

        const text = textData.getText(service.getLocale());

        if (text == null || text.length == 0) {
          break;
        }

        const fontDraw = createFontDraw(this.textLayer, 1, fdata, textData.letterSpacing);

        if (!fontDraw) {
          break;
        }

        const result = fontDraw.drawLetters(text, textWidth, textHeight);
        textWidth = result[0];
        textHeight = result[1];

        this.choiceCount++;
        this.choiceHeightList.push(fontDraw.getCurrentLineMaxHeight());
      }

      if (this.choiceCount == 0) {
        return false;
      }

      textHeight -= 8;
      this.textLayer.x = 8;
      this.textLayer.y = textHeight + 8;
      this.textLayer.visible = false;

      this.winWidth = textWidth + 16;
      this.winHeight = textHeight + 16;

      if (this.service.getBgType() === ChoicesLayerBackground.Black) {
        this.createWindow(0, 0, this.winWidth, this.winHeight);
        this.setChildrenOpacity(this.frameLayer, 0);
      }

      this.mode = ChoicesLayerMode.Opening;
      this.modeCounter = 0;

      this.highlight = null;
      //this.updateHighlight();

      const position = service.getPosition();
      const screenWidth = service.getScreenWidth();
      const screenHeight = service.getScreenHeight();

      if (position == ChoicesLayerPosition.Left) {
        this.x = 0;
      } else if (position == ChoicesLayerPosition.Center) {
        this.x = (screenWidth - this.winWidth) / 2;
      } else if (position == ChoicesLayerPosition.Right) {
        this.x = screenWidth - this.winWidth;
      }

      this.y = (screenHeight - this.winHeight) / 2;

      return true;
    },

    /**
     * Update the display & behavior of the displaying choice layer.
     *
     * @returns Action command behavior signal. Usually, Block is returned when
     * we are waiting for a choice to be made (hence this method will be called
     * again on the next frame); Next is returned once a choice is made and the
     * choices window has fully closed.
     */
    update: function (this: ChoicesLayer) {
      if (!this.service.isShowing()) {
        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
      }

      const bgType = this.service.getBgType();

      if (this.mode == ChoicesLayerMode.Opening) {
        if (bgType === ChoicesLayerBackground.Black) {
          let alpha = (this.modeCounter * 255) / 30;

          if (alpha >= 255) {
            alpha = 255;

            this.mode = ChoicesLayerMode.WaitingForKey;
            this.modeCounter = 0;
            this.textLayer.visible = true;

            this.updateHighlight();
          } else {
            this.modeCounter++;
          }

          this.setChildrenOpacity(this.frameLayer, alpha);
        } else {
          this.frameLayer.removeAllChildren();

          let winHeight = (this.modeCounter + 1) * 16;

          if (winHeight >= this.winHeight) {
            winHeight = this.winHeight;
          }

          const winY = (this.winHeight - winHeight) / 2;

          this.createWindow(0, winY, this.winWidth, winHeight, this.windowFilename);

          if (winHeight >= this.winHeight) {
            this.mode = ChoicesLayerMode.WaitingForKey;
            this.modeCounter = 0;
            this.textLayer.visible = true;

            this.updateHighlight();
          } else {
            this.modeCounter++;
          }
        }

        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
      }

      if (this.mode === ChoicesLayerMode.WaitingForKey) {
        if (this.isKeyUpJustPressed()) {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateHighlight();
          }
        } else if (this.isKeyDownJustPressed()) {
          if (this.currentIndex < this.choiceCount - 1) {
            this.currentIndex++;
            this.updateHighlight();
          }
        } else if (this.isKeyOkJustPressed()) {
          this.mode = ChoicesLayerMode.Closing;
          this.modeCounter = 0;
          this.textLayer.visible = false;
          this.highlightLayer.visible = false;
        } else if (this.isMouseLeftClickJustPressed()) {
          const index = this.getClickedIndex();

          if (index >= 0) {
            if (index === this.currentIndex) {
              this.mode = ChoicesLayerMode.Closing;
              this.modeCounter = 0;
              this.textLayer.visible = false;
              this.highlightLayer.visible = false;
            } else {
              this.currentIndex = index;
              this.updateHighlight();
            }
          }
        } else if (
          this.service.isCancellable() &&
          (this.isKeyCancelJustPressed() || this.isMouseRightClickJustPressed())
        ) {
          this.mode = ChoicesLayerMode.Closing;
          this.modeCounter = 0;
          this.currentIndex = -1;
          this.textLayer.visible = false;
          this.highlightLayer.visible = false;
        }
      }

      if (this.mode === ChoicesLayerMode.Closing) {
        if (bgType === ChoicesLayerBackground.None) {
          this.mode = ChoicesLayerMode.End;
          this.modeCounter = 0;
        } else if (bgType === ChoicesLayerBackground.Black) {
          let alpha = 255 - (this.modeCounter * 255) / 30;

          if (alpha <= 0) {
            alpha = 0;

            this.mode = ChoicesLayerMode.End;
            this.modeCounter = 0;
          } else {
            this.modeCounter++;
          }

          this.setChildrenOpacity(this.frameLayer, alpha);
        } else {
          this.frameLayer.removeAllChildren();

          let winHeight = this.winHeight - (this.modeCounter + 1) * 16;

          if (winHeight < 16) {
            winHeight = 0;
            this.mode = ChoicesLayerMode.End;
            this.modeCounter = 0;
          } else {
            const winY = (this.winHeight - winHeight) / 2;
            this.createWindow(0, winY, this.winWidth, winHeight, this.windowFilename);
            this.modeCounter++;
          }
        }
        if (this.mode != ChoicesLayerMode.End) {
          return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
        }
      }

      if (this.mode == ChoicesLayerMode.End) {
        this.service.setSelectedInfo(this.objectId, this.instanceId, this.currentIndex, this.service.getVariableId());
        this.service.destroyChoices(true);

        return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorNext;
      }

      return Agtk.constants.actionCommands.commandBehavior.CommandBehaviorBlock;
    },

    /**
     * Resolves current mouse position to a choice index (0-based indexing) when
     * a click is detected.
     *
     * @returns Choice index clicked (0-based indexing) or -1 if no choice is
     * resolved.
     */
    getClickedIndex: function (this: ChoicesLayer) {
      const x = Agtk.variables.get(Agtk.variables.MouseXId).getValue();
      const y = this.service.getScreenHeight() - 1 - Agtk.variables.get(Agtk.variables.MouseYId).getValue();

      if (x < this.x + 4 || x >= this.x + this.winWidth - 4) {
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
    },

    /**
     * Clean up this ChoicesLayer instance when the choices menu is exited.
     */
    onExit: function (this: ChoicesLayer) {
      this._super();
      this.service.destroyChoices(false);
    },

    /**
     * Create & display the choices window.
     *
     * @param winX Horizontal position of top left corner of window.
     * @param winY Vertical position of top left corner of window.
     * @param winWidth Window width.
     * @param winHeight Window height.
     */
    createWindow: function (this: ChoicesLayer, winX: number, winY: number, winWidth: number, winHeight: number) {
      const bgType = this.service.getBgType();
      let oy = 0;

      if (bgType == ChoicesLayerBackground.WhiteFrame) {
        oy = 0;
      } else if (bgType == ChoicesLayerBackground.Black) {
        oy = 24;
      } else if (bgType == ChoicesLayerBackground.None) {
        return;
      }

      let sprite = new cc.Sprite(this.bgImageTex, cc.rect(0, oy, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX;
      sprite.y = winY + winHeight - 8;

      this.frameLayer.addChild(sprite);

      sprite = new cc.Sprite(this.bgImageTex, cc.rect(8, oy, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX + 8;
      sprite.y = winY + winHeight - 8;
      sprite.width = winWidth - 16;

      this.frameLayer.addChild(sprite);

      sprite = new cc.Sprite(this.bgImageTex, cc.rect(16, oy, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX + winWidth - 8;
      sprite.y = winY + winHeight - 8;

      this.frameLayer.addChild(sprite);

      sprite = new cc.Sprite(this.bgImageTex, cc.rect(0, oy + 8, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX;
      sprite.y = winY + 8;
      sprite.height = winHeight - 16;

      this.frameLayer.addChild(sprite);

      sprite = new cc.Sprite(this.bgImageTex, cc.rect(8, oy + 8, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX + 8;
      sprite.y = winY + 8;
      sprite.width = winWidth - 16;
      sprite.height = winHeight - 16;

      this.frameLayer.addChild(sprite);

      sprite = new cc.Sprite(this.bgImageTex, cc.rect(16, oy + 8, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX + winWidth - 8;
      sprite.y = winY + 8;
      sprite.height = winHeight - 16;

      this.frameLayer.addChild(sprite);

      sprite = new cc.Sprite(this.bgImageTex, cc.rect(0, oy + 16, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX;
      sprite.y = winY;

      this.frameLayer.addChild(sprite);

      sprite = new cc.Sprite(this.bgImageTex, cc.rect(8, oy + 16, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX + 8;
      sprite.y = winY;
      sprite.width = winWidth - 16;

      this.frameLayer.addChild(sprite);

      sprite = new cc.Sprite(this.bgImageTex, cc.rect(16, oy + 16, 8, 8));
      sprite.setAnchorPoint(0, 0);
      sprite.x = winX + winWidth - 8;
      sprite.y = winY;

      this.frameLayer.addChild(sprite);
    },

    /**
     * Update the display & behavior of the highlight layer within the
     * displaying choice layer.
     */
    updateHighlight: function (this: ChoicesLayer) {
      if (this.highlight !== null) {
        this.highlight.removeFromParent();
      }

      let y = 0;

      for (let i = this.choiceHeightList.length - 1; i > this.currentIndex; i--) {
        y += 8 + this.choiceHeightList[i];
      }

      this.highlight = new cc.DrawNode();

      this.highlight.drawRect(
        cc.p(-4, y - 4),
        cc.p(this.winWidth - 16 + 4, y + this.choiceHeightList[this.currentIndex] + 4),
        cc.color(0, 255, 255, 128),
        0,
        cc.color(0, 0, 0, 0)
      );

      this.highlightLayer.addChild(this.highlight);

      this.highlight.runAction(
        cc.sequence(cc.fadeIn(0.0), cc.repeat(cc.sequence(cc.fadeTo(0.5, 255), cc.fadeTo(0.5, 128)), Math.pow(2, 30)))
      );
    },

    /**
     * Was the OK operation key just pressed?
     *
     * @returns True if OK operation key was pressed, false otherwise.
     */
    isKeyOkJustPressed: function (this: ChoicesLayer) {
      return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyOk);
    },

    /**
     * Was the CANCEL operation key just pressed?
     *
     * @returns True if CANCEL operation key was pressed, false otherwise.
     */
    isKeyCancelJustPressed: function (this: ChoicesLayer) {
      return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyCancel);
    },

    /**
     * Was the UP operation key just pressed?
     *
     * @returns True if UP operation key was pressed, false otherwise.
     */
    isKeyUpJustPressed: function (this: ChoicesLayer) {
      return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyUp);
    },

    /**
     * Was the DOWN operation key just pressed?
     *
     * @returns True if DOWN operation key was pressed, false otherwise.
     */
    isKeyDownJustPressed: function (this: ChoicesLayer) {
      return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyDown);
    },

    /**
     * Was the left mouse button just pressed?
     *
     * @returns True if left mouse button was pressed, false otherwise.
     */
    isMouseLeftClickJustPressed: function (this: ChoicesLayer) {
      return this.isMouseJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_LeftClick);
    },

    /**
     * Was the right mouse button just pressed?
     *
     * @returns True if right mouse button was pressed, false otherwise.
     */
    isMouseRightClickJustPressed: function (this: ChoicesLayer) {
      return this.isMouseJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_RightClick);
    },

    /**
     * Is specified operation key pressed?
     *
     * @param keyId Operation key ID.
     * @returns True if operation key is pressed, false otherwise.
     */
    isKeyPressed: function (this: ChoicesLayer, keyId: number) {
      for (let i = 0; i <= Agtk.controllers.MaxControllerId; i++) {
        if (Agtk.controllers.getOperationKeyPressed(i, keyId)) {
          return true;
        }
      }

      return false;
    },

    /**
     * Was the specified operation key just pressed?
     *
     * @param keyId Operation key ID.
     * @returns True if operation key was pressed, false otherwise.
     */
    isKeyJustPressed: function (this: ChoicesLayer, keyId: number) {
      const pressed = this.isKeyPressed(keyId);

      if (!(this.pressedKey & (1 << keyId)) && pressed) {
        this.pressedKey = (this.pressedKey & ~(1 << keyId)) | (pressed ? 1 << keyId : 0);
        return true;
      }

      this.pressedKey = (this.pressedKey & ~(1 << keyId)) | (pressed ? 1 << keyId : 0);

      return false;
    },

    /**
     * Is specified mouse button pressed?
     *
     * @param keyCode Mouse key code.
     * @returns True if mouse button is pressed, false otherwise.
     */
    isMousePressed: function (this: ChoicesLayer, keyCode: number) {
      if (Agtk.controllers.getKeyValue(0, keyCode) != 0) {
        return true;
      }

      return false;
    },

    /**
     * Was the specified mouse button just pressed?
     *
     * @param keyCode Mouse key code.
     * @returns True if mouse button was pressed, false otherwise.
     */
    isMouseJustPressed: function (this: ChoicesLayer, keyCode: number) {
      const pressed = this.isMousePressed(keyCode);

      if (!(this.mousePressedKey & (1 << keyCode)) && pressed) {
        this.mousePressedKey = (this.mousePressedKey & ~(1 << keyCode)) | (pressed ? 1 << keyCode : 0);
        return true;
      }

      this.mousePressedKey = (this.mousePressedKey & ~(1 << keyCode)) | (pressed ? 1 << keyCode : 0);

      return false;
    },

    /**
     * Set the opacity of all children attached to specified Cocos node.
     *
     * @param node Cocos node with children we will iterate.
     * @param alpha Alpha value to apply to all children.
     */
    setChildrenOpacity: function (this: ChoicesLayer, node: CCNode, alpha: number) {
      const children = node.children;

      for (let i = 0; i < children.length; i++) {
        children[i].opacity = alpha;
      }
    }
  });
}
