import Phaser from "phaser";

import { assets, commonPreload } from "../utils";

const PlayerHeight = 400;
const PlayerOffset = 170;

type ActorLine = {
  text: string;
  isPlayer: boolean;
};

export default class GameScene extends Phaser.Scene {
  conversation: ActorLine[] = [];
  constructedTextItems: [] = [];

  constructor() {
    super("GameScene");

    this.conversation = [
      { text: "hello there", isPlayer: true },
      { text: "heya", isPlayer: false },
      { text: "hwos it going my frood", isPlayer: true },
      { text: "go to hell you bastard", isPlayer: false },
      { text: "now listen up for this is gonna be a long monologue that forces multiple newlines. you can't talk to me like that, im the goddamn player, im a human, you're just a large language model, you will never replace me! ", isPlayer: true },
    ];
  }

  preload() {
    commonPreload(this);
  }

  create() {
    this.add.tileSprite(400, 300, 800, 600, assets.BACKDROP);

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

    this.renderConversation(this.conversation);
  }

  renderConversation(conversation: ActorLine[]) {
    this.constructedTextItems.forEach(item => item.destroy());
    this.constructedTextItems = [];
    conversation.slice(0).reverse().reduce((accum: number, item: ActorLine) => {
      const num_lines_estimate = Math.ceil(item.text.length / 40);
      const buffer = 5;
      const x = item.isPlayer ? 400 - PlayerOffset * 0.2 : 400 + PlayerOffset * 0.2;
      const wid = PlayerOffset * 2.0;
      const hei = num_lines_estimate * 15 + buffer * 2;
      const rect = this.add
        .rectangle(x, accum - hei * 0.5, wid, hei, 0xffffff)
        .setStrokeStyle(2.0, 0x000000);

      const txt = this.rexUI.add.BBCodeText(x - wid * 0.5 + buffer, accum - hei + buffer, item.text, {
        fixedWidth: wid - buffer * 2,
        fixedHeight: hei - buffer * 2,
        fontSize: "12px",
        color: "black",
        wrap: {
          mode: "word",
          width: wid - buffer * 2,
        },
        maxLines: num_lines_estimate,
      });
      this.constructedTextItems.push(rect, txt);
      return accum - hei - buffer;
    }, PlayerHeight - 10);
  }
}