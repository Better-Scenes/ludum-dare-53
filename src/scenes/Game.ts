import Phaser from "phaser";

import { assets, commonPreload } from "../utils";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    commonPreload(this);
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);
    // this.add.text(0, 0, "Hello World");

    this.add.ellipse(250, 425, 50, 50, 0xff0000);
    this.add.rectangle(250, 500, 50, 100, 0xff0000);

    this.add.ellipse(550, 425, 50, 50, 0x00ff00);
    this.add.rectangle(550, 500, 50, 100, 0x00ff00);
  }
}
