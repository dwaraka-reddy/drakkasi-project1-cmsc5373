import { formatDate, formatTime, formatCurrency } from "../view/util.js";

export class PlayHistoryModel {
  records = [];
  loading = false;
  error = null;

  constructor() {}

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  updateRecords(records) {
    this.records = records;
  }

  hasRecords() {
    return this.records && this.records.length > 0;
  }

  clearRecords() {
    this.records = [];
  }

  getFormattedRecords() {
    const formattedRecords = [];

    this.records.forEach((record, index) => {
      // Format timestamp
      let formattedTimestamp = "N/A";
      if (record.timestamp) {
        // Firestore timestamps have a toDate() method
        const timestamp = record.timestamp.toDate
          ? record.timestamp.toDate()
          : new Date(record.timestamp);
        formattedTimestamp = `${formatDate(timestamp)} ${formatTime(
          timestamp
        )}`;
      }

      // Format bet information
      let bet = "";
      if (record.betType && record.betAmount) {
        bet = `${formatCurrency(record.betAmount)} on ${record.betType}`;
      }

      // Format win/loss information with amount
      let won = "";
      let winAmount = "";

      if (record.win) {
        won = "Win";
        // Calculate win amount based on bet type
        let multiplier = record.betType && record.betType.includes("-") ? 3 : 2;
        let amount = record.betAmount * multiplier - record.betAmount;
        winAmount = `Win $${amount}`;
      } else {
        won = "Loss";
        winAmount = `Loss $${record.betAmount}`;
      }

      // Format balance
      let balance = formatCurrency(record.balance);

      formattedRecords.push({
        index: this.records.length - index,
        bet: bet,
        won: won,
        winAmount: winAmount,
        balance: balance,
        formattedTimestamp: formattedTimestamp,
      });
    });

    return formattedRecords;
  }
}
