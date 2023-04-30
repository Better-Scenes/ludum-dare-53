import Phaser from "phaser";
import config from "./config";

import GameScene from "./scenes/Game";
import MenuScene from "./scenes/Menu";
import GameOverScene from "./scenes/GameOver";

new Phaser.Game(
  Object.assign(config, {
    // scene: [MenuScene, GameScene, GameOverScene],
    scene: [GameScene, MenuScene, GameOverScene],
    // scene: [GameOverScene, MenuScene, GameScene],
  })
);
