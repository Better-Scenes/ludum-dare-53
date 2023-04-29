import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("logo", "assets/phaser3-logo.png");
  }

  create() {
    const logo = this.add.image(400, 70, "logo");
    this.add.text(0, 0, "Hello World");

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }
}
