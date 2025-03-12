export function startSpinner(){
    document.getElementById('spinnerOverlay').classList.remove('d-none');

}

export function stopSpinner(){
    document.getElementById('spinnerOverlay').classList.add('d-none');
}