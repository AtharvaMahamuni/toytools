self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.includes('pomodoro-timer') && 'focus' in c) return c.focus();
      }
      var target = (event.notification.data && event.notification.data.url) || '/';
      return clients.openWindow(target);
    })
  );
});
