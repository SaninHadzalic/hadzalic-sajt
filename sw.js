// Service Worker for Push Notifications
var CACHE_NAME = 'hadzalic-v1';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : {};
  var title = data.title || 'Hadzalic Coding';
  var options = {
    body: data.body || 'Nova obavijest!',
    icon: 'https://res.cloudinary.com/dgsgohodv/image/upload/w_192,h_192,c_fill/v1772801234/Hadzalic_Coding-01_gfzvxw.jpg',
    badge: 'https://res.cloudinary.com/dgsgohodv/image/upload/w_72,h_72,c_fill/v1772801234/Hadzalic_Coding-01_gfzvxw.jpg',
    data: { url: data.url || 'https://hadzalic.co' },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : 'https://hadzalic.co';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url === url && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
