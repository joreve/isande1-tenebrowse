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
    initWarehouseGuidedModalLayout();
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
// Navigation Event Listener
// ==========================================
function initNavigation() {
    document.addEventListener('click', (e) => {
        const navItem = e.target.closest('[data-url]');
        if (navItem) {
            const url = navItem.getAttribute('data-url');
            if (url && url !== '#' && !url.startsWith('javascript:')) {
                e.preventDefault();
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
            e.stopPropagation();
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
// Warehouse Guided Access + Modal Layout
// ==========================================
function syncWarehouseGuidedModalLayout() {
    const body = document.body;

    if (!body || !body.classList.contains('warehouse-staff-page')) {
        return;
    }

    const guide = document.querySelector('.guided-helper-card');
    const activeModal = document.querySelector(
        '.modal-overlay.active:not(.modal-parent-suspended), ' +
        '.modal-overlay.modal-closing:not(.modal-parent-suspended)'
    );

    const guideIsVisible = Boolean(
        guide &&
        body.classList.contains('guided-access-enabled') &&
        !guide.classList.contains('hidden')
    );

    const shouldReserveGuideSpace = Boolean(activeModal && guideIsVisible);
    const shouldAutoCollapseGuide = shouldReserveGuideSpace && window.innerWidth <= 1240;

    body.classList.toggle('warehouse-guide-modal-layout', shouldReserveGuideSpace);

    if (guide) {
        guide.classList.toggle('modal-auto-collapsed', shouldAutoCollapseGuide);
    }
}

function initWarehouseGuidedModalLayout() {
    const body = document.body;
    if (!body || !body.classList.contains('warehouse-staff-page')) return;

    const guide = document.querySelector('.guided-helper-card');

    if (guide) {
        new MutationObserver(syncWarehouseGuidedModalLayout).observe(guide, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    window.addEventListener('resize', syncWarehouseGuidedModalLayout);
    syncWarehouseGuidedModalLayout();
}

window.syncWarehouseGuidedModalLayout = syncWarehouseGuidedModalLayout;

// ==========================================
// Reusable Confirmation Modal & Scroll Lock System
// ==========================================
function updateBodyScrollLock() {
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    if (activeModals.length > 0) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
    } else {
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
    }

    syncWarehouseGuidedModalLayout();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        updateBodyScrollLock();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const isWarehouseGuidedLayout = Boolean(
        document.body.classList.contains('warehouse-staff-page') &&
        document.body.classList.contains('warehouse-guide-modal-layout') &&
        modal.classList.contains('active')
    );

    if (isWarehouseGuidedLayout) {
        // Preserve the guide-reserved modal position while the overlay fades out.
        // Without this, the modal briefly jumps back to the center before disappearing.
        modal.classList.add('modal-closing');
        modal.classList.remove('active');
        updateBodyScrollLock();

        window.setTimeout(() => {
            modal.classList.remove('modal-closing');
            syncWarehouseGuidedModalLayout();
        }, 280);
        return;
    }

    modal.classList.remove('active');
    updateBodyScrollLock();
}

window.openModal = openModal;
window.closeModal = closeModal;

function initModals() {
    // Event delegation for opening modals via data attributes
    document.addEventListener('click', (e) => {
        const triggerBtn = e.target.closest('[data-modal-target]');
        if (triggerBtn) {
            const targetId = triggerBtn.getAttribute('data-modal-target');
            openModal(targetId);
        }

        // Event delegation for closing modals via data attributes
        const closeBtn = e.target.closest('[data-modal-close]');
        if (closeBtn) {
            const modal = closeBtn.closest('.modal-overlay');
            if (modal && modal.id) {
                closeModal(modal.id);
            }
        }

        // Backdrop click handler
        if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
            closeModal(e.target.id);
        }
    });

    // Escape key closes topmost modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModals = Array.from(document.querySelectorAll('.modal-overlay.active'));
            if (activeModals.length > 0) {
                const topmostModal = activeModals[activeModals.length - 1];
                if (topmostModal.id) {
                    closeModal(topmostModal.id);
                }
            }
        }
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
    toast.style.borderLeftColor = `var(--color-${type})`;

    // Choose icon based on type
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'danger') iconClass = 'fa-exclamation-triangle';

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
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

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

    const clearErrors = () => {
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
        document.querySelectorAll('.error-message').forEach(err => err.style.display = 'none');
    };

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const typeAttribute = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', typeAttribute);

            const iconElement = passwordToggle.querySelector('i');
            if (typeAttribute === 'text') {
                iconElement.className = 'far fa-eye-slash';
            } else {
                iconElement.className = 'far fa-eye';
            }
        });
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Enterprise Notice: Password restoration structures must be executed directly via internal Helpdesk systems.');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            let clientFormIsValid = true;
            const usernameVal = usernameInput.value.trim();
            const passwordVal = passwordInput.value.trim();
            const roleVal = roleSelect.value;

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

            if (clientFormIsValid) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Validation Verified', 'Authorization criteria processed successfully. Mounting internal desktop application metrics...', 'success');
                }

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