export class GameModel {
  // Instance variables
  balance = 100;
  betType = null;
  betAmount = null;
  oddEvenBetAmount = null;
  rangeBetAmount = null;
  rangeSelection = null;
  diceResult = null;
  message = "Choose bet(s) and press [PLAY]";
  showKey = false;
  gameKey = null;
  gameInProgress = false;

  constructor() {
    // Generate initial game key
    this.gameKey = this.generateGameKey();
  }

  // Generate a random game key (1-6)
  generateGameKey() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Set bet type for odd/even - should NOT clear range selection
  setBetTypeOddEven(type) {
    this.betType = type;
    // Don't clear range selection anymore
    // this.rangeSelection = null;
  }

  // Set bet range selection - should NOT clear odd/even
  setRangeSelection(range) {
    this.rangeSelection = range;
    // Don't clear betType anymore
    // this.betType = null;
  }

  // Set bet amount separately for each type
  setBetAmount(amount) {
    amount = parseInt(amount);
    if (this.betType) {
      this.oddEvenBetAmount = amount;
    }
    if (this.rangeSelection) {
      this.rangeBetAmount = amount;
    }
  }

  // Separate bet amount handlers
  onOddEvenBetAmount(amount) {
    this.oddEvenBetAmount = parseInt(amount);
  }

  onRangeBetAmount(amount) {
    this.rangeBetAmount = parseInt(amount);
  }

  // Toggle show key - but don't modify the dice display
  toggleShowKey(show) {
    this.showKey = show;

    // Do NOT force the dice result to match the game key
    // if (show && !this.diceResult) {
    //   this.diceResult = this.gameKey;
    // }
  }

  // Check if at least one valid bet is selected
  isValidBet() {
    const hasOddEvenBet = this.betType && this.oddEvenBetAmount;
    const hasRangeBet = this.rangeSelection && this.rangeBetAmount;
    return hasOddEvenBet || hasRangeBet;
  }

  // Play game logic
  playGame() {
    this.gameInProgress = true;

    // Set dice result - always use the game key
    this.diceResult = this.gameKey;
    console.log("Dice roll result:", this.diceResult);

    let messages = [];
    const oldBalance = this.balance;

    // Process odd/even bet if selected
    if (this.betType && this.oddEvenBetAmount) {
      const isOdd = this.diceResult % 2 === 1;
      const win =
        (this.betType === "odd" && isOdd) ||
        (this.betType === "even" && !isOdd);

      if (win) {
        const winAmount = this.oddEvenBetAmount * 2 - this.oddEvenBetAmount;
        this.balance += winAmount;
        messages.push(
          `<div class="win-message">You won $${winAmount} on ${this.betType}</div>`
        );
      } else {
        this.balance -= this.oddEvenBetAmount;
        messages.push(`You lost $${this.oddEvenBetAmount} on ${this.betType}`);
      }
    }

    // Process range bet if selected
    if (this.rangeSelection && this.rangeBetAmount) {
      const inRange = (range, value) => {
        const [min, max] = range.split("-").map(Number);
        return value >= min && value <= max;
      };

      const win = inRange(this.rangeSelection, this.diceResult);

      if (win) {
        const winAmount = this.rangeBetAmount * 3 - this.rangeBetAmount;
        this.balance += winAmount;
        messages.push(
          `<div class="win-message">You won $${winAmount} on range${this.rangeSelection}</div>`
        );
      } else {
        this.balance -= this.rangeBetAmount;
        messages.push(
          `You lost $${this.rangeBetAmount} on range${this.rangeSelection}`
        );
      }
    }

    // Combine messages
    this.message = messages.join("<br>");

    // Return game result for recording (using the first bet for recording)
    let recordBetType = this.betType || this.rangeSelection;
    let recordBetAmount = this.betType
      ? this.oddEvenBetAmount
      : this.rangeBetAmount;
    let recordWin = messages.some((msg) => msg.includes("win-message"));

    return {
      betType: recordBetType,
      betAmount: recordBetAmount,
      diceResult: this.diceResult,
      win: recordWin,
      oldBalance: oldBalance,
      newBalance: this.balance,
    };
  }

  // Start new game
  newGame() {
    this.gameInProgress = false;
    this.message = "Choose bet(s) and press [PLAY]";
    this.diceResult = null;

    // Generate new game key (1-6)
    this.gameKey = this.generateGameKey();
  }

  // Reset everything
  reset() {
    this.balance = 100;
    this.betType = null;
    this.betAmount = null;
    this.oddEvenBetAmount = null;
    this.rangeBetAmount = null;
    this.rangeSelection = null;
    this.diceResult = null;
    this.message = "Choose bet(s) and press [PLAY]";
    this.showKey = false;
    this.gameKey = this.generateGameKey();
    this.gameInProgress = false;
  }
}
