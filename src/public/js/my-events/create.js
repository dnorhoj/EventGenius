(() => {
    /** @type {HTMLInputElement} */
    const noLocation = document.getElementById('noLocation');
    /** @type {HTMLTextAreaElement} */
    const location = document.getElementById('location');

    noLocation.addEventListener('change', () => {
        if (noLocation.checked) {
            location.classList.add('d-none');
        } else {
            location.classList.remove('d-none');
        }
    })

    // trigger change event to hide location input
    noLocation.dispatchEvent(new Event('change'));
})();