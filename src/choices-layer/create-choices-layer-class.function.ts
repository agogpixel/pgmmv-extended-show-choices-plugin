import { CCNode } from '@agogpixel/pgmmv-ts/api';

import { ShowChoicesParameterId } from '../action-commands';

import { ChoicesLayerBackground } from './choices-layer-background.enum';
import type { ChoicesLayerDataService } from './choices-layer-data-service.interface';
import { ChoicesLayerMode } from './choices-layer-mode.enum';
import { ChoicesLayerPosition } from './choices-layer-position.enum';
import type { ChoicesLayer, ChoicesLayerClass } from './choices-layer.interface';
import { createFontDraw } from './font-draw';

export function createChoicesLayerClass() {
  return cc.Layer.extend<ChoicesLayerClass>({
    ctor: function (this: ChoicesLayer, service: ChoicesLayerDataService, objectId: number, instanceId: number) {
      this._super();

      this.service = service;
      this.objectId = objectId;
      this.instanceId = instanceId;

      //this.bgType = obj.getValue(valueJson, 8);
      this.currentIndex = 0;
      this.pressedKey = ~0;
      this.mousePressedKey = ~0;
      //this.cancellable = obj.getValue(valueJson, 11) === 1;
      //this.variableId = obj.getValue(valueJson, 10);
      this.mode = ChoicesLayerMode.End;

      const bgImageId = service.getBgImageId();

      if (bgImageId === null) {
        return false;
      }

      const bgImageData = Agtk.images.get(bgImageId);

      if (bgImageData == null) {
        return false;
      }

      //this.bgImageTex = cc.TextureCache.getInstance().addImage(bgImageData.filename);
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

    onExit: function (this: ChoicesLayer) {
      this._super();
      this.service.destroyChoices(false);
    },

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

    updateHighlight: function (this: ChoicesLayer) {
      if (this.highlight !== null) {
        this.highlight.removeFromParent();
      }

      let y = 0;

      for (let i = this.choiceHeightList.length - 1; i > this.currentIndex; i--) {
        y += 8 + this.choiceHeightList[i];
      }

      this.highlight = cc.DrawNode.create();

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

    isKeyOkJustPressed: function (this: ChoicesLayer) {
      return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyOk);
    },

    isKeyCancelJustPressed: function (this: ChoicesLayer) {
      return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyCancel);
    },

    isKeyUpJustPressed: function (this: ChoicesLayer) {
      return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyUp);
    },

    isKeyDownJustPressed: function (this: ChoicesLayer) {
      return this.isKeyJustPressed(Agtk.constants.controllers.OperationKeyDown);
    },

    isMouseLeftClickJustPressed: function (this: ChoicesLayer) {
      return this.isMouseJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_LeftClick);
    },

    isMouseRightClickJustPressed: function (this: ChoicesLayer) {
      return this.isMouseJustPressed(Agtk.constants.controllers.ReservedKeyCodePc_RightClick);
    },

    isKeyPressed: function (this: ChoicesLayer, keyId: number) {
      for (let i = 0; i <= Agtk.controllers.MaxControllerId; i++) {
        if (Agtk.controllers.getOperationKeyPressed(i, keyId)) {
          return true;
        }
      }

      return false;
    },

    isKeyJustPressed: function (this: ChoicesLayer, keyId: number) {
      const pressed = this.isKeyPressed(keyId);

      if (!(this.pressedKey & (1 << keyId)) && pressed) {
        this.pressedKey = (this.pressedKey & ~(1 << keyId)) | (pressed ? 1 << keyId : 0);
        return true;
      }

      this.pressedKey = (this.pressedKey & ~(1 << keyId)) | (pressed ? 1 << keyId : 0);

      return false;
    },

    isMousePressed: function (this: ChoicesLayer, keyCode: number) {
      if (Agtk.controllers.getKeyValue(0, keyCode) != 0) {
        return true;
      }

      return false;
    },

    isMouseJustPressed: function (this: ChoicesLayer, keyCode: number) {
      const pressed = this.isMousePressed(keyCode);

      if (!(this.mousePressedKey & (1 << keyCode)) && pressed) {
        this.mousePressedKey = (this.mousePressedKey & ~(1 << keyCode)) | (pressed ? 1 << keyCode : 0);
        return true;
      }

      this.mousePressedKey = (this.mousePressedKey & ~(1 << keyCode)) | (pressed ? 1 << keyCode : 0);

      return false;
    },

    setChildrenOpacity: function (this: ChoicesLayer, node: CCNode, alpha: number) {
      const children = node.children;

      for (let i = 0; i < children.length; i++) {
        children[i].opacity = alpha;
      }
    }
  });
}
