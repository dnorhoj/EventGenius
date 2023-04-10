(() => {
    /** @type {HTMLInputElement} */
    const noLocation = document.getElementById('noLocation');
    /** @type {HTMLTextAreaElement} */
    const location = document.getElementById('location');

    noLocation.addEventListener('change', () => {
        if (noLocation.checked) {
            location.classList.add('d-none');
            location.required = false;
        } else {
            location.classList.remove('d-none');
            location.required = true;
        }
    })

    // trigger change event to hide location input if noLocation is checked
    noLocation.dispatchEvent(new Event('change'));

    // Initialize datetime picker
    const date = document.getElementById('date');
    if (date.getAttribute('value')) {
        date.value = moment(date.getAttribute('value')).format('YYYY-MM-DDTHH:mm');
    }
})();