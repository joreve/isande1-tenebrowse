/**
 * Tenebrowse - Warehouse Staff Dashboard Logic
 * Guided Access Guidance & Priority Annotations
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboardGuidedAccess();
});

function initDashboardGuidedAccess() {
    const isGuidedAccess = localStorage.getItem('tenebrowseWarehouseGuidedAccess') === 'true' || 
                           document.body.classList.contains('guided-access-enabled');
    const isGuideDismissed = sessionStorage.getItem('tenebrowseDashboardGuideDismissed') === 'true';

    // 1. Guidance Panel Visibility and Session Dismissal
    const guidancePanel = document.getElementById('dashboardGuidancePanel');
    const dismissBtn = document.getElementById('dismissGuidanceBtn');

    if (guidancePanel) {
        if (isGuidedAccess && !isGuideDismissed) {
            guidancePanel.style.display = 'block';
        } else {
            guidancePanel.style.display = 'none';
        }
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            sessionStorage.setItem('tenebrowseDashboardGuideDismissed', 'true');
            if (guidancePanel) {
                guidancePanel.style.display = 'none';
            }
        });
    }

    // 2. Dashboard Priority Badges and Helper Labels
    const guidedElements = document.querySelectorAll('.guided-access-element');
    guidedElements.forEach(el => {
        if (el === guidancePanel) return; // Handled separately with session state above

        if (isGuidedAccess) {
            if (el.tagName === 'SPAN' && el.classList.contains('badge')) {
                el.style.display = 'inline-flex';
            } else {
                el.style.display = 'block';
            }
        } else {
            el.style.display = 'none';
        }
    });
}