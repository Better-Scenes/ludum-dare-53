import config from "./config";
import Phaser from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { getSocket } from "./websockets";

export enum assets {
  BACKDROP = "backdrop",
  LEFT_CURTAIN = "left_curtain",
  RIGHT_CURTAIN = "right_curtain",
  SOUNDTRACK = "soundtrack",
  NEWSPAPER_0 = "newspaper_0",
  NEWSPAPER_1 = "newspaper_1",
  NEWSPAPER_2 = "newspaper_2",
  NEWSPAPER_3 = "newspaper_3",
  NEWSPAPER_4 = "newspaper_4",
  NEWSPAPER_5 = "newspaper_5",
  STAR = "star",
  STAR_HALF = "star_half",
  FACE_ANGRY = "face_angry",
  FACE_BORED = "face_bored",
  FACE_LAUGH = "face_laugh",
  FACE_LOVE = "face_love",
}

export const gameConstants = {
  curtainBuffer: 3,
  curtainOpening: 300,
  curtainTiming: 150,
  playerHeight: 420,
  playerOffset: 170,
  maxRounds: 3,
};

export const textStyle = {
  fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
  color: "white",
};

export function commonPreload(scene: Phaser.Scene) {
  scene.load.scenePlugin({
    key: "rexuiplugin",
    url: UIPlugin,
    sceneKey: "rexUI",
  });

  scene.load.image(assets.BACKDROP, "assets/stage_800x600.jpg");
  scene.load.image(assets.LEFT_CURTAIN, "assets/curtain_left_400x600.jpg");
  scene.load.image(assets.RIGHT_CURTAIN, "assets/curtain_right_400x600.jpg");
  scene.load.audio(assets.SOUNDTRACK, "assets/music_draft_1.mp3");

  scene.load.image(assets.NEWSPAPER_0, "assets/newspaper_1.png");
  scene.load.image(assets.NEWSPAPER_1, "assets/newspaper_2.png");
  scene.load.image(assets.NEWSPAPER_2, "assets/newspaper_3.png");
  scene.load.image(assets.NEWSPAPER_3, "assets/newspaper_4.png");
  scene.load.image(assets.NEWSPAPER_4, "assets/newspaper_5.png");
  scene.load.image(assets.NEWSPAPER_5, "assets/newspaper_6.png");
  scene.load.image(assets.STAR, "assets/star.png");
  scene.load.image(assets.STAR_HALF, "assets/star_half.png");

  scene.load.image(assets.FACE_ANGRY, "assets/face_Anger.png");
  scene.load.image(assets.FACE_BORED, "assets/face_Bored.png");
  scene.load.image(assets.FACE_LAUGH, "assets/face_Laugh.png");
  scene.load.image(assets.FACE_LOVE, "assets/face_Love.png");

  getSocket();
}

export function curtainRender(
  scene: Phaser.Scene,
  curtainsOpen: bool,
  curtainsToggle: bool
) {
  const leftCurtain = scene.add.tileSprite(
    200 -
      (curtainsOpen ? gameConstants.curtainOpening : 0) -
      gameConstants.curtainBuffer,
    300,
    400,
    600,
    assets.LEFT_CURTAIN
  );
  const rightCurtain = scene.add.tileSprite(
    600 +
      (curtainsOpen ? gameConstants.curtainOpening : 0) +
      gameConstants.curtainBuffer,
    300,
    400,
    600,
    assets.RIGHT_CURTAIN
  );

  if (curtainsToggle) {
    scene.tweens.add({
      targets: leftCurtain,
      x: leftCurtain.x + gameConstants.curtainOpening * (curtainsOpen ? 1 : -1),
      duration: gameConstants.curtainTiming,
      ease: "Power2",
    });
    scene.tweens.add({
      targets: rightCurtain,
      x:
        rightCurtain.x - gameConstants.curtainOpening * (curtainsOpen ? 1 : -1),
      duration: gameConstants.curtainTiming,
      ease: "Power2",
    });
  }

  const COLOR_LIGHT = 0x7b5e57;
  const COLOR_DARK = 0x260e04;
  scene.rexUI.add
    .slider({
      x: 770,
      y: 593,
      width: 50,
      height: 5,
      orientation: "x",
      value: scene.sound.volume,

      track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 3, COLOR_DARK),
      thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, COLOR_LIGHT),

      valuechangeCallback: (value) => {
        scene.sound.setVolume(value);
      },
      space: {
        top: 4,
        bottom: 4,
      },
      input: "drag", // 'drag'|'click'
    })
    .layout();
}

export function renderTextAt(
  scene: Phaser.Scene,
  text: string,
  x: number,
  y: number
): Phaser.GameObjects.Text {
  return scene.add.text(x, y, text, textStyle).setOrigin(0.5, 0.5);
}

export function getScreenHalfWidth(): number {
  return config.scale.width * 0.5;
}

export function getScreenHalfHeight(): number {
  return config.scale.height * 0.5;
}

export function getScreenSize(): { x: number; y: number } {
  return { x: config.scale.width, y: config.scale.height };
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export const seatPlacements = [
  { x: 284, y: 239, mult: 0.3 },
  { x: 305, y: 241, mult: 0.3 },
  { x: 170, y: 237, mult: 0.3 },
  { x: 599, y: 249, mult: 0.3 },
  { x: 573, y: 249, mult: 0.3 },
  { x: 649, y: 250, mult: 0.3 },
  { x: 526, y: 249, mult: 0.3 },
  { x: 389, y: 242, mult: 0.3 },
  { x: 456, y: 245, mult: 0.3 },
  { x: 146, y: 245, mult: 0.3 },
  { x: 166, y: 246, mult: 0.3 },
  { x: 223, y: 246, mult: 0.3 },
  { x: 265, y: 248, mult: 0.3 },
  { x: 286, y: 249, mult: 0.3 },
  { x: 340, y: 249, mult: 0.3 },
  { x: 421, y: 250, mult: 0.3 },
  { x: 547, y: 249, mult: 0.3 },
  { x: 541, y: 260, mult: 0.3 },
  { x: 680, y: 249, mult: 0.3 },
  { x: 620, y: 257, mult: 0.3 },
  { x: 595, y: 257, mult: 0.3 },
  { x: 243, y: 247, mult: 0.33 },
  { x: 196, y: 255, mult: 0.33 },
  { x: 221, y: 256, mult: 0.33 },
  { x: 322, y: 250, mult: 0.33 },
  { x: 264, y: 256, mult: 0.33 },
  { x: 498, y: 258, mult: 0.33 },
  { x: 370, y: 250, mult: 0.33 },
  { x: 354, y: 258, mult: 0.33 },
  { x: 401, y: 258, mult: 0.33 },
  { x: 475, y: 258, mult: 0.33 },
  { x: 646, y: 259, mult: 0.33 },
  { x: 677, y: 259, mult: 0.33 },
  { x: 124, y: 255, mult: 0.33 },
  { x: 163, y: 257, mult: 0.33 },
  { x: 303, y: 262, mult: 0.35 },
  { x: 196, y: 267, mult: 0.35 },
  { x: 149, y: 268, mult: 0.35 },
  { x: 122, y: 268, mult: 0.35 },
  { x: 173, y: 268, mult: 0.35 },
  { x: 123, y: 280, mult: 0.35 },
  { x: 152, y: 281, mult: 0.35 },
  { x: 182, y: 282, mult: 0.35 },
  { x: 209, y: 282, mult: 0.35 },
  { x: 242, y: 266, mult: 0.35 },
  { x: 244, y: 281, mult: 0.35 },
  { x: 264, y: 269, mult: 0.35 },
  { x: 285, y: 268, mult: 0.35 },
  { x: 279, y: 281, mult: 0.35 },
  { x: 300, y: 281, mult: 0.35 },
  { x: 346, y: 267, mult: 0.35 },
  { x: 336, y: 280, mult: 0.35 },
  { x: 369, y: 280, mult: 0.35 },
  { x: 396, y: 268, mult: 0.35 },
  { x: 397, y: 280, mult: 0.35 },
  { x: 439, y: 256, mult: 0.35 },
  { x: 419, y: 266, mult: 0.35 },
  { x: 421, y: 279, mult: 0.35 },
  { x: 442, y: 281, mult: 0.35 },
  { x: 470, y: 270, mult: 0.35 },
  { x: 497, y: 280, mult: 0.35 },
  { x: 523, y: 266, mult: 0.35 },
  { x: 527, y: 279, mult: 0.35 },
  { x: 567, y: 280, mult: 0.35 },
  { x: 591, y: 266, mult: 0.35 },
  { x: 592, y: 281, mult: 0.35 },
  { x: 618, y: 266, mult: 0.35 },
  { x: 616, y: 279, mult: 0.35 },
  { x: 646, y: 270, mult: 0.35 },
  { x: 650, y: 282, mult: 0.35 },
  { x: 680, y: 283, mult: 0.35 },
  { x: 154, y: 297, mult: 0.35 },
  { x: 255, y: 298, mult: 0.35 },
  { x: 420, y: 295, mult: 0.35 },
  { x: 560, y: 296, mult: 0.35 },
  { x: 587, y: 295, mult: 0.35 },
  { x: 183, y: 295, mult: 0.4 },
  { x: 219, y: 296, mult: 0.4 },
  { x: 279, y: 296, mult: 0.4 },
  { x: 312, y: 296, mult: 0.4 },
  { x: 343, y: 296, mult: 0.4 },
  { x: 372, y: 296, mult: 0.4 },
  { x: 398, y: 296, mult: 0.4 },
  { x: 469, y: 296, mult: 0.4 },
  { x: 500, y: 295, mult: 0.4 },
  { x: 443, y: 296, mult: 0.4 },
  { x: 528, y: 294, mult: 0.4 },
  { x: 614, y: 295, mult: 0.4 },
  { x: 650, y: 296, mult: 0.4 },
  { x: 683, y: 296, mult: 0.4 },
  { x: 122, y: 294, mult: 0.4 },
  { x: 157, y: 314, mult: 0.4 },
  { x: 123, y: 314, mult: 0.4 },
  { x: 221, y: 313, mult: 0.4 },
  { x: 513, y: 312, mult: 0.4 },
  { x: 549, y: 313, mult: 0.4 },
  { x: 615, y: 313, mult: 0.4 },
  { x: 650, y: 314, mult: 0.4 },
  { x: 404, y: 313, mult: 0.4 },
  { x: 230, y: 332, mult: 0.4 },
  { x: 191, y: 312, mult: 0.45 },
  { x: 253, y: 311, mult: 0.45 },
  { x: 287, y: 311, mult: 0.45 },
  { x: 327, y: 310, mult: 0.45 },
  { x: 367, y: 312, mult: 0.45 },
  { x: 437, y: 312, mult: 0.45 },
  { x: 471, y: 314, mult: 0.45 },
  { x: 578, y: 312, mult: 0.45 },
  { x: 682, y: 312, mult: 0.45 },
  { x: 681, y: 333, mult: 0.45 },
  { x: 648, y: 331, mult: 0.45 },
  { x: 611, y: 333, mult: 0.45 },
  { x: 577, y: 331, mult: 0.45 },
  { x: 545, y: 332, mult: 0.45 },
  { x: 498, y: 333, mult: 0.45 },
  { x: 442, y: 331, mult: 0.45 },
  { x: 403, y: 331, mult: 0.45 },
  { x: 367, y: 330, mult: 0.45 },
  { x: 329, y: 332, mult: 0.45 },
  { x: 300, y: 331, mult: 0.45 },
  { x: 264, y: 330, mult: 0.45 },
  { x: 239, y: 355, mult: 0.45 },
  { x: 197, y: 332, mult: 0.45 },
  { x: 158, y: 334, mult: 0.45 },
  { x: 119, y: 333, mult: 0.45 },
  { x: 158, y: 355, mult: 0.45 },
  { x: 559, y: 354, mult: 0.45 },
  { x: 600, y: 354, mult: 0.45 },
  { x: 594, y: 382, mult: 0.45 },
  { x: 681, y: 355, mult: 0.45 },
  { x: 280, y: 352, mult: 0.5 },
  { x: 154, y: 382, mult: 0.5 },
  { x: 112, y: 382, mult: 0.5 },
  { x: 201, y: 383, mult: 0.5 },
  { x: 320, y: 354, mult: 0.5 },
  { x: 362, y: 353, mult: 0.5 },
  { x: 246, y: 382, mult: 0.5 },
  { x: 288, y: 384, mult: 0.5 },
  { x: 332, y: 384, mult: 0.5 },
  { x: 376, y: 383, mult: 0.5 },
  { x: 401, y: 353, mult: 0.5 },
  { x: 439, y: 352, mult: 0.5 },
  { x: 471, y: 331, mult: 0.5 },
  { x: 474, y: 354, mult: 0.5 },
  { x: 644, y: 353, mult: 0.5 },
  { x: 638, y: 383, mult: 0.5 },
  { x: 681, y: 382, mult: 0.5 },
  { x: 516, y: 353, mult: 0.5 },
  { x: 509, y: 380, mult: 0.5 },
  { x: 464, y: 382, mult: 0.5 },
  { x: 495, y: 414, mult: 0.5 },
  { x: 690, y: 414, mult: 0.5 },
  { x: 153, y: 411, mult: 0.5 },
  { x: 201, y: 413, mult: 0.55 },
  { x: 108, y: 412, mult: 0.55 },
  { x: 249, y: 413, mult: 0.55 },
  { x: 299, y: 415, mult: 0.55 },
  { x: 344, y: 415, mult: 0.55 },
  { x: 423, y: 381, mult: 0.55 },
  { x: 395, y: 413, mult: 0.55 },
  { x: 447, y: 414, mult: 0.55 },
  { x: 552, y: 381, mult: 0.55 },
  { x: 544, y: 412, mult: 0.55 },
  { x: 598, y: 415, mult: 0.55 },
  { x: 648, y: 412, mult: 0.55 },
];
