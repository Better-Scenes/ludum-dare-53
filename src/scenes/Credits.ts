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
    this.add
      .text(getScreenHalfWidth(), 50, "Credits", {
        ...textStyle,
        fontSize: "36px",
      })
      .setOrigin(0.5, 0.5);

    const rect = this.add.rectangle(0, 0, 400, 400, 0xffffff, 0.6);

    const instructions = `[size=20]Programming: 
      - Grigory Graborenko
      - Rohan Richards
      
      Art:
      - Andrew Thomas Scott
      
      Music:
      - Robin Kaye
      
      With Special Thanks:
      - Irene and Leif Richards
      - Tanzih Ahmed`.replace(/[ \t]{2,}/g, "");
    const text = this.rexUI.add.BBCodeText(10, 10, instructions, {
      fixedWidth: 400 - 20,
      fixedHeight: 400 - 20,
      fontSize: "18px",
      color: "black",
      align: "left",
      wrap: {
        mode: "word",
        width: 400 - 20,
      },
      maxLines: 20,
    });
    text.setOrigin(0.5, 0.5);

    const container = this.add.container(400, 300, [rect, text]);

    this.add
      .text(getScreenHalfWidth(), 550, "Return to Menu", {
        ...textStyle,
        fontSize: "24px",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MenuScene"))
      .setOrigin(0.5, 0.5);
  }
}
