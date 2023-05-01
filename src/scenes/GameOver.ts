import Phaser from "phaser";
import config from "../config";
import { assets, commonPreload, curtainRender, textStyle } from "../utils";
import GameState from "../GameState";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {
    commonPreload(this);
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);
    curtainRender(this, true, true);

    // controls
    this.add
      .text(config.scale.width - 250, 20, "Return to Menu", {
        ...textStyle,
        fontSize: "24px",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MenuScene"));

    const state = GameState.getState();
    let criticism: string = state.critic?.feedback || "";

    criticism += `\n${JSON.stringify(state.critic?.scores)}`;

    // criticism += `\n${state.messages.map((m) => m.)}`

    const newspaperWidth = 500;
    const newspaperHeight = 400;
    const bufferX = 10;
    const bufferY = 10;

    const rect = this.add.rectangle(
      0,
      0,
      newspaperWidth,
      newspaperHeight,
      0xffffff
    );
    // const text = this.add.text(0, 0, criticism, {
    //   fontSize: "32px",
    //   color: "#000000",
    // });

    const text = this.rexUI.add.BBCodeText(bufferX, bufferY, criticism, {
      fixedWidth: newspaperWidth - bufferX * 2,
      fixedHeight: newspaperHeight,
      fontSize: "12px",
      color: "black",
      align: "left",
      wrap: {
        mode: "word",
        width: newspaperWidth - bufferX * 2,
      },
      maxLines: 10,
    });
    text.setOrigin(0.5, 0.5);

    const container = this.add.container(400, 300, [rect, text]);
    container.scale = 0.0;

    this.tweens.add({
      targets: container,
      angle: -360 * 4 - 10,
      scale: 1,
      duration: 800,
      ease: "Linear",
    });
  }
}
