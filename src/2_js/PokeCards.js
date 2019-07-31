import { PokeTimer } from "./Poketimer";

export class PokeCards {
  constructor() {
    this.init();
    this.pokeTimer = new PokeTimer(100);
  }

  commence() {
    this.flips = 0;
    this.pokeTimer.reset();
    this.pokemonRequest();
    this.removeCardStatus();
    this.currentCardOnhand = [];
    this.matchCounter = 0;

  }

  init() {
    this.currentCardOnhand = [];
    this.matchCounter = 0;
    this.cards = Array.prototype.slice.call(
      document.querySelectorAll(".poke-board-card")
    );
    this.cardFrontContent = Array.prototype.slice.call(
      document.querySelectorAll(".poke-board-card-content-front")
    );
    this.domFlipper = document.querySelector(".flipper");
    this.flips = 0;
    this.canFlip = this.canFlip.bind(this);
    this.updateFlip = this.updateFlip.bind(this);
    this.addClickEvent = this.addClickEvent.bind(this);
    this.removeClickEvent = this.removeClickEvent.bind(this);
    this.cardLoading = document.querySelector('.overlayCardFetch');
    this.gameWonOverlay = document.querySelector("[data-overlay=gameWon]");
    this.addClickEvent();
  }

  pokemonRequest() {

    this.cardLoading.style.setProperty('display','block');
    
    let randOffset = Math.floor(Math.random() * 500);
    let uri = `https://pokeapi.co/api/v2/pokemon-species/?limit=6&offset=${randOffset}`;
    let request = new Request(uri, {
      method: "GET",
      mode: "cors",
      cache: "default",
      headers: new Headers({
        "Content-type": "application/json"
      })
    });

    fetch(request)
      .then(resp => {
        return resp.json();
      })
      .then(resp => {
        //get initial request
        let partialPokemonList = resp.results.map(pokemon => {
          return pokemon.name;
        });

        //onto specific request
        let completedPokemonList = partialPokemonList.map(each => {
          return this.pokemonRequestSpecific(each);
        });

        //return request specific data
        Promise.all(completedPokemonList).then(resp => {
          return this.assignCards(resp);
        });
      })
      .catch(resp => {
        console.log(resp);
      });
  }

  pokemonRequestSpecific(name) {
    return new Promise(resolve => {
      let uri = `https://pokeapi.co/api/v2/pokemon/${name}/`;
      let request = new Request(uri, {
        method: "GET",
        mode: "cors",
        cache: "default",
        headers: new Headers({
          "Content-type": "application/json"
        })
      });
      fetch(request)
        .then(resp => {
          return resp.json();
        })
        .then(resp => {
          let data = {
            name: resp.name,
            sprite: resp.sprites.front_default
          };
          return resolve(data);
        })
        .catch(resp => {
          console.log(resp);
        });
    });
  }

  assignCards(pokelist) {
    const duplicated = [...pokelist, ...pokelist];
    let cardsCopy = [...this.cardFrontContent];

    for (let x = 0, len = duplicated.length; x < len; x++) {
      //randomize cards
      let rand = Math.floor(Math.random() * cardsCopy.length);
      let parent = cardsCopy[rand].parentElement;

      cardsCopy[rand].style.setProperty(
        "background-image",
        `url(${duplicated[x].sprite})`
      );
      cardsCopy[rand].setAttribute("data-pokename", `${duplicated[x].name}`);
      parent.setAttribute("data-pokename", `${duplicated[x].name}`);
      cardsCopy.splice(rand, 1);
    }

    this.cardLoading.style.setProperty('display','none');
    this.pokeTimer.start();

  }

  updateFlip() {
    this.flips++;
    this.domFlipper.textContent = String(this.flips);
  }

  canFlip(e) {
    if (this.currentCardOnhand.length > 1) {
      return;
    }

    let card = e.currentTarget;
    if (!card.classList.contains("flipCard")) {
      this.removeClickEvent();
      card.classList.add("flipCard");
      this.updateFlip();

      this.currentCardOnhand.push(e.currentTarget);

      if (this.currentCardOnhand.length > 1) {
        this.checkCurrentFlips();
      }

      setTimeout(() => {
        this.addClickEvent();
      }, 800);
    }
  }

  checkCurrentFlips() {
    let first = this.currentCardOnhand[0];
    let second = this.currentCardOnhand[1];

    if (first.dataset.pokename === second.dataset.pokename) {
      //match
      this.currentCardOnhand.forEach(card => {
        card.classList.add("cardMatch");
      });
      this.matchCounter += 1;
      this.currentCardOnhand = [];
      this.gameWon();
    } else {
      setTimeout(() => {
        this.currentCardOnhand.forEach(card => {
          card.classList.remove("flipCard");
        });
        this.currentCardOnhand = [];
      }, 700);
    }
  }

  gameWon() {
    if (this.matchCounter == 6) {
      setTimeout(() => {
        this.gameWonOverlay.style.setProperty("display", "flex");
        this.pokeTimer.reset();
      }, 700);
    }
  }

  removeCardStatus() {
    this.cards.forEach(card => {
      card.className = "poke-board-card";
    });
  }

  addClickEvent() {
    this.cards.forEach(card => {
      card.addEventListener("click", this.canFlip);
    });
  }

  removeClickEvent() {
    this.cards.forEach(card => {
      card.removeEventListener("click", this.canFlip);
    });
  }
}
