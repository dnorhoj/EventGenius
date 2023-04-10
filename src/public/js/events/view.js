(() => {
    // Make buttons respond with the right form data

    /** @type HTMLInputElement */
    const input = document.getElementById('resp-input');

    const respond = (value) => () => {
        input.value = value;
        input.form.submit();
    }

    // Add listeners
    document.getElementById('resp-yes').addEventListener('click', respond('yes'));
    document.getElementById('resp-maybe').addEventListener('click', respond('maybe'));
    document.getElementById('resp-no').addEventListener('click', respond('no'));
})();