import Phaser from "phaser";
// import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
// import { getSocket } from "../websockets";

import {
  assets,
  commonPreload,
  curtainRender,
  //   renderTextAt,
  getScreenHalfWidth,
  //   getScreenHalfHeight,
  //   getRandomInt,
  textStyle,
} from "../utils";

type MenuInput = {
  closeCurtains?: boolean;
};

let isMusicPlaying = false;

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    commonPreload(this);
  }

  create(input: MenuInput) {
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);

    curtainRender(this, input.closeCurtains, input.closeCurtains);

    const COLOR_LIGHT = 0x7b5e57;
    const COLOR_DARK = 0x260e04;
    this.rexUI.add
      .slider({
        x: 770,
        y: 593,
        width: 50,
        height: 5,
        orientation: "x",
        value: this.sound.volume,

        track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 3, COLOR_DARK),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 5, COLOR_LIGHT),

        valuechangeCallback: (value) => {
          this.sound.setVolume(value);
        },
        space: {
          top: 4,
          bottom: 4,
        },
        input: "drag", // 'drag'|'click'
      })
      .layout();

    this.sound.add("soundtrack");
    if (isMusicPlaying) {
      this.sound.play("soundtrack", {
        volume: 0.1,
        loop: true,
      });
      isMusicPlaying = true;
    }

    this.writeText();
  }

  update(time: number, delta: number): void {}

  newGame() {
    this.scene.start("GameScene");
  }

  writeText() {
    const textObjects: { text: Phaser.GameObjects.Text; offset: number }[] = [];
    textObjects.push({
      text: this.add
        .text(getScreenHalfWidth(), 50, "Stand and Deliver", {
          ...textStyle,
          fontSize: "48px",
        })
        .setOrigin(0.5, 0.5),
      offset: 100,
    });
    textObjects.push({
      text: this.add
        .text(getScreenHalfWidth(), 0, "Start Game", {
          ...textStyle,
          fontSize: "24px",
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.newGame())
        .setOrigin(0.5, 0.5),
      offset: 20,
    });
    textObjects.push({
      text: this.add
        .text(getScreenHalfWidth(), 0, "Instructions", {
          ...textStyle,
          fontSize: "24px",
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.scene.start("InstructionsScene"))
        .setOrigin(0.5, 0.5),
      offset: 20,
    });
    textObjects.push({
      text: this.add
        .text(getScreenHalfWidth(), 0, "Credits", {
          ...textStyle,
          fontSize: "24px",
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.scene.start("CreditsScene"))
        .setOrigin(0.5, 0.5),
      offset: 20,
    });

    textObjects.forEach((item, index) => {
      if (index === 0) {
        return;
      }
      const previousText = textObjects[index - 1];
      item.text.y =
        previousText.text.y + previousText.text.height + previousText.offset;
    });
  }
}
