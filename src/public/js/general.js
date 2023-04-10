/*
 * This script is used to handle the general functions of the site
 * It will run on every page
 */

// Initialize Bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Initialize time
const timeList = document.querySelectorAll('[data-time]');
timeList.forEach(time => {
    const format = time.getAttribute('data-time') || 'DD. MMM YYYY, HH:mm';

    time.innerHTML = moment(time.innerHTML).format(format);
});
