import { HomeModel } from "../model/HomeModel.js";
import { saveGameRecord } from "./firebase_firestore.js";
import { startSpinner, stopSpinner } from "../view/util.js";

// Create a global instance for persistence between views
export const glHomeModel = new HomeModel();

export class HomeController {
  // Instance members
  model = null;
  view = null;

  constructor() {
    this.model = glHomeModel;

    // Bind methods to maintain 'this' context
    this.onClickGenerateDataButton = this.onClickGenerateDataButton.bind(this);
    this.onOddEvenSelection = this.onOddEvenSelection.bind(this);
    this.onRangeSelection = this.onRangeSelection.bind(this);
    this.onOddEvenBetAmount = this.onOddEvenBetAmount.bind(this);
    this.onRangeBetAmount = this.onRangeBetAmount.bind(this);
    this.onShowKeyToggle = this.onShowKeyToggle.bind(this);
    this.onPlayGame = this.onPlayGame.bind(this);
    this.onNewGame = this.onNewGame.bind(this);
  }

  setView(view) {
    this.view = view;
  }

  // Original functionality (kept for backward compatibility)
  onClickGenerateDataButton() {
    //generate a random number between 1-100
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    this.model.addNumber(randomNumber);
    this.view.render();
  }

  // Dice game event handlers
  onOddEvenSelection(type) {
    this.model.setBetTypeOddEven(type);
    this.view.render();
  }

  onRangeSelection(range) {
    this.model.setRangeSelection(range);
    this.view.render();
  }

  // Updated to use separate bet amount methods
  onOddEvenBetAmount(amount) {
    this.model.onOddEvenBetAmount(amount);
    this.view.render();
  }

  onRangeBetAmount(amount) {
    this.model.onRangeBetAmount(amount);
    this.view.render();
  }

  onShowKeyToggle(show) {
    this.model.toggleShowKey(show);
    this.view.render();
  }

  async onPlayGame() {
    if (!this.model.isValidBet()) {
      return;
    }

    startSpinner();
    try {
      // Execute game logic
      const gameResult = this.model.playGame();

      // Save result to Firestore
      await saveGameRecord(gameResult);

      // Update view
      this.view.render();
    } catch (error) {
      console.error("Error playing game:", error);
      alert("Error playing game: " + error.message);
    } finally {
      stopSpinner();
    }
  }

  onNewGame() {
    this.model.newGame();
    this.view.render();
  }
}
