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
  faces: Phaser.GameObjects.Sprite[] = [];
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

    this.faces = [];
    const addAudienceAt = (x, y, mult) => {
      const cols = [Math.random(), Math.random(), Math.random()];
      const inv_col = 255.0 / Math.max(cols[0], cols[1], cols[2]);

      const col = Phaser.Display.Color.GetColor(cols[0] * inv_col, cols[1] * inv_col, cols[2] * inv_col);

      this.add.rectangle(x, y + 15 * mult, 50 * mult, 30 * mult, col);
      this.add.ellipse(x, y + -25 * mult, 50 * mult, 50 * mult, col);
      this.faces.push(this.add.sprite(x, y + -25 * mult + 5, assets.FACE_BORED).setScale(mult * 1.5));
    };
    seatPlacements.forEach((item) => addAudienceAt(item.x, item.y, item.mult));

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
    curtainRender(this, false, true);
    setTimeout(
      this.respondStateChanged.bind(this),
      gameConstants.curtainTiming
    );

    this.rexUI.add
      .BBCodeText(
        config.scale.width - 130,
        config.scale.height - 60,
        "Quit Game",
        {
          ...textStyle,
          fontSize: "24px",
          backgroundColor: "#888",
          backgroundColor2: "#222",
          backgroundHorizontalGradient: false,
          padding: 5,
          backgroundStrokeColor: "black", // null, css string, or number
          backgroundStrokeLineWidth: 2,
          backgroundCornerRadius: -5, // 20
          halign: "center", // 'left'|'center'|'right'
          valign: "center", // 'top'|'center'|'bottom'
        }
      )
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MenuScene", { closeCurtains: true }))

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

    if (state.messages.length >= gameConstants.maxRounds && state.critic) {
      this.rexUI.add
        .BBCodeText(
          config.scale.width / 2 - 90,
          config.scale.height - 50,
          "Finish Show",
          {
            ...textStyle,
            fixedWidth: 180,
            fixedHeight: 40,
            fontSize: "24px",
            backgroundColor: "#888",
            backgroundColor2: "#222",
            backgroundHorizontalGradient: false,
            padding: 5,
            backgroundStrokeColor: "black", // null, css string, or number
            backgroundStrokeLineWidth: 2,
            backgroundCornerRadius: -5, // 20
            halign: "center", // 'left'|'center'|'right'
            valign: "center", // 'top'|'center'|'bottom'
          }
        )
        .setInteractive({ useHandCursor: true })
        // .on("pointerdown", () => this.scene.start("MenuScene", { closeCurtains: true }))
        .on("pointerdown", () => this.scene.start("GameOverScene"));
    }

    if (state.crowd) {
      const scores = state.crowd.scores;
      this.faces.forEach((face: Phaser.GameObjects.Sprite) => {
        const weights = [
          { face: assets.FACE_ANGRY, w: (10 - scores.relevance) },
          { face: assets.FACE_BORED, w: (10 - scores.humor) },
          { face: assets.FACE_LAUGH, w: scores.humor },
          { face: assets.FACE_LOVE, w: Math.max(0, scores.humor + scores.relevance - 4) },
        ];
        const total = weights.reduce((sum: number, item) => {
          return item.w + sum;
        }, 0);
        let roll = total * Math.random();
        const selected = weights.find((item) => {
          const chosen = roll < item.w;
          roll -= item.w;
          return chosen;
        });
        face.setTexture(selected?.face || assets.FACE_BORED);
      });
    }

    if (this.promptText) {
      this.promptText.text = state.prompt || "";
    }
    let lastMessagePlayer = false;
    const conversation = state.messages.map(
      (msg: string | ChatCompletionRequestMessage): ActorLine => {
        if (typeof msg === "string") {
          lastMessagePlayer = true;
          return { text: msg, isPlayer: true };
        }
        lastMessagePlayer = false;
        return { text: msg.content, isPlayer: false };
      }
    );
    if (!lastMessagePlayer) {
      conversation.push({
        text: "What will you say?",
        isPlayer: true,
        edited: (result: string) => {
          console.log("User message", result);
          if (state.messages.length <= 1) {
            GameState.newMessage(result);
          } else {
            GameState.finalMessage(result);
          }
        },
      });
    } else if (state.messages.length > 0 && state.messages.length <= 1) {
      conversation.push({ text: "...", isPlayer: false });
    }
    // console.log("conversation", conversation);
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
