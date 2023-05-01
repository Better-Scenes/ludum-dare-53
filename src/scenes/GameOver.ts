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
    this.load.image(assets.NEWSPAPER_0, "assets/newspaper_1.png");
    this.load.image(assets.NEWSPAPER_1, "assets/newspaper_2.png");
    this.load.image(assets.NEWSPAPER_2, "assets/newspaper_3.png");
    this.load.image(assets.NEWSPAPER_3, "assets/newspaper_4.png");
    this.load.image(assets.NEWSPAPER_4, "assets/newspaper_5.png");
    this.load.image(assets.NEWSPAPER_5, "assets/newspaper_6.png");
    this.load.image(assets.STAR, "assets/star.png");
    this.load.image(assets.STAR_HALF, "assets/star_half.png");
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);
    curtainRender(this, true, true);

    // GameState.startNewGame(() => {});

    const state = GameState.getState();
    const criticism: string = state.critic?.feedback || "All our critics died at the same time as print media and there's no one left to review this.";

    const newspaperWidth = 500;
    const newspaperHeight = 400;
    const bufferY = 150;

    const possibleNewspapers = [
      assets.NEWSPAPER_0,
      assets.NEWSPAPER_1,
      assets.NEWSPAPER_2,
      assets.NEWSPAPER_3,
      assets.NEWSPAPER_4,
      assets.NEWSPAPER_5,
    ];
    const rect = this.add.sprite(
      0,
      0,
      possibleNewspapers[Math.floor(Math.random() * possibleNewspapers.length)]
    );
    const text = this.rexUI.add.BBCodeText(0, bufferY, criticism, {
      fixedWidth: newspaperWidth,
      fixedHeight: newspaperHeight,
      fontSize: "12px",
      color: "black",
      align: "left",
      wrap: {
        mode: "word",
        width: newspaperWidth,
      },
      maxLines: 10,
    });
    text.setOrigin(0.5, 0.5);
    const elements = [rect, text];

    const renderScore = (txt: string, score: number, height: number) => {
      elements.push(this.add.text(newspaperWidth * -0.5, height, txt, {
        fontSize: "12px",
        color: 'black',
      }).setOrigin(0.0, 0.5));
      let starOffset = newspaperWidth * -0.25;//newspaperWidth - 300;
      const scale = 0.3;
      while (score >= 2) {
        elements.push(this.add.sprite(starOffset, height, assets.STAR).setScale(scale).setOrigin(0.5));
        score -= 2;
        starOffset += 20;
      }
      if (score >= 1) {
        elements.push(this.add.sprite(starOffset, height, assets.STAR_HALF).setScale(scale).setOrigin(0.5));
      }
    };
    let scoreOffset = 100;
    renderScore("Humor", state.critic?.scores.humor || 0, scoreOffset);
    renderScore("Originality", state.critic?.scores.originality || 0, scoreOffset += 20);
    renderScore("Relevance", state.critic?.scores.relevance || 0, scoreOffset += 20);
    renderScore("Overall", state.critic?.scores.overall || 0, scoreOffset += 20);

    // const newspaperDelay = 80;
    const newspaperDelay = 800;

    const newsContainer = this.add.container(400, 300, elements);
    newsContainer.scale = 0.0;
    this.tweens.add({
      targets: newsContainer,
      angle: -360 * 4 - 10,
      scale: 1,
      duration: newspaperDelay,
      ease: "Linear",
    });

    const conversation = state.messages.map(
      (msg: string | ChatCompletionRequestMessage): ActorLine => {
        if (typeof msg === "string") {
          return `\t\t\t\tPLAYER\n${msg}\n`;
        }
        return `\t\t\t\tACTOR\n${msg.content}\n`;
      }
    ).join("\n");

    const scriptPage = this.add.rectangle(0, 0, 300, 250, 0xf8f8f8);
    const scriptText = this.rexUI.add.BBCodeText(0, 0, conversation, {
      fixedWidth: 250,
      fixedHeight: 200,
      fontSize: "12px",
      color: "black",
      align: "left",
      wrap: {
        mode: "word",
        width: 250,
      },
      maxLines: 10,
    });
    scriptText.setOrigin(0.5, 0.5);

    // red 250 green 200 blue 0

    const scriptContainer = this.add.container(1000, 600, [scriptPage, scriptText]);
    scriptContainer.angle = 5;

    this.tweens.add({
      targets: scriptContainer,
      x: 650,
      y: 450,
      duration: 200,
      delay: newspaperDelay,
      ease: "Linear",
      loop: false,
    });

    const promptSize = 150;
    const promptPage = this.add.rectangle(0, 0, promptSize, promptSize, 0xF7CA00);
    const promptText = this.rexUI.add.BBCodeText(5, 5, state.prompt || '', {
      fixedWidth: promptSize,
      fixedHeight: promptSize,
      fontSize: "12px",
      color: "black",
      align: "center",
      wrap: {
        mode: "word",
        width: promptSize - 10,
      },
      maxLines: 10,
    });
    promptText.setOrigin(0.5, 0.5);

    const promptContainer = this.add.container(-500, -100, [promptPage, promptText]);
    promptContainer.angle = 2;

    this.tweens.add({
      targets: promptContainer,
      x: 100,
      y: 100,
      duration: 200,
      delay: newspaperDelay,
      ease: "Linear",
      loop: false,
    });

    // controls
    this.add
      .text(config.scale.width - 250, 20, "Return to Menu", {
        ...textStyle,
        fontSize: "24px",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MenuScene"));
  }
}
