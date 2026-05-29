// Примеры тестирования API с curl или Postman

// ==================== 1. ПОЛУЧИТЬ VAPID КЛЮЧ ====================
GET http://localhost:3000/api/vapid-public-key

// Response:
// {
//   "publicKey": "BKx..."
// }

// ==================== 2. ПОДПИСАТЬ ПОЛЬЗОВАТЕЛЯ ====================
POST http://localhost:3000/api/subscribe
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "expirationTime": null,
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}

// Response:
// {
//   "success": true,
//   "message": "Подписка успешно добавлена",
//   "totalSubscriptions": 1
// }

// ==================== 3. ОТПРАВИТЬ ТЕСТОВОЕ УВЕДОМЛЕНИЕ ====================
POST http://localhost:3000/api/send-test
Content-Type: application/json

// Response:
// {
//   "success": true,
//   "message": "Уведомление отправлено 1 пользователям",
//   "sent": 1,
//   "failed": 0
// }

// ==================== 4. ОТПРАВИТЬ УВЕДОМЛЕНИЕ О ДНЕЙ РОЖДЕНИЯ ====================
POST http://localhost:3000/api/send-birthday
Content-Type: application/json

{
  "name": "Иван",
  "days": 7,
  "time": "15:00"
}

// Параметры:
// - name: имя человека (строка)
// - days: дни до дня рождения (число: 7, 2, 1, 0)
// - time: время отправки (строка: "00:00", "15:00")

// Response:
// {
//   "success": true,
//   "message": "Уведомление отправлено 1 пользователям",
//   "sent": 1,
//   "failed": 0
// }

// ==================== 5. ПОЛУЧИТЬ СТАТИСТИКУ ====================
GET http://localhost:3000/api/stats

// Response:
// {
//   "totalSubscriptions": 1,
//   "subscriptions": [
//     {
//       "endpoint": "https://fcm.googleapis.com/fcm/send/...",
//       "auth": "12345..."
//     }
//   ]
// }

// ==================== 6. ПРОВЕРИТЬ ЗДОРОВЬЕ ====================
GET http://localhost:3000/api/health

// Response:
// {
//   "status": "OK",
//   "timestamp": "2024-05-30T10:30:00.000Z",
//   "subscriptions": 1
// }

// ==================== ПРИМЕРЫ CURL ====================

// Получить VAPID ключ
curl http://localhost:3000/api/vapid-public-key

// Отправить тестовое уведомление
curl -X POST http://localhost:3000/api/send-test

// Отправить уведомление о дне рождения
curl -X POST http://localhost:3000/api/send-birthday \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван","days":7,"time":"15:00"}'

// Получить статистику
curl http://localhost:3000/api/stats

// ==================== ПРИМЕРЫ JAVASCRIPT ====================

// Отправить тестовое уведомление
async function sendTest() {
  const response = await fetch('http://localhost:3000/api/send-test', {
    method: 'POST'
  });
  const data = await response.json();
  console.log(data);
}

// Отправить уведомление о дне рождения
async function sendBirthday(name, days, time) {
  const response = await fetch('http://localhost:3000/api/send-birthday', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, days, time })
  });
  const data = await response.json();
  console.log(data);
}

// Использование:
sendBirthday('Иван', 7, '15:00');

// ==================== РАСПИСАНИЕ АВТОМАТИЧЕСКИХ УВЕДОМЛЕНИЙ ====================

// Сервер автоматически отправляет уведомления в:
// - За 7 дней: 15:00
// - За 2 дня: 15:00
// - За 1 день: 15:00
// - День рождения: 00:00
// - День рождения: 15:00

// Это настраивается в server.js функции sendBirthdayNotifications()
