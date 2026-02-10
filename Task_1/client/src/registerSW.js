/**
 * Register service worker for PWA: offline support, installability, push notifications.
 */
export function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (typeof window.showUpdateNotification === 'function') {
                window.showUpdateNotification();
              } else {
                if (window.confirm('New content available. Reload?')) window.location.reload();
              }
            }
          });
        });
      })
      .catch(() => {});
  });
}

export function requestNotificationPermission() {
  if (!('Notification' in window) || Notification.permission !== 'default') return;
  Notification.requestPermission().catch(() => {});
}
