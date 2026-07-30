/**
 * Tenebrowse - Core JS Functions
 * Connect. Complete. Construct.
 */

// Navigation Transition Helper
function transitionTo(url) {
    document.body.classList.add('page-exit');
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}
window.transitionTo = transitionTo;

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initDropdowns();
    initModals();
    initGuidedAccess();
    initNavigation();
    initLoginPage();
});

// ==========================================
// Sidebar Toggle (For Mobile/Tablet)
// ==========================================
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
}

// ==========================================
// Navigation Event Listener (Replaces inline onclick)
// ==========================================
function initNavigation() {
    document.addEventListener('click', (e) => {
        const navItem = e.target.closest('[data-url]');
        if (navItem) {
            e.preventDefault();
            const url = navItem.getAttribute('data-url');
            if (url) {
                transitionTo(url);
            }
        }
    });
}

// ==========================================
// Notification Dropdown
// ==========================================
function initDropdowns() {
    const notifBtn = document.getElementById('notifBtn');
    const notifMenu = document.getElementById('notifMenu');

    if (notifBtn && notifMenu) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            notifMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!notifMenu.contains(e.target)) {
                notifMenu.classList.remove('show');
            }
        });
    }
}

// ==========================================
// Confirmation Modal System
// ==========================================
function initModals() {
    const openModalBtns = document.querySelectorAll('[data-modal-target]');
    const closeBtns = document.querySelectorAll('[data-modal-close]');
    
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-modal-target');
            const modal = document.getElementById(targetId);
            if(modal) modal.classList.add('active');
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if(modal) modal.classList.remove('active');
        });
    });

    // Close on overlay click
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
}

// ==========================================
// Toast Notification System (Triggerable)
// ==========================================
function showToast(title, message, type = 'primary') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Create Toast Element
    const toast = document.createElement('div');
    toast.className = 'toast';
    // Adapt left border color based on type
    toast.style.borderLeftColor = `var(--color-${type})`;

    // Choose icon based on type
    let iconClass = 'fa-info-circle';
    if(type === 'success') iconClass = 'fa-check-circle';
    if(type === 'danger') iconClass = 'fa-exclamation-triangle';

    toast.innerHTML = `
        <div class="toast-icon" style="color: var(--color-${type})">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="title">${title}</div>
            <div class="message">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250); // wait for transition
    }, 3000);
}

// Expose toast function for app-wide use
window.showToast = showToast;

// ==========================================
// Guided Access Initialization Helper
// ==========================================
function initGuidedAccess() {
    const isGuidedAccess = localStorage.getItem('tenebrowseWarehouseGuidedAccess') === 'true';
    if (isGuidedAccess) {
        document.body.classList.add('guided-access-enabled');
    } else {
        document.body.classList.remove('guided-access-enabled');
    }
}
window.initGuidedAccess = initGuidedAccess;

// ==========================================
// Login Page Specific Logic
// ==========================================
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const passwordToggle = document.getElementById('passwordToggle');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    
    // Reusable Error Parsing Utilities
    const clearErrors = () => {
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
        document.querySelectorAll('.error-message').forEach(err => err.style.display = 'none');
    };

    // Interactive Password Visibility Engine Toggle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const typeAttribute = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', typeAttribute);
            
            // Icon Variant Management Sync
            const iconElement = passwordToggle.querySelector('i');
            if (typeAttribute === 'text') {
                iconElement.className = 'far fa-eye-slash';
            } else {
                iconElement.className = 'far fa-eye';
            }
        });
    }

    // Forgot Password Enterprise Notice Overide
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Enterprise Notice: Password restoration structures must be executed directly via internal Helpdesk systems.');
        });
    }

    // Client Validation Form Controller & Routing Logic
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            let clientFormIsValid = true;
            const usernameVal = usernameInput.value.trim();
            const passwordVal = passwordInput.value.trim();
            const roleVal = roleSelect.value;

            // Static Context Processing Validation Checks
            if (!usernameVal) {
                document.getElementById('usernameGroup').classList.add('has-error');
                document.getElementById('usernameError').style.display = 'block';
                clientFormIsValid = false;
            }

            if (!passwordVal) {
                document.getElementById('passwordGroup').classList.add('has-error');
                document.getElementById('passwordError').style.display = 'block';
                clientFormIsValid = false;
            }

            if (!roleVal) {
                document.getElementById('roleGroup').classList.add('has-error');
                document.getElementById('roleError').style.display = 'block';
                clientFormIsValid = false;
            }

            // Execution Branch Path Forward Redirect Mapping Strategy
            if (clientFormIsValid) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Validation Verified', 'Authorization criteria processed successfully. Mounting internal desktop application metrics...', 'success');
                }
                
                // Route mapping based on the selected persona role
                let targetDashboard = '';
              switch (roleVal) {
                  case 'pic':
                    targetDashboard = 'pic-dashboard.html';
                    break;

                  case 'gm':
                    targetDashboard = 'gm-dashboard.html';
                    break;

                  case 'po':
                    targetDashboard = 'po-dashboard.html';
                    break;

                  case 'ws':
                    targetDashboard = 'ws-dashboard.html';
                    break;

                  case 'ac':
                    targetDashboard = 'ac-dashboard.html';
                    break;

                  case 'admin':
                    targetDashboard = 'admin-dashboard.html';
                    break;

                  default:
                    targetDashboard = 'index.html';
            }

                // Execute page transition exit effect before routing to the defined dashboard
                setTimeout(() => {
                    transitionTo(targetDashboard);
                }, 500);
            } else {
                if (typeof window.showToast === 'function') {
                    window.showToast('Authentication Interrupted', 'Please resolve highlighted configuration compliance inputs.', 'danger');
                }
            }
        });
    }
}
