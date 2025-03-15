import { AbstractView } from "./AbstractView.js";
import { currentUser } from "../controller/firebase_auth.js";

export class PlayHistoryView extends AbstractView {
  // Instance variables
  controller = null;

  constructor(controller) {
    super();
    this.controller = controller;
  }

  async onMount() {
    if (!currentUser) {
      this.parentElement.innerHTML = "<h1>Access Denied</h1>";
      return;
    }
    console.log("PlayHistoryView.onMount() called");

    // Load game records on mount
    await this.controller.loadGameRecords();
  }

  async updateView() {
    console.log("PlayHistoryView.updateView() called");
    const viewWrapper = document.createElement("div");

    // Load template
    const response = await fetch("/view/templates/playhistory.html", {
      cache: "no-store",
    });
    viewWrapper.innerHTML = await response.text();

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
      const records = model.getFormattedRecords();
      records.forEach((record) => {
        const row = document.createElement("tr");

        // Create table cells
        const indexCell = document.createElement("td");
        indexCell.textContent = record.index;

        const betCell = document.createElement("td");
        betCell.textContent = record.bet;

        const wonCell = document.createElement("td");
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

    return viewWrapper;
  }

  attachEvents() {
    // Clear History button
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", () => {
        this.controller.clearGameRecords();
      });
    }
  }

  async onLeave() {
    if (!currentUser) {
      this.parentElement.innerHTML = "<h1>Access Denied</h1>";
      return;
    }
    console.log("PlayHistoryView.onLeave() called");
  }
}
