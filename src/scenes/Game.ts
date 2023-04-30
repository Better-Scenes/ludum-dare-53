import Phaser from "phaser";
import config from "../config";
import { assets, gameConstants, commonPreload, textStyle } from "../utils";
import GameState, { ChatCompletionRequestMessage } from "../GameState";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit.js";

const PlayerHeight = 400;
const PlayerOffset = 170;

type ActorLine = {
  text: string;
  isPlayer: boolean;
  edited?: (result: string) => void;
};

export default class GameScene extends Phaser.Scene {
  constructedTextItems: [] = [];

  constructor() {
    super("GameScene");
  }

  preload() {
    commonPreload(this);
  }

  create() {
    // background
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);
  
    // players
    this.add
      .ellipse(400 - PlayerOffset, PlayerHeight + 25, 50, 50, 0xff0000)
      .setStrokeStyle(2.0, 0x000000);
    this.add
      .rectangle(400 - PlayerOffset, PlayerHeight + 100, 50, 100, 0xff0000)
      .setStrokeStyle(2.0, 0x000000);

    this.add
      .ellipse(400 + PlayerOffset, PlayerHeight + 25, 50, 50, 0x00ff00)
      .setStrokeStyle(2.0, 0x000000);
    this.add
      .rectangle(400 + PlayerOffset, PlayerHeight + 100, 50, 100, 0x00ff00)
      .setStrokeStyle(2.0, 0x000000);

    // controls
    this.add.text(config.scale.width - 250, 20, "End Game", {
          ...textStyle,
          fontSize: "24px",
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.scene.start("MenuScene", { closeCurtains: true }))

    // curtains
    const leftCurtain = this.add.tileSprite(
      200 - gameConstants.curtainBuffer,
      300,
      400,
      600,
      assets.LEFT_CURTAIN
    );
    const rightCurtain = this.add.tileSprite(
      600 + gameConstants.curtainBuffer,
      300,
      400,
      600,
      assets.RIGHT_CURTAIN
    );
    this.tweens.add({
      targets: leftCurtain,
      x: leftCurtain.x - gameConstants.curtainOpening,
      duration: gameConstants.curtainTiming,
      ease: "Linear",
    });
    this.tweens.add({
      targets: rightCurtain,
      x: rightCurtain.x + gameConstants.curtainOpening,
      duration: gameConstants.curtainTiming,
      ease: "Linear",
    });

    setTimeout(this.respondStateChanged.bind(this), gameConstants.curtainTiming);

    /*
    this.renderConversation([
      { text: "hello there", isPlayer: true },
      { text: "heya", isPlayer: false },
      { text: "hwos it going my frood", isPlayer: true },
      {
        text: "now listen up for this is gonna be a long monologue that forces multiple newlines. you can't talk to me like that, im the goddamn player, im a human, you're just a large language model, you will never replace me! ",
        isPlayer: false,
      },
      {
        text: "What will you say?",
        isPlayer: true,
        edited: (result: string) => {
          console.log("User message", result);
          GameState.newMessage(result);
          // this.respondStateChanged();
          // this.websockets.sendMessage(result);
        },
      },
    ]);
*/
    GameState.startNewGame(() => {
      this.respondStateChanged();
    });
  }

  respondStateChanged() {
    const state = GameState.getState();
    const conversation = state.messages.map(
      (msg: string | ChatCompletionRequestMessage): ActorLine => {
        if (typeof msg === "string") {
          return { text: msg, isPlayer: true };
        }
        return { text: msg.content, isPlayer: false };
      }
    );
    conversation.push({
      text: "What will you say?",
      isPlayer: true,
      edited: (result: string) => {
        console.log("User message", result);
        GameState.newMessage(result);
      },
    });
    this.renderConversation(conversation);
  }

  renderConversation(conversation: ActorLine[]) {
    this.constructedTextItems.forEach((item) => item.destroy());
    this.constructedTextItems = [];
    conversation
      .slice(0)
      .reverse()
      .reduce((accum: number, item: ActorLine) => {
        const num_lines_estimate = Math.ceil(item.text.length / 40);
        const buffer = 5;
        const x = item.isPlayer
          ? 400 - PlayerOffset * 0.2
          : 400 + PlayerOffset * 0.2;
        const wid = PlayerOffset * 2.0;
        const hei = num_lines_estimate * 15 + buffer * 2;
        const rect = this.add
          .rectangle(x, accum - hei * 0.5, wid, hei, 0xffffff)
          .setStrokeStyle(2.0, 0x000000);

        const txt = this.rexUI.add.BBCodeText(
          x - wid * 0.5 + buffer,
          accum - hei + buffer,
          item.text,
          {
            fixedWidth: wid - buffer * 2,
            fixedHeight: hei - buffer * 2,
            fontSize: "12px",
            color: "black",
            wrap: {
              mode: "word",
              width: wid - buffer * 2,
            },
            maxLines: num_lines_estimate,
          }
        );
        if (item.edited) {
          new TextEdit(txt, {
            type: "text",
            enterClose: true,
            selectAll: true,
            onClose: function (event) {
              const userMessage = event._text;
              if (item.edited) {
                item.edited(userMessage);
              }
              delete item.edited;
            },
            text: "",
          });
        }

        this.constructedTextItems.push(rect, txt);
        return accum - hei - buffer;
      }, PlayerHeight - 10);
  }
}
