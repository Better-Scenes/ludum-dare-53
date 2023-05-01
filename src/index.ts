import Phaser from "phaser";
import config from "./config";

import MenuScene from "./scenes/Menu";
import CreditsScene from "./scenes/Credits";
import InstructionsScene from "./scenes/Instructions";
import GameScene from "./scenes/Game";
import GameOverScene from "./scenes/GameOver";

new Phaser.Game(
  Object.assign(config, {
    // scene: [MenuScene, CreditsScene, InstructionsScene, GameScene, GameOverScene],
    scene: [
      InstructionsScene,
      MenuScene,
      GameScene,
      CreditsScene,
      GameOverScene,
    ],
    // scene: [
    //   GameOverScene,
    //   CreditsScene,
    //   InstructionsScene,
    //   MenuScene,
    //   GameScene,
    // ],
  })
);
