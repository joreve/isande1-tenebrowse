/**
 * Tenebrowse - Purchasing Officer Settings
 * Page-specific settings logic only. Shared navigation, modals, and toasts live in app.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    const settingsForm = document.getElementById('settingsForm');
    const confirmSaveBtn = document.getElementById('confirmSaveBtn');
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    const themeToggle = document.getElementById('themeToggle');

    // Save Settings Event Handler
    if (confirmSaveBtn) {
        confirmSaveBtn.addEventListener('click', () => {
            const newPass = document.getElementById('newPassword')?.value;
            const confPass = document.getElementById('confirmPassword')?.value;

            if (newPass || confPass) {
                if (newPass !== confPass) {
                    if (window.showToast) {
                        window.showToast('Validation Error', 'New passwords do not match. Please try again.', 'danger');
                    }
                    return;
                }
            }

            if (window.showToast) {
                window.showToast('Settings Saved', 'Purchasing Officer preferences and profile details updated successfully.', 'success');
            }
            
            // Clear password fields after save
            if (document.getElementById('currentPassword')) document.getElementById('currentPassword').value = '';
            if (document.getElementById('newPassword')) document.getElementById('newPassword').value = '';
            if (document.getElementById('confirmPassword')) document.getElementById('confirmPassword').value = '';
        });
    }

    // Reset Defaults Event Handler
    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', () => {
            if (settingsForm) settingsForm.reset();
            
            // Reset to Purchasing Officer Defaults (Jess Tolentino)
            if (document.getElementById('profileName')) document.getElementById('profileName').value = 'Jess Tolentino';
            if (document.getElementById('profileEmail')) document.getElementById('profileEmail').value = 'j.tolentino@tenebrowse.com';
            
            // Purchasing Officer Toggles
            if (document.getElementById('notifRequisitions')) document.getElementById('notifRequisitions').checked = true;
            if (document.getElementById('notifLowStock')) document.getElementById('notifLowStock').checked = true;
            if (document.getElementById('notifPO')) document.getElementById('notifPO').checked = true;
            if (document.getElementById('notifSystem')) document.getElementById('notifSystem').checked = true;
            
            // Language Dropdown
            if (document.getElementById('systemLang')) document.getElementById('systemLang').value = 'en';
            
            // Dark Theme Switcher Reset
            if (themeToggle && themeToggle.checked) {
                themeToggle.checked = false;
                document.body.classList.remove('dark-theme');
            }

            if (window.showToast) {
                window.showToast('Defaults Restored', 'All configuration settings have been reverted to system defaults.', 'info');
            }
        });
    }

    // Dynamic Theme Toggle Event Handler
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-theme');
                if (window.showToast) {
                    window.showToast('Theme Updated', 'Dark mode enabled. Remember to save changes.', 'primary');
                }
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    }

});
