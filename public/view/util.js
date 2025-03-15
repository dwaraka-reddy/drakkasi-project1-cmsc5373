// Show the loading spinner
export function startSpinner() {
  const spinner = document.getElementById("spinnerOverlay");
  if (spinner) {
    spinner.classList.replace("d-none", "d-flex");
  } else {
    console.error(
      "Spinner element not found. Check if element with ID 'spinnerOverlay' exists in HTML."
    );
  }
}

// Hide the loading spinner
export function stopSpinner() {
  const spinner = document.getElementById("spinnerOverlay");
  if (spinner) {
    spinner.classList.replace("d-flex", "d-none");
  } else {
    console.error(
      "Spinner element not found. Check if element with ID 'spinnerOverlay' exists in HTML."
    );
  }
}

// Format date as MM/DD/YYYY
export function formatDate(date) {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

// Format time as HH:MM:SS AM/PM
export function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString();
}

// Format currency
export function formatCurrency(amount) {
  return "$" + parseFloat(amount).toFixed(2);
}
