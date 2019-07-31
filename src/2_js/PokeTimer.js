export class PokeTimer {
  constructor(time) {
    this.domTimer = document.querySelector(".timer");
    this.time = time;
    this.gameOverOverlay = document.querySelector("[data-overlay=gameOver]");
    this.beginTick = null;
  }
  start() {
    this.timeStart(this.time);
  }

  reset() {
    clearInterval(this.beginTick);
    this.domTimer.textContent = String(this.time);
  }

  timeStart(time) {
    let timeLeft = time;
    this.beginTick = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft < 0) {
        clearInterval(this.beginTick);
        this.gameOverOverlay.style.setProperty("display", "flex");
        return;
      }
      this.domTimer.textContent = String(timeLeft);
    }, 1000);
  }
}
