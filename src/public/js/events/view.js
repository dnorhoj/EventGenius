(() => {
    // Make share button copy the link to the clipboard or share it
    const shareBtn = document.getElementById('share-btn');

    let timeout;
    const originalContent = shareBtn.innerHTML;
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            shareBtn.textContent = 'Link copied!';

            window.clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                shareBtn.innerHTML = originalContent;
            }, 2000);
        }
    });

    // Make attending buttons respond with the right form data

    /** @type HTMLInputElement */
    const input = document.getElementById('resp-input');

    const respond = (value) => () => {
        input.value = value;
        input.form.submit();
    }

    // Add listeners
    document.getElementById('resp-yes').addEventListener('click', respond('going'));
    document.getElementById('resp-maybe').addEventListener('click', respond('maybe'));
    document.getElementById('resp-no').addEventListener('click', respond('not_going'));
})();