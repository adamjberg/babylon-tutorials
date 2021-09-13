import Scene from "./Scene";

window.addEventListener("DOMContentLoaded", () => {
  window.CANNON = require("cannon")

  let game = new Scene("renderCanvas");

  game.doRender();
});
