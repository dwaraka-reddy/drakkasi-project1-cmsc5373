import { GameModel } from "../model/GameModel.js";
import { saveGameRecord } from "./firebase_firestore.js";
import { startSpinner, stopSpinner } from "../view/util.js";

// Create a global instance for persistence between views
export const glGameModel = new GameModel();

export class DiceGameController {
  // Instance members
  model = null;
  view = null;

  constructor() {
    this.model = glGameModel;

    // Bind methods to maintain 'this' context
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

  // Event handlers
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
