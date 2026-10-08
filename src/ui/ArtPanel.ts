import Phaser from 'phaser';

export type ArtFrame = 0 | 1 | 2 | 3 | 4 | 5 | 'ash' | 'mina';

/** Fits one square atlas frame into a rectangular crop without distorting it. */
export function addArtPanel(
  scene: Phaser.Scene,
  frame: ArtFrame,
  x: number,
  y: number,
  width: number,
  height: number,
  focusX = 0.5,
  focusY = 0.5,
  textureKey = 'chapter0-art'
) {
  return addTexturePanel(scene, textureKey, x, y, width, height, focusX, focusY, frame);
}

export function addTexturePanel(
  scene: Phaser.Scene,
  textureKey: string,
  x: number,
  y: number,
  width: number,
  height: number,
  focusX = 0.5,
  focusY = 0.5,
  frame: string | number = 0
) {
  const textureFrame = scene.textures.get(textureKey).get(frame);
  const sourceWidth = textureFrame.width;
  const sourceHeight = textureFrame.height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const displayWidth = sourceWidth * scale;
  const displayHeight = sourceHeight * scale;
  const image = scene.add.image(x, y, textureKey, frame).setScale(scale);
  image.setPosition(
    x + (0.5 - Phaser.Math.Clamp(focusX, 0, 1)) * (displayWidth - width),
    y + (0.5 - Phaser.Math.Clamp(focusY, 0, 1)) * (displayHeight - height)
  );
  const shape = scene.add.graphics().setVisible(false);
  shape.fillStyle(0xffffff).fillRect(x - width / 2, y - height / 2, width, height);
  image.setMask(shape.createGeometryMask());
  return image;
}

export function addArtShade(scene: Phaser.Scene, x: number, y: number, width: number, height: number, alpha = 0.24) {
  return scene.add.rectangle(x, y, width, height, 0x0c0a08, alpha);
}
