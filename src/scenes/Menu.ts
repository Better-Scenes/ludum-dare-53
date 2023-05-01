import Phaser from "phaser";
import config from "../config";

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
      text: this.rexUI.add
        .BBCodeText(getScreenHalfWidth(), 100, "Stand and Deliver", {
          ...textStyle,
          fontSize: "42px",
          backgroundColor: "#888",
          backgroundColor2: "#222",
          backgroundHorizontalGradient: false,
          backgroundCornerRadius: -5, // 20
          halign: "center", // 'left'|'center'|'right'
          valign: "center", // 'top'|'center'|'bottom'
          padding: 10,
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.newGame())
        .setOrigin(0.5, 0.5),
      offset: 100,
    });
    textObjects.push({
      text: this.rexUI.add
        .BBCodeText(getScreenHalfWidth(), 0, "Start Game", {
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
        .on("pointerdown", () => this.newGame())
        .setOrigin(0.5, 0.5),
      offset: 20,
    });
    textObjects.push({
      text: this.rexUI.add
        .BBCodeText(getScreenHalfWidth(), 0, "Instructions", {
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
        .on("pointerdown", () => this.scene.start("InstructionsScene"))
        .setOrigin(0.5, 0.5),
      offset: 20,
    });
    textObjects.push({
      text: this.rexUI.add
        .BBCodeText(getScreenHalfWidth(), 0, "Credits", {
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
