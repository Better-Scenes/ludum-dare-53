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

// TODO set this to true for deploy
let isMusicPlaying = true;

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

    this.sound.add("soundtrack");
    if (isMusicPlaying) {
      this.sound.play("soundtrack", {
        volume: 0.15,
        loop: true,
      });
      isMusicPlaying = false;
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
