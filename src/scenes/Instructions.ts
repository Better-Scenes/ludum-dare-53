/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Phaser from "phaser";

import {
  assets,
  commonPreload,
  curtainRender,
  getScreenHalfWidth,
  textStyle,
} from "../utils";

export default class InstructionsScene extends Phaser.Scene {
  [x: string]: any;
  constructor() {
    super("InstructionsScene");
  }

  preload() {
    commonPreload(this);
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);

    curtainRender(this, false, false);

    this.writeText();
  }

  update(time: number, delta: number): void {}

  writeText() {
    this.rexUI.add
      .BBCodeText(getScreenHalfWidth(), 50, "Instructions", {
        ...textStyle,
        fontSize: "36px",
        backgroundColor: "#888",
        backgroundColor2: "#222",
        backgroundHorizontalGradient: false,
        backgroundCornerRadius: -5, // 20
        halign: "center", // 'left'|'center'|'right'
        valign: "center", // 'top'|'center'|'bottom'
        padding: 10,
      })
      .setOrigin(0.5, 0.5);

    const rect = this.add.rectangle(0, 0, 400, 400, 0xffffff, 0.6);

    const instructions =
      `[size=20]You are an improv comedian, it's your first time on the big stage!
      
      [size=16]Your job is to listen to your prompt, and act out the scene. You will have a supporting actor helping you out.

      You will be rated on your performance, you should try to stick to the prompt, and try to be funny (you're a comedian after all!)

      [size=20][b]Example:[/b]
      [size=16]Prompt: You are an excited person, happy to see your friend.
      Your Response: *clapping hands* oh my god I'm so excited to see you!
      `.replace(/[ \t]{2,}/g, "");
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

    this.add.container(400, 300, [rect, text]);

    this.rexUI.add
      .BBCodeText(getScreenHalfWidth(), 550, "Back to Menu", {
        ...textStyle,
        fontSize: "24px",
        backgroundColor: "#888",
        backgroundColor2: "#222",
        backgroundHorizontalGradient: false,
        padding: 8,
        backgroundStrokeColor: "black", // null, css string, or number
        backgroundStrokeLineWidth: 2,
        backgroundCornerRadius: -5, // 20
        halign: "center", // 'left'|'center'|'right'
        valign: "center", // 'top'|'center'|'bottom'
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MenuScene", { closeCurtains: false }))
      .setOrigin(0.5, 0.5);
  }
}
