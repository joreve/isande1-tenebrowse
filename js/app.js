/**
 * Tenebrowse - Core JS Functions
 * Connect. Complete. Construct.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initDropdowns();
    initModals();
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

// Expose toast function for demo buttons
window.showToast = showToast;