 const currentYearEl = document.getElementById('currentYear');
    const lastModifiedEl = document.getElementById('lastModified');

    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    if (lastModifiedEl) lastModifiedEl.textContent = `Last Modified: ${document.lastModified}`;