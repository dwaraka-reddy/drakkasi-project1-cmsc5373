import { AbstractView } from "./AbstractView.js";
import { currentUser, isGuestMode } from "../controller/firebase_auth.js";

export class ProfileView extends AbstractView {
  // Instance variables
  controller = null;
  parentElement = document.getElementById("spaRoot");
  rendered = false; // Track if we've already rendered content

  constructor(controller) {
    super();
    this.controller = controller;
  }

  async onMount() {
    if (!currentUser && !isGuestMode) {
      this.parentElement.innerHTML = "<h1>Access Denied</h1>";
      return;
    }
    console.log("ProfileView.onMount() called");
    this.rendered = false; // Reset on mount

    // Load game records on mount
    await this.controller.loadGameRecords();
  }

  async updateView() {
    console.log("ProfileView.updateView() called");

    // Create a clean wrapper for our content
    const viewWrapper = document.createElement("div");
    viewWrapper.id = "profileViewContent";

    try {
      // Create a simple template directly to avoid duplications
      viewWrapper.innerHTML = `
        <div class="container mt-3">
          <div class="row">
            <div class="col-md-10 offset-md-1">
              <h4 class="mb-3">Game Play History Records</h4>

              <!-- Clear History Button -->
              <button id="clearHistoryBtn" class="btn btn-sm btn-danger mb-3">
                Clear History
              </button>

              <!-- Records Table -->
              <table id="historyTable" class="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bet</th>
                    <th>Won</th>
                    <th>Balance</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody id="historyTableBody">
                  <!-- Records will be dynamically added here -->
                </tbody>
              </table>

              <!-- No Records Message -->
              <div id="noRecordsMsg" class="alert alert-danger text-center d-none">
                No gameplay history found!
              </div>
            </div>
          </div>
        </div>
      `;

      const model = this.controller.model;
      const historyTableBody = viewWrapper.querySelector("#historyTableBody");
      const noRecordsMsg = viewWrapper.querySelector("#noRecordsMsg");
      const historyTable = viewWrapper.querySelector("#historyTable");

      // Display loading state if applicable
      if (model.loading) {
        if (noRecordsMsg) {
          noRecordsMsg.textContent = "Loading records...";
          noRecordsMsg.classList.remove("d-none");
        }
        if (historyTable) {
          historyTable.classList.add("d-none");
        }
        return viewWrapper;
      }

      // Display error if applicable
      if (model.error) {
        if (noRecordsMsg) {
          noRecordsMsg.textContent = `Error: ${model.error}`;
          noRecordsMsg.classList.remove("d-none");
        }
        if (historyTable) {
          historyTable.classList.add("d-none");
        }
        return viewWrapper;
      }

      // Check if there are records to display
      if (!model.hasRecords()) {
        if (historyTable) {
          historyTable.classList.add("d-none");
        }
        if (noRecordsMsg) {
          noRecordsMsg.classList.remove("d-none");
          noRecordsMsg.textContent = "No gameplay history found!";
        }
        return viewWrapper;
      }

      // Display records
      if (historyTable) {
        historyTable.classList.remove("d-none");
      }
      if (noRecordsMsg) {
        noRecordsMsg.classList.add("d-none");
      }

      // Add records to table
      if (historyTableBody) {
        // Clear existing rows first
        historyTableBody.innerHTML = "";

        const records = model.getFormattedRecords();
        records.forEach((record) => {
          const row = document.createElement("tr");

          // Create table cells
          const indexCell = document.createElement("td");
          indexCell.textContent = record.index;

          const betCell = document.createElement("td");
          betCell.textContent = record.bet;

          const wonCell = document.createElement("td");
          // Show Win/Loss with amount
          wonCell.textContent = record.won;

          const balanceCell = document.createElement("td");
          balanceCell.textContent = record.balance;

          const timestampCell = document.createElement("td");
          timestampCell.textContent = record.formattedTimestamp;

          // Add cells to row
          row.appendChild(indexCell);
          row.appendChild(betCell);
          row.appendChild(wonCell);
          row.appendChild(balanceCell);
          row.appendChild(timestampCell);

          // Add row to table
          historyTableBody.appendChild(row);
        });
      }
    } catch (error) {
      console.error("Error loading template:", error);
      viewWrapper.innerHTML = `<div class="alert alert-danger">Error loading play history: ${error.message}</div>`;
    }

    return viewWrapper;
  }

  attachEvents() {
    console.log("Attaching events to ProfileView elements");
    // Clear History button
    const clearHistoryBtn =
      this.parentElement.querySelector("#clearHistoryBtn");
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", () => {
        this.controller.clearGameRecords();
      });
    } else {
      console.error("clearHistoryBtn not found");
    }
  }

  async onLeave() {
    if (!currentUser && !isGuestMode) {
      this.parentElement.innerHTML = "<h1>Access Denied</h1>";
      return;
    }
    console.log("ProfileView.onLeave() called");
    this.rendered = false;
  }
}
