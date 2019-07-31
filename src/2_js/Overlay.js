import { PokeMatch } from "./MixMatch";

export default class Overlay {
  constructor() {
    this.overLays = Array.prototype.slice.call(
      document.querySelectorAll(".overlayGame")
    );
    this.pokeMatch = new PokeMatch();
  }
  init() {
    this.attachEvents();
  }

  gameStart(e) {
    e.currentTarget.style.setProperty("display", "none");
    this.pokeMatch.gameStart();
  }

  attachEvents() {
    this.overLays.forEach(overlay => {
      overlay.addEventListener("click", this.gameStart.bind(this));
    });
  }
}
