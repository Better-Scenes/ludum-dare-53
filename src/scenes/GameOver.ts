import Phaser from "phaser";
import config from "../config";
import { assets, commonPreload, curtainRender, textStyle } from "../utils";

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
    this.add.text(config.scale.width - 250, 20, "Return to Menu", {
      ...textStyle,
      fontSize: "24px",
    })
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => this.scene.start("MenuScene"));

    const rect = this.add.rectangle(0, 0, 500, 400, 0xffffff);
    const text = this.add.text(0, 0, 'Game Over\ntest newline\n', { fontSize: '32px', color: '#000000' });
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
