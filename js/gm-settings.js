/**
 * Tenebrowse - General Manager Settings
 * Page-specific settings logic only. Shared navigation, modals, and toasts live in app.js.
 */

document.addEventListener('DOMContentLoaded', () => {
            
            const settingsForm = document.getElementById('settingsForm');
            const confirmSaveBtn = document.getElementById('confirmSaveBtn');
            const confirmResetBtn = document.getElementById('confirmResetBtn');
            const themeToggle = document.getElementById('themeToggle');

            confirmSaveBtn.addEventListener('click', () => {
                const newPass = document.getElementById('newPassword').value;
                const confPass = document.getElementById('confirmPassword').value;

                if (newPass || confPass) {
                    if (newPass !== confPass) {
                        if(window.showToast) window.showToast('Validation Error', 'New passwords do not match. Please try again.', 'danger');
                        return;
                    }
                }

                if(window.showToast) window.showToast('Settings Saved', 'General Manager preferences and profile details updated successfully.', 'success');
                
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            });

            confirmResetBtn.addEventListener('click', () => {
                settingsForm.reset();
                
                document.getElementById('profileName').value = 'Marcus Vance';
                document.getElementById('profileEmail').value = 'm.vance@tenebrowse.com';
                document.getElementById('notifMaterialReq').checked = true;
                document.getElementById('notifPO').checked = true;
                document.getElementById('notifInventory').checked = true;
                document.getElementById('notifSystem').checked = true;
                document.getElementById('systemLang').value = 'en';
                
                if (themeToggle.checked) {
                    themeToggle.checked = false;
                    document.body.classList.remove('dark-theme');
                }

                if(window.showToast) window.showToast('Defaults Restored', 'All configuration settings have been reverted to system defaults.', 'info');
            });

            themeToggle.addEventListener('change', (e) => {
                if(e.target.checked) {
                    if(window.showToast) window.showToast('Theme Updated', 'Dark mode enabled. Remember to save changes.', 'primary');
                }
            });

        });
