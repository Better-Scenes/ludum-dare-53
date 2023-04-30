import Phaser from "phaser";

import {
  assets,
  commonPreload,
  curtainRender,
  getScreenHalfWidth,
  textStyle,
} from "../utils";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("CreditsScene");
  }

  preload() {
    commonPreload(this);
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);

    curtainRender(this, true, false);

    this.writeText();
  }

  update(time: number, delta: number): void {}

  writeText() {

    this.add.text(getScreenHalfWidth(), 50, "Credits", {
      ...textStyle,
      fontSize: "36px",
    }).setOrigin(0.5, 0.5);

    this.add.text(getScreenHalfWidth(), 550, "Return to Menu", {
      ...textStyle,
      fontSize: "24px",
    })
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => this.scene.start("MenuScene"))
    .setOrigin(0.5, 0.5);
  }
}
