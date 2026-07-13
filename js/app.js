/* ==========================================================================
   TENEBROWSE — APP.JS
   Vanilla JavaScript module powering every reusable component.
   No frameworks, no dependencies. Organized as small, self-contained
   modules under a single Tenebrowse namespace so future pages can call
   Tenebrowse.Toast.show(...) etc. without polluting the global scope.
   --------------------------------------------------------------------------
   Table of Contents
   1.  Namespace bootstrap
   2.  Sidebar module        (collapse + mobile drawer)
   3.  Active nav detection
   4.  Dropdown module        (notification bell, user menu, generic)
   5.  Modal module           (confirmation modal)
   6.  Toast module           (transient notifications)
   7.  Misc UI helpers        (ripple-free button feedback, demo bindings)
   8.  Init on DOMContentLoaded
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. NAMESPACE BOOTSTRAP
     Everything the app exposes publicly lives on window.Tenebrowse so
     future pages (dashboard.html, material-requests.html, ...) can reuse
     these components without re-implementing them.
     ------------------------------------------------------------------ */
  const Tenebrowse = window.Tenebrowse || {};

  /* ------------------------------------------------------------------
     2. SIDEBAR MODULE
     Handles two independent responsibilities:
       a) Desktop collapse -> icon-only rail (persisted in localStorage)
       b) Mobile off-canvas drawer open/close + backdrop
     ------------------------------------------------------------------ */
  const Sidebar = (function () {
    const STORAGE_KEY = 'tenebrowse.sidebarCollapsed';
    let shellEl, overlayEl;

    function init() {
      shellEl = document.querySelector('.app-shell');
      overlayEl = document.querySelector('.sidebar-overlay');
      if (!shellEl) return;

      // Restore persisted collapsed state (desktop only)
      const isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
      if (isCollapsed) shellEl.classList.add('sidebar-collapsed');

      // Desktop collapse toggle
      const collapseBtn = document.querySelector('.sidebar__collapse-btn');
      if (collapseBtn) {
        collapseBtn.addEventListener('click', toggleCollapse);
      }

      // Mobile hamburger toggle
      const mobileToggle = document.querySelector('.topbar__mobile-toggle');
      if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileDrawer);
      }

      // Clicking the scrim closes the mobile drawer
      if (overlayEl) {
        overlayEl.addEventListener('click', closeMobileDrawer);
      }

      // Escape key closes mobile drawer
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileDrawer();
      });
    }

    function toggleCollapse() {
      const collapsed = shellEl.classList.toggle('sidebar-collapsed');
      localStorage.setItem(STORAGE_KEY, collapsed);
    }

    function toggleMobileDrawer() {
      const isOpen = shellEl.classList.toggle('sidebar-mobile-open');
      if (overlayEl) overlayEl.classList.toggle('is-visible', isOpen);
    }

    function closeMobileDrawer() {
      shellEl.classList.remove('sidebar-mobile-open');
      if (overlayEl) overlayEl.classList.remove('is-visible');
    }

    return { init, toggleCollapse, toggleMobileDrawer, closeMobileDrawer };
  })();

  /* ------------------------------------------------------------------
     3. ACTIVE NAV DETECTION
     Compares each sidebar link's href against the current page's
     filename and applies the `.is-active` state automatically, so
     every page can share one sidebar markup partial without manually
     flagging the active link.
     ------------------------------------------------------------------ */
  function markActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar__link[href]').forEach((link) => {
      const linkPage = link.getAttribute('href').split('/').pop();
      link.classList.toggle('is-active', linkPage === currentPage);
    });
  }

  /* ------------------------------------------------------------------
     4. DROPDOWN MODULE
     Generic open/close/outside-click behavior for any element pair:
     a trigger button (data-dropdown-trigger) and a panel
     (data-dropdown-panel) sharing the same value, e.g.:

       <button data-dropdown-trigger="notifications">...</button>
       <div class="dropdown__panel" data-dropdown-panel="notifications">...</div>
     ------------------------------------------------------------------ */
  const Dropdown = (function () {
    let openPanel = null;

    function init() {
      document.querySelectorAll('[data-dropdown-trigger]').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const key = trigger.getAttribute('data-dropdown-trigger');
          const panel = document.querySelector(`[data-dropdown-panel="${key}"]`);
          if (!panel) return;
          togglePanel(panel);
        });
      });

      // Clicking anywhere else closes the open dropdown
      document.addEventListener('click', (e) => {
        if (openPanel && !openPanel.contains(e.target)) {
          closeAll();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
      });
    }

    function togglePanel(panel) {
      if (panel === openPanel) {
        closeAll();
        return;
      }
      closeAll();
      panel.classList.add('is-open');
      openPanel = panel;
    }

    function closeAll() {
      document.querySelectorAll('.dropdown__panel.is-open').forEach((p) => p.classList.remove('is-open'));
      openPanel = null;
    }

    return { init, closeAll };
  })();

  /* ------------------------------------------------------------------
     5. MODAL MODULE
     Generic confirmation modal. Markup lives once in the page (or is
     injected — see index.html for the reusable partial), and callers
     configure it at call-time:

       Tenebrowse.Modal.confirm({
         title: 'Delete material request?',
         message: 'This action cannot be undone.',
         icon: 'danger',              // 'danger' | 'warning' | 'success'
         confirmLabel: 'Delete',
         confirmVariant: 'btn--danger',
         onConfirm: () => { ... }
       });
     ------------------------------------------------------------------ */
  const Modal = (function () {
    let backdropEl, iconEl, titleEl, messageEl, confirmBtn, cancelBtn, closeBtn;
    let confirmCallback = null;

    function init() {
      backdropEl = document.querySelector('#confirmationModal');
      if (!backdropEl) return;

      iconEl = backdropEl.querySelector('.modal__icon');
      titleEl = backdropEl.querySelector('.modal__title');
      messageEl = backdropEl.querySelector('.modal__message');
      confirmBtn = backdropEl.querySelector('.modal__confirm-btn');
      cancelBtn = backdropEl.querySelector('.modal__cancel-btn');
      closeBtn = backdropEl.querySelector('.modal__close');

      [cancelBtn, closeBtn].forEach((btn) => btn && btn.addEventListener('click', close));

      // Click on the backdrop itself (not the modal card) closes it
      backdropEl.addEventListener('click', (e) => {
        if (e.target === backdropEl) close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdropEl.classList.contains('is-open')) close();
      });

      confirmBtn.addEventListener('click', () => {
        if (typeof confirmCallback === 'function') confirmCallback();
        close();
      });
    }

    function confirm(options) {
      if (!backdropEl) return;
      const {
        title = 'Are you sure?',
        message = 'Please confirm this action.',
        icon = 'warning',
        iconClass = 'fa-solid fa-triangle-exclamation',
        confirmLabel = 'Confirm',
        confirmVariant = 'btn--primary',
        onConfirm = null,
      } = options || {};

      titleEl.textContent = title;
      messageEl.textContent = message;
      iconEl.className = `modal__icon modal__icon--${icon}`;
      iconEl.innerHTML = `<i class="${iconClass}"></i>`;

      confirmBtn.textContent = confirmLabel;
      confirmBtn.className = `btn ${confirmVariant} modal__confirm-btn`;

      confirmCallback = onConfirm;
      open();
    }

    function open() {
      backdropEl.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      backdropEl.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    return { init, confirm, open, close };
  })();

  /* ------------------------------------------------------------------
     6. TOAST MODULE
     Stacks transient notifications bottom-right. Auto-dismisses after
     `duration` ms (default 4000) and supports manual close.

       Tenebrowse.Toast.show({
         type: 'success',              // 'success' | 'danger' | 'warning' | 'info'
         title: 'Request submitted',
         message: 'Purchase order #1042 was sent for approval.',
         duration: 4000
       });
     ------------------------------------------------------------------ */
  const Toast = (function () {
    let containerEl;

    const ICONS = {
      success: 'fa-solid fa-circle-check',
      danger: 'fa-solid fa-circle-exclamation',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info',
    };

    function init() {
      containerEl = document.querySelector('.toast-container');
      if (!containerEl) {
        containerEl = document.createElement('div');
        containerEl.className = 'toast-container';
        document.body.appendChild(containerEl);
      }
    }

    function show(options) {
      const {
        type = 'info',
        title = '',
        message = '',
        duration = 4000,
      } = options || {};

      const toastEl = document.createElement('div');
      toastEl.className = `toast toast--${type}`;
      toastEl.setAttribute('role', 'status');
      toastEl.innerHTML = `
        <i class="toast__icon ${ICONS[type] || ICONS.info}"></i>
        <div class="toast__body">
          ${title ? `<div class="toast__title">${escapeHtml(title)}</div>` : ''}
          ${message ? `<div class="toast__message">${escapeHtml(message)}</div>` : ''}
        </div>
        <button class="toast__close" aria-label="Dismiss notification">
          <i class="fa-solid fa-xmark"></i>
        </button>
      `;

      containerEl.appendChild(toastEl);

      const remove = () => dismiss(toastEl);
      toastEl.querySelector('.toast__close').addEventListener('click', remove);

      if (duration > 0) {
        setTimeout(remove, duration);
      }

      return toastEl;
    }

    function dismiss(toastEl) {
      if (!toastEl || toastEl.classList.contains('is-leaving')) return;
      toastEl.classList.add('is-leaving');
      toastEl.addEventListener('animationend', () => toastEl.remove(), { once: true });
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    return { init, show };
  })();

  /* ------------------------------------------------------------------
     7. MISC UI HELPERS
     Small conveniences used by the component showcase / demo bindings.
     Kept separate from the reusable modules above so future pages don't
     inherit demo-only behavior.
     ------------------------------------------------------------------ */
  function initDemoBindings() {
    // "Mark all as read" clears unread styling in the notification list
    const markAllBtn = document.querySelector('[data-action="mark-all-read"]');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.notification-item.is-unread').forEach((item) => {
          item.classList.remove('is-unread');
        });
        const dot = document.querySelector('.icon-btn__dot');
        if (dot) dot.remove();
      });
    }

    // Wires up any element with data-toast-* attributes to fire a demo toast
    document.querySelectorAll('[data-toast-type]').forEach((el) => {
      el.addEventListener('click', () => {
        Toast.show({
          type: el.getAttribute('data-toast-type'),
          title: el.getAttribute('data-toast-title') || 'Notification',
          message: el.getAttribute('data-toast-message') || '',
        });
      });
    });

    // Wires up any element with data-modal-demo to open the confirmation
    // modal with sample content, illustrating the Modal.confirm() API.
    document.querySelectorAll('[data-modal-demo]').forEach((el) => {
      el.addEventListener('click', () => {
        Modal.confirm({
          title: el.getAttribute('data-modal-title') || 'Confirm action',
          message: el.getAttribute('data-modal-message') || 'Are you sure you want to proceed?',
          icon: el.getAttribute('data-modal-icon') || 'warning',
          iconClass: el.getAttribute('data-modal-icon-class') || 'fa-solid fa-triangle-exclamation',
          confirmLabel: el.getAttribute('data-modal-confirm-label') || 'Confirm',
          confirmVariant: el.getAttribute('data-modal-confirm-variant') || 'btn--primary',
          onConfirm: () => {
            Toast.show({ type: 'success', title: 'Done', message: 'Action confirmed.' });
          },
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     8. INIT
     ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    Sidebar.init();
    markActiveNavLink();
    Dropdown.init();
    Modal.init();
    Toast.init();
    initDemoBindings();
  });

  // Public API
  Tenebrowse.Sidebar = Sidebar;
  Tenebrowse.Dropdown = Dropdown;
  Tenebrowse.Modal = Modal;
  Tenebrowse.Toast = Toast;
  window.Tenebrowse = Tenebrowse;
})();