import config from "./config";
import Phaser from "phaser";

export enum assets {
  BACKDROP = "backdrop",
  SOUNDTRACK = "soundtrack",
}

export const textStyle = {
  fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
  color: "green",
};

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