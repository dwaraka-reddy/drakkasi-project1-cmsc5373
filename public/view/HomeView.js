import { AbstractView } from "./AbstractView.js";
import { currentUser, isGuestMode } from "../controller/firebase_auth.js";

export class HomeView extends AbstractView {
  // Instance variables
  controller = null;
  parentElement = document.getElementById("spaRoot");

  constructor(controller) {
    super();
    this.controller = controller;
  }

  async onMount() {
    if (!currentUser && !isGuestMode) {
      this.parentElement.innerHTML = "<h1>Access Denied</h1>";
      return;
    }
    console.log("HomeView.onMount() called");
  }

  async updateView() {
    console.log("HomeView.updateView() called");
    const viewWrapper = document.createElement("div");

    try {
      // First, create a minimal template if fetching fails
      const fallbackTemplate = `
        <div class="container mt-3">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <!-- Balance and Dice Result -->
              <div class="mb-4">
                <h5>Balance: <span id="balance">$100</span></h5>
                <div class="dice-container my-3 text-center">
                  <div
                    class="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto"
                    style="width: 80px; height: 80px"
                  >
                    <h1 id="diceResult" class="display-5 mb-0">?</h1>
                  </div>
                </div>

                <!-- Show Key Checkbox -->
                <div class="mb-2">
                  <label class="form-label">Show Key: </label>
                  <input class="form-check-input" type="checkbox" id="showKey" />
                  <span id="gameKeyDisplay"></span>
                </div>
              </div>

              <!-- Game Result Message -->
              <div class="alert alert-light mb-3" id="resultMessage">
                Choose bet(s) and press [PLAY]
              </div>

              <!-- Betting Options -->
              <div class="mb-4">
                <div class="mb-3">
                  <label class="form-label">Bet on Odd/Even (2x winnings)</label>
                  <div class="d-flex align-items-center">
                    <div class="form-check me-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="oddEvenBet"
                        id="oddBet"
                        value="odd"
                      />
                      <label class="form-check-label bet-option" for="oddBet">odd</label>
                    </div>
                    <div class="form-check me-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="oddEvenBet"
                        id="evenBet"
                        value="even"
                      />
                      <label class="form-check-label bet-option" for="evenBet">even</label>
                    </div>
                    <select
                      id="oddEvenBetAmount"
                      class="form-select ms-auto"
                      style="width: auto"
                    >
                      <option value="" selected disabled>Select a bet amount</option>
                      <option value="10">$10</option>
                      <option value="20">$20</option>
                      <option value="30">$30</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Bet on Range (3x winnings)</label>
                  <div class="d-flex align-items-center">
                    <div class="form-check me-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="rangeBet"
                        id="range1"
                        value="1-2"
                      />
                      <label class="form-check-label bet-option" for="range1">1-2</label>
                    </div>
                    <div class="form-check me-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="rangeBet"
                        id="range2"
                        value="3-4"
                      />
                      <label class="form-check-label bet-option" for="range2">3-4</label>
                    </div>
                    <div class="form-check me-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="rangeBet"
                        id="range3"
                        value="5-6"
                      />
                      <label class="form-check-label bet-option" for="range3">5-6</label>
                    </div>
                    <select
                      id="rangeBetAmount"
                      class="form-select ms-auto"
                      style="width: auto"
                    >
                      <option value="" selected disabled>Select a bet amount</option>
                      <option value="10">$10</option>
                      <option value="20">$20</option>
                      <option value="30">$30</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex">
                <button id="playButton" class="btn btn-primary me-2" disabled>
                  Play
                </button>
                <button id="newGameButton" class="btn btn-danger">New Game</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Try to load the template from the server, fall back to embedded template if fails
      let templateText;
      try {
        console.log("Attempting to fetch template...");
        const response = await fetch("view/templates/home.html", {
          cache: "no-store",
        });

        if (!response.ok) {
          console.log("First fetch attempt failed, trying alternate path...");
          const altResponse = await fetch("view/templates/dicegame.html", {
            cache: "no-store",
          });

          if (!altResponse.ok) {
            console.log("Both fetch attempts failed, using fallback template");
            templateText = fallbackTemplate;
          } else {
            templateText = await altResponse.text();
          }
        } else {
          templateText = await response.text();
        }
      } catch (e) {
        console.log("Error fetching template, using fallback:", e);
        templateText = fallbackTemplate;
      }

      console.log(
        "Template loaded. First 50 chars:",
        templateText.substring(0, 50) + "..."
      );
      viewWrapper.innerHTML = templateText;

      // Debug: log the IDs of all elements in the template
      console.log("Elements in template:");
      const elements = viewWrapper.querySelectorAll("[id]");
      elements.forEach((el) => console.log(`Found element with ID: ${el.id}`));

      // Get current game state
      const model = this.controller.model;

      // Update balance
      const balanceElement = viewWrapper.querySelector("#balance");
      if (balanceElement) {
        balanceElement.textContent = `$${model.balance}`;
      } else {
        console.error("Balance element not found in template");
      }

      // Update dice result
      const diceResultElement = viewWrapper.querySelector("#diceResult");
      if (diceResultElement) {
        if (model.diceResult) {
          diceResultElement.textContent = model.showKey
            ? model.diceResult
            : "?";
        } else {
          diceResultElement.textContent = "?";
        }
      } else {
        console.error("Dice result element not found in template");
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
    } catch (error) {
      console.error("Error in updateView:", error);
      viewWrapper.innerHTML = `<div class="alert alert-danger">Error loading game: ${error.message}</div>`;
    }

    return viewWrapper;
  }

  updateButtonStates(viewWrapper) {
    const model = this.controller.model;
    const playButton = viewWrapper.querySelector("#playButton");
    const newGameButton = viewWrapper.querySelector("#newGameButton");

    // Enable Play button only if valid bet and not in progress
    if (playButton) {
      playButton.disabled = !model.isValidBet() || model.gameInProgress;
    } else {
      console.error("Play button not found in template");
    }

    // New Game button is always enabled
    if (newGameButton) {
      newGameButton.disabled = false;
    }
  }

  attachEvents() {
    console.log("Attaching events to HomeView elements");

    // Store a reference to the view's HTML for debugging
    const viewHTML = this.parentElement.innerHTML;
    console.log("Parent element content length:", viewHTML.length);

    // Debug: Find all interactive elements in the DOM
    const allInputs = this.parentElement.querySelectorAll(
      "input, button, select"
    );
    console.log(`Found ${allInputs.length} interactive elements:`);
    allInputs.forEach((element) => {
      console.log(`- ${element.tagName} with ID: ${element.id || "no-id"}`);
    });

    // Use this.parentElement to find elements (more reliable)
    const oddRadio = this.parentElement.querySelector("#oddBet");
    const evenRadio = this.parentElement.querySelector("#evenBet");

    if (oddRadio) {
      console.log("Found oddBet, attaching event");
      oddRadio.addEventListener("change", () => {
        this.controller.onOddEvenSelection("odd");
      });
    } else {
      console.warn("oddBet element not found, will retry");
      // Add a small delay to try again - DOM might not be fully updated
      setTimeout(() => {
        const retryOddRadio = this.parentElement.querySelector("#oddBet");
        if (retryOddRadio) {
          console.log("Found oddBet on retry, attaching event");
          retryOddRadio.addEventListener("change", () => {
            this.controller.onOddEvenSelection("odd");
          });
        } else {
          console.error("oddBet element still not found after retry");
          // A more extreme approach - inject the missing elements
          this.injectMissingElements();
        }
      }, 300); // Longer timeout
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

  // Fallback method to inject missing elements if needed
  injectMissingElements() {
    console.log("Injecting missing elements as a fallback");
    if (!this.parentElement.querySelector("#oddBet")) {
      const bettingSection = document.createElement("div");
      bettingSection.innerHTML = `
        <div class="mb-3">
          <label class="form-label">Bet on Odd/Even (2x winnings)</label>
          <div class="d-flex align-items-center">
            <div class="form-check me-3">
              <input
                class="form-check-input"
                type="radio"
                name="oddEvenBet"
                id="oddBet"
                value="odd"
              />
              <label class="form-check-label bet-option" for="oddBet">odd</label>
            </div>
            <div class="form-check me-3">
              <input
                class="form-check-input"
                type="radio"
                name="oddEvenBet"
                id="evenBet"
                value="even"
              />
              <label class="form-check-label bet-option" for="evenBet">even</label>
            </div>
            <select
              id="oddEvenBetAmount"
              class="form-select ms-auto"
              style="width: auto"
            >
              <option value="" selected disabled>Select a bet amount</option>
              <option value="10">$10</option>
              <option value="20">$20</option>
              <option value="30">$30</option>
            </select>
          </div>
        </div>
      `;

      this.parentElement.appendChild(bettingSection);

      // Try to attach events again
      setTimeout(() => {
        const oddRadio = this.parentElement.querySelector("#oddBet");
        if (oddRadio) {
          oddRadio.addEventListener("change", () => {
            this.controller.onOddEvenSelection("odd");
          });
          console.log("Successfully attached event to injected oddBet element");
        }
      }, 100);
    }
  }

  async onLeave() {
    if (!currentUser && !isGuestMode) {
      this.parentElement.innerHTML = "<h1>Access Denied</h1>";
      return;
    }
    console.log("HomeView.onLeave() called");
  }
}
