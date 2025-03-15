import { PlayHistoryModel } from "../model/PlayHistoryModel.js";
import { getGameRecords, clearGameRecords } from "./firebase_firestore.js";
import { startSpinner, stopSpinner } from "../view/util.js";

export class PlayHistoryController {
  // Instance members
  model = null;
  view = null;

  constructor() {
    this.model = new PlayHistoryModel();

    // Bind methods to maintain 'this' context
    this.loadGameRecords = this.loadGameRecords.bind(this);
    this.clearGameRecords = this.clearGameRecords.bind(this);
  }

  setView(view) {
    this.view = view;
  }

  async loadGameRecords() {
    // Set loading state
    this.model.setLoading(true);
    this.model.setError(null);
    if (this.view) this.view.render();

    startSpinner();
    try {
      // Fetch records from Firestore
      const records = await getGameRecords();

      // Update model with records
      this.model.updateRecords(records);

      // Update view
      if (this.view) this.view.render();
    } catch (error) {
      console.error("Error loading game records:", error);
      this.model.setError(error.message);
      if (this.view) this.view.render();
    } finally {
      this.model.setLoading(false);
      stopSpinner();
    }
  }

  async clearGameRecords() {
    if (!confirm("Are you sure you want to clear all game history?")) {
      return;
    }

    startSpinner();
    try {
      // Clear records from Firestore
      await clearGameRecords();

      // Clear local model
      this.model.clearRecords();

      // Update view
      if (this.view) this.view.render();
    } catch (error) {
      console.error("Error clearing game records:", error);
      alert("Error clearing game records: " + error.message);
    } finally {
      stopSpinner();
    }
  }
}
