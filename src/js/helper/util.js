export function getAsset(name) {
  return `./assets/${name}`;
}

export function getAssetImg(name) {
  return getAsset(`${name}.png`);
}
