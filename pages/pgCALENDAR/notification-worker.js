// Service Worker для обработки уведомлений о днях рождения
const NOTIFICATION_DB = 'birthday_notifications';
const NOTIFICATION_STORE = 'scheduled_notifications';

// При активации Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker активирован');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Получение push уведомлений с сервера
self.addEventListener('push', (event) => {
  console.log('Push уведомление получено', event);
  
  if (!event.data) {
    console.log('Push данные пусты');
    return;
  }

  let notificationData = {};
  
  try {
    notificationData = event.data.json();
  } catch (error) {
    notificationData = {
      title: 'Уведомление',
      body: event.data.text()
    };
  }

  const options = {
    body: notificationData.body || '',
    icon: notificationData.icon || 'https://i.imgur.com/1sd499C.png',
    badge: notificationData.badge || 'https://i.imgur.com/1sd499C.png',
    tag: notificationData.tag || 'notification',
    requireInteraction: notificationData.requireInteraction || false,
    vibrate: [200, 100, 200],
    data: notificationData.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Слушатель для отправки уведомлений из главного потока
self.addEventListener('message', (event) => {
  if (event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
});

// Обработчик клика на уведомление
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Проверяем, есть ли уже открытое окно календаря
      for (let client of clientList) {
        if (client.url.includes('calendar')) {
          return client.focus();
        }
      }
      // Если нет, открываем новое
      if (clients.openWindow) {
        return clients.openWindow('/calendar.html');
      }
    })
  );
});

// Периодическая проверка уведомлений
async function checkAndSendNotifications() {
  try {
    const db = await openNotificationDB();
    const notifications = await getScheduledNotifications(db);
    const now = new Date();

    for (const notification of notifications) {
      const notifTime = new Date(notification.scheduledTime);
      
      // Отправляем уведомление, если время подошло
      if (notifTime <= now && !notification.sent) {
        await self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon,
          badge: 'https://i.imgur.com/1sd499C.png',
          tag: notification.tag,
          requireInteraction: false
        });

        // Отмечаем как отправленное
        await markNotificationAsSent(db, notification.id);
      }
    }

    db.close();
  } catch (error) {
    console.error('Ошибка при проверке уведомлений:', error);
  }
}

// Открытие IndexedDB
function openNotificationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(NOTIFICATION_DB, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(NOTIFICATION_STORE)) {
        const store = db.createObjectStore(NOTIFICATION_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('scheduledTime', 'scheduledTime', { unique: false });
        store.createIndex('sent', 'sent', { unique: false });
      }
    };
  });
}

// Получение всех запланированных уведомлений
function getScheduledNotifications(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([NOTIFICATION_STORE], 'readonly');
    const store = transaction.objectStore(NOTIFICATION_STORE);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Отмечаем уведомление как отправленное
function markNotificationAsSent(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([NOTIFICATION_STORE], 'readwrite');
    const store = transaction.objectStore(NOTIFICATION_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => {
      const notification = request.result;
      notification.sent = true;
      const updateRequest = store.put(notification);
      updateRequest.onerror = () => reject(updateRequest.error);
      updateRequest.onsuccess = () => resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

// Периодическая проверка каждые 30 секунд
setInterval(checkAndSendNotifications, 30000);
