(() => {
    const upload = document.querySelector('#pfp');

    upload.addEventListener('change', function() {
        // Submit the form when the file is selected
        this.form.submit();
    });
})();