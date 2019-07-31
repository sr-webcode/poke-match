import { PokeCards } from "./PokeCards";

export class PokeMatch {
  constructor() {
    this.pokeCards = new PokeCards();
  }
  gameStart() {
    this.pokeCards.commence();
  }
}
