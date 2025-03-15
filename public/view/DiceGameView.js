import { AbstractView } from "./AbstractView.js";
import { currentUser, isGuestMode } from "../controller/firebase_auth.js";

export class DiceGameView extends AbstractView {
  // Instance variables
  controller = null;

  constructor(controller) {
    super();
    this.controller = controller;
  }

  async onMount() {
    if (!currentUser && !isGuestMode) {
      this.parentElement.innerHTML = "<h1>Access Denied</h1>";
      return;
    }
    console.log("DiceGameView.onMount() called");
  }

  async updateView() {
    console.log("DiceGameView.updateView() called");
    const viewWrapper = document.createElement("div");

    // Load template
    const response = await fetch("/view/templates/dicegame.html", {
      cache: "no-store",
    });
    viewWrapper.innerHTML = await response.text();

    // Get current game state
    const model = this.controller.model;

    // Update balance
    const balanceElement = viewWrapper.querySelector("#balance");
    if (balanceElement) {
      balanceElement.textContent = `$${model.balance}`;
    }

    // Update dice result
    const diceResultElement = viewWrapper.querySelector("#diceResult");
    if (diceResultElement) {
      if (model.diceResult) {
        diceResultElement.textContent = model.showKey ? model.diceResult : "?";
      } else {
        diceResultElement.textContent = "?";
      }
    }

    // Update game key display
    const gameKeyDisplay = viewWrapper.querySelector("#gameKeyDisplay");
    if (gameKeyDisplay) {
      if (model.showKey && model.gameKey) {
        gameKeyDisplay.textContent = ` Game Key: ${model.gameKey}`;
      } else {
        gameKeyDisplay.textContent = "";
      }
    }

    // Update result message
    const resultMessageElement = viewWrapper.querySelector("#resultMessage");
    if (resultMessageElement && model.message) {
      resultMessageElement.innerHTML = model.message;
    }

    // Update Show Key checkbox
    const showKeyCheckbox = viewWrapper.querySelector("#showKey");
    if (showKeyCheckbox) {
      showKeyCheckbox.checked = model.showKey;
    }

    // Update odd/even selection
    const oddRadio = viewWrapper.querySelector("#oddBet");
    const evenRadio = viewWrapper.querySelector("#evenBet");
    if (oddRadio && evenRadio) {
      oddRadio.checked = model.betType === "odd";
      evenRadio.checked = model.betType === "even";
    }

    // Update range selection
    const range1Radio = viewWrapper.querySelector("#range1");
    const range2Radio = viewWrapper.querySelector("#range2");
    const range3Radio = viewWrapper.querySelector("#range3");
    if (range1Radio && range2Radio && range3Radio) {
      range1Radio.checked = model.rangeSelection === "1-2";
      range2Radio.checked = model.rangeSelection === "3-4";
      range3Radio.checked = model.rangeSelection === "5-6";
    }

    // Update bet amount selectors - use separate amounts for each type
    const oddEvenSelect = viewWrapper.querySelector("#oddEvenBetAmount");
    const rangeSelect = viewWrapper.querySelector("#rangeBetAmount");

    if (oddEvenSelect && model.oddEvenBetAmount) {
      oddEvenSelect.value = model.oddEvenBetAmount;
    }

    if (rangeSelect && model.rangeBetAmount) {
      rangeSelect.value = model.rangeBetAmount;
    }

    // Enable/disable buttons based on game state
    this.updateButtonStates(viewWrapper);

    return viewWrapper;
  }

  updateButtonStates(viewWrapper) {
    const model = this.controller.model;
    const playButton = viewWrapper.querySelector("#playButton");
    const newGameButton = viewWrapper.querySelector("#newGameButton");

    // Enable Play button only if valid bet and not in progress
    if (playButton) {
      playButton.disabled = !model.isValidBet() || model.gameInProgress;
    }

    // New Game button is always enabled
    if (newGameButton) {
      newGameButton.disabled = false;
    }
  }

  attachEvents() {
    // Use the parentElement to find elements
    const oddRadio = this.parentElement.querySelector("#oddBet");
    const evenRadio = this.parentElement.querySelector("#evenBet");

    if (oddRadio) {
      oddRadio.addEventListener("change", () => {
        this.controller.onOddEvenSelection("odd");
      });
    } else {
      console.warn("oddBet element not found, will retry");
      // Add a small delay to try again - DOM might not be fully updated
      setTimeout(() => {
        const retryOddRadio = this.parentElement.querySelector("#oddBet");
        if (retryOddRadio) {
          retryOddRadio.addEventListener("change", () => {
            this.controller.onOddEvenSelection("odd");
          });
        } else {
          console.error("oddBet element still not found after retry");
        }
      }, 100);
    }

    if (evenRadio) {
      evenRadio.addEventListener("change", () => {
        this.controller.onOddEvenSelection("even");
      });
    }

    // Range selection
    const range1Radio = this.parentElement.querySelector("#range1");
    const range2Radio = this.parentElement.querySelector("#range2");
    const range3Radio = this.parentElement.querySelector("#range3");
    if (range1Radio) {
      range1Radio.addEventListener("change", () => {
        this.controller.onRangeSelection("1-2");
      });
    }
    if (range2Radio) {
      range2Radio.addEventListener("change", () => {
        this.controller.onRangeSelection("3-4");
      });
    }
    if (range3Radio) {
      range3Radio.addEventListener("change", () => {
        this.controller.onRangeSelection("5-6");
      });
    }

    // Bet amount selection - separate handlers for each type
    const oddEvenSelect = this.parentElement.querySelector("#oddEvenBetAmount");
    const rangeSelect = this.parentElement.querySelector("#rangeBetAmount");
    if (oddEvenSelect) {
      oddEvenSelect.addEventListener("change", (e) => {
        this.controller.onOddEvenBetAmount(e.target.value);
      });
    }
    if (rangeSelect) {
      rangeSelect.addEventListener("change", (e) => {
        this.controller.onRangeBetAmount(e.target.value);
      });
    }

    // Show Key checkbox
    const showKeyCheckbox = this.parentElement.querySelector("#showKey");
    if (showKeyCheckbox) {
      showKeyCheckbox.addEventListener("change", (e) => {
        this.controller.onShowKeyToggle(e.target.checked);
      });
    }

    // Play button
    const playButton = this.parentElement.querySelector("#playButton");
    if (playButton) {
      playButton.addEventListener("click", () => {
        this.controller.onPlayGame();
      });
    }

    // New Game button
    const newGameButton = this.parentElement.querySelector("#newGameButton");
    if (newGameButton) {
      newGameButton.addEventListener("click", () => {
        this.controller.onNewGame();
      });
    }
  }

  async onLeave() {
    if (!currentUser && !isGuestMode) {
      this.parentElement.innerHTML = "<h1>Access Denied</h1>";
      return;
    }
    console.log("DiceGameView.onLeave() called");
  }
}
