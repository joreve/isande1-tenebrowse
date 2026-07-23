/**
 * Tenebrowse - Warehouse Staff Settings Management
 */

document.addEventListener('DOMContentLoaded', () => {
    initSettingsPage();
});

function initSettingsPage() {
    const guidedAccessToggle = document.getElementById('guidedAccessToggle');
    const settingsForm = document.getElementById('settingsForm');
    const confirmSaveBtn = document.getElementById('confirmSaveBtn');
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    const themeToggle = document.getElementById('themeToggle');

    // 1. Initialize Guided Access Toggle State
    const isGuidedAccessEnabled = localStorage.getItem('tenebrowseWarehouseGuidedAccess') === 'true';
    if (guidedAccessToggle) {
        guidedAccessToggle.checked = isGuidedAccessEnabled;

        // Immediate toggle handler and persistence
        guidedAccessToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            localStorage.setItem('tenebrowseWarehouseGuidedAccess', enabled ? 'true' : 'false');

            if (enabled) {
                document.body.classList.add('guided-access-enabled');
                if (typeof window.showToast === 'function') {
                    window.showToast('Guided Access', 'Guided Access has been enabled.', 'success');
                }
            } else {
                document.body.classList.remove('guided-access-enabled');
                if (typeof window.showToast === 'function') {
                    window.showToast('Guided Access', 'Guided Access has been disabled.', 'info');
                }
            }
        });
    }

    // 2. Prevent default form submission
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    // 3. Confirm Save Action Modal Logic
    if (confirmSaveBtn) {
        confirmSaveBtn.addEventListener('click', () => {
            const currentPassword = document.getElementById('currentPassword');
            const newPassword = document.getElementById('newPassword');
            const confirmPassword = document.getElementById('confirmPassword');

            const newPassVal = newPassword ? newPassword.value : '';
            const confPassVal = confirmPassword ? confirmPassword.value : '';

            if (newPassVal || confPassVal) {
                if (newPassVal !== confPassVal) {
                    if (typeof window.showToast === 'function') {
                        window.showToast('Validation Error', 'New passwords do not match. Please try again.', 'danger');
                    }
                    return;
                }
            }

            if (typeof window.showToast === 'function') {
                window.showToast('Settings Saved', 'Your preferences and profile details have been successfully updated.', 'success');
            }

            if (currentPassword) currentPassword.value = '';
            if (newPassword) newPassword.value = '';
            if (confirmPassword) confirmPassword.value = '';
        });
    }

    // 4. Confirm Reset Action Modal Logic
    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', () => {
            if (settingsForm) {
                settingsForm.reset();
            }

            const profileName = document.getElementById('profileName');
            const profileEmail = document.getElementById('profileEmail');
            const notifApprovedRequests = document.getElementById('notifApprovedRequests');
            const notifDeliveries = document.getElementById('notifDeliveries');
            const notifInventoryUpdates = document.getElementById('notifInventoryUpdates');
            const notifStockTransfers = document.getElementById('notifStockTransfers');
            const notifLowStock = document.getElementById('notifLowStock');
            const notifDamagedMissing = document.getElementById('notifDamagedMissing');
            const systemLang = document.getElementById('systemLang');

            if (profileName) profileName.value = 'Arnie Velasco';
            if (profileEmail) profileEmail.value = 'a.velasco@tenebrowse.com';
            if (notifApprovedRequests) notifApprovedRequests.checked = true;
            if (notifDeliveries) notifDeliveries.checked = true;
            if (notifInventoryUpdates) notifInventoryUpdates.checked = true;
            if (notifStockTransfers) notifStockTransfers.checked = true;
            if (notifLowStock) notifLowStock.checked = true;
            if (notifDamagedMissing) notifDamagedMissing.checked = true;
            if (systemLang) systemLang.value = 'en';

            // Reset Guided Access setting to default (disabled)
            if (guidedAccessToggle) {
                guidedAccessToggle.checked = false;
            }
            localStorage.setItem('tenebrowseWarehouseGuidedAccess', 'false');
            document.body.classList.remove('guided-access-enabled');

            if (themeToggle && themeToggle.checked) {
                themeToggle.checked = false;
                document.body.classList.remove('dark-theme');
            }

            if (typeof window.showToast === 'function') {
                window.showToast('Defaults Restored', 'All settings have been reverted to system defaults.', 'info');
            }
        });
    }

    // 5. Theme Toggle Handler
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Theme Updated', 'Dark mode enabled. Remember to save changes.', 'primary');
                }
            }
        });
    }
}