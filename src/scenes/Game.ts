import Phaser from "phaser";
import config from "../config";
import {
  assets,
  gameConstants,
  commonPreload,
  curtainRender,
  getScreenHalfWidth,
  textStyle,
  seatPlacements,
} from "../utils";
import GameState, { ChatCompletionRequestMessage } from "../GameState";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit.js";

type ActorLine = {
  text: string;
  isPlayer: boolean;
  edited?: (result: string) => void;
};

export default class GameScene extends Phaser.Scene {
  constructedTextItems: [] = [];
  promptText?: Phaser.GameObjects.Text;

  constructor() {
    super("GameScene");
  }

  preload() {
    commonPreload(this);
  }

  create() {
    // background
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);

    const addAt = (x, y, mult) => {
      const roll = Math.random();
      const col = roll > 0.66 ? 0xff0000 : (roll > 0.33 ? 0x00ff00 : 0x0000ff)
      this.add.rectangle(x, y + 15 * mult, 50 * mult, 30 * mult, col);
      this.add.ellipse(x, y + -25 * mult, 50 * mult, 50 * mult, col);
    };
    seatPlacements.forEach(item => addAt(item.x, item.y, item.mult));

    // players
    this.add
      .ellipse(
        getScreenHalfWidth() - gameConstants.playerOffset,
        gameConstants.playerHeight + 25,
        50,
        50,
        0xff0000
      )
      .setStrokeStyle(2.0, 0x000000);
    this.add
      .rectangle(
        getScreenHalfWidth() - gameConstants.playerOffset,
        gameConstants.playerHeight + 100,
        50,
        100,
        0xff0000
      )
      .setStrokeStyle(2.0, 0x000000);

    this.add
      .ellipse(
        getScreenHalfWidth() + gameConstants.playerOffset,
        gameConstants.playerHeight + 25,
        50,
        50,
        0x00ff00
      )
      .setStrokeStyle(2.0, 0x000000);
    this.add
      .rectangle(
        getScreenHalfWidth() + gameConstants.playerOffset,
        gameConstants.playerHeight + 100,
        50,
        100,
        0x00ff00
      )
      .setStrokeStyle(2.0, 0x000000);

    const promptWidth = 350;
    const promptHeight = 60;
    const promptY = 40;
    const promptStrut = 100;
    this.add
      .rectangle(
        getScreenHalfWidth(),
        promptY,
        promptWidth,
        promptHeight,
        0xffffff
      )
      .setStrokeStyle(2.0, 0x202020);
    this.add.rectangle(
      getScreenHalfWidth() - promptStrut,
      0,
      20,
      promptY * 0.5,
      0x202020
    );
    this.add.rectangle(
      getScreenHalfWidth() + promptStrut,
      0,
      20,
      promptY * 0.5,
      0x202020
    );

    this.promptText = this.rexUI.add.BBCodeText(
      config.scale.width * 0.5 + 5,
      promptY + 5,
      "...",
      // "You are a cavewoman, you are trying to explain to your boyfriend that you are pregnant",
      {
        fixedWidth: promptWidth - 10,
        fixedHeight: promptHeight,
        fontSize: "12px",
        color: "red",
        align: "center",
        wrap: {
          mode: "word",
          width: promptWidth - 10,
        },
        maxLines: 5,
      }
    );

    this.promptText.setOrigin(0.5, 0.5);

    // controls
    this.add.text(config.scale.width - 220, 20, "End Game", {
          ...textStyle,
          fontSize: "24px",
        })
        .setInteractive({ useHandCursor: true })
        // .on("pointerdown", () => this.scene.start("MenuScene", { closeCurtains: true }))
        .on("pointerdown", () => this.scene.start("GameOverScene"))

    curtainRender(this, false, true);
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
    if (this.promptText) {
      this.promptText.text = state.prompt || "";
    }
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
        if (GameState.getState().messages.length <= 1) {
          GameState.newMessage(result);
        } else {
          GameState.finalMessage(result);
        }
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
          ? 400 - gameConstants.playerOffset * 0.2
          : 400 + gameConstants.playerOffset * 0.2;
        const wid = gameConstants.playerOffset * 2.0;
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
      }, gameConstants.playerHeight - 10);
  }
}
