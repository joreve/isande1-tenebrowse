/**
 * Accountant Dashboard Page Logic
 * Handles push notifications panel toggle and dashboard interactions.
 */
document.addEventListener('DOMContentLoaded', () => {
  const notifBtn = document.getElementById('notif-toggle-btn');
  const notifPanel = document.getElementById('notif-panel');

  if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      notifPanel.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
      if (!notifPanel.contains(event.target) && event.target !== notifBtn) {
        notifPanel.classList.add('hidden');
      }
    });
  }
});
