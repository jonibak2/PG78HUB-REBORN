require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const schedule = require('node-schedule');
const path = require('path');

// Инициализация Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost', 'https://jonibak2.github.io'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка Web Push
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Хранилище подписок (в production используйте БД)
let subscriptions = [];

// ==================== API ENDPOINTS ====================

// 1. Получить публичный VAPID ключ
app.get('/api/vapid-public-key', (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY
  });
});

// 2. Подписать пользователя на push
app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;

  // Проверяем валидность подписки
  if (!subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }

  // Проверяем, не добавлена ли уже эта подписка
  const exists = subscriptions.some(sub => sub.endpoint === subscription.endpoint);
  
  if (!exists) {
    subscriptions.push(subscription);
    console.log(`✅ Новая подписка добавлена. Всего подписок: ${subscriptions.length}`);
  }

  res.status(201).json({
    success: true,
    message: 'Подписка успешно добавлена',
    totalSubscriptions: subscriptions.length
  });
});

// 3. Отписать пользователя от push
app.post('/api/unsubscribe', (req, res) => {
  const { endpoint } = req.body;

  subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint);
  console.log(`❌ Подписка удалена. Осталось подписок: ${subscriptions.length}`);

  res.status(200).json({
    success: true,
    message: 'Подписка удалена'
  });
});

// 4. Отправить тестовое уведомление всем подписанным
app.post('/api/send-test', async (req, res) => {
  if (subscriptions.length === 0) {
    return res.status(400).json({ error: 'Нет активных подписок' });
  }

  const notification = {
    title: '🧪 Тестовое уведомление PG78',
    body: 'Система уведомлений работает корректно! ✓',
    icon: 'https://i.imgur.com/1sd499C.png',
    badge: 'https://i.imgur.com/1sd499C.png',
    tag: 'test-notification',
    requireInteraction: false
  };

  let sent = 0;
  let failed = 0;

  // Отправляем всем подписчикам
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(notification));
      sent++;
    } catch (error) {
      failed++;
      console.error('Ошибка при отправке:', error.message);
      
      // Если подписка неактивна, удаляем её
      if (error.statusCode === 410) {
        subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
      }
    }
  }

  res.status(200).json({
    success: true,
    message: `Уведомление отправлено ${sent} пользователям`,
    sent,
    failed
  });
});

// 5. Отправить уведомление о дне рождения
app.post('/api/send-birthday', async (req, res) => {
  const { name, days, time } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Требуется имя' });
  }

  let message = '';
  if (days === 7) {
    message = `За неделю до дня рождения ${name}!`;
  } else if (days === 2) {
    message = `За два дня до дня рождения ${name}!`;
  } else if (days === 1) {
    message = `Завтра день рождения ${name}! 🎉`;
  } else if (days === 0) {
    message = time === '00:00' ? 
      `Сегодня день рождения ${name}! 🎂 Поздравляем! 🎉` : 
      `Вечер! День рождения ${name} продолжается! 🎊`;
  }

  const notification = {
    title: `🎂 ${name}`,
    body: message,
    icon: 'https://i.imgur.com/1sd499C.png',
    badge: 'https://i.imgur.com/1sd499C.png',
    tag: `birthday-${name}-${days}-${time}`,
    requireInteraction: false
  };

  let sent = 0;
  let failed = 0;

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(notification));
      sent++;
    } catch (error) {
      failed++;
      if (error.statusCode === 410) {
        subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
      }
    }
  }

  res.status(200).json({
    success: true,
    message: `Уведомление отправлено ${sent} пользователям`,
    sent,
    failed
  });
});

// 6. Получить статистику
app.get('/api/stats', (req, res) => {
  res.json({
    totalSubscriptions: subscriptions.length,
    subscriptions: subscriptions.map(sub => ({
      endpoint: sub.endpoint.substring(0, 50) + '...',
      auth: sub.keys?.auth?.substring(0, 10) + '...'
    }))
  });
});

// ==================== РАСПИСАНИЕ УВЕДОМЛЕНИЙ ====================

// Функция для отправки уведомлений по расписанию
async function sendBirthdayNotifications() {
  const now = new Date();
  const birthdays = [
    { name: "Эристorem", date: "2007-01-16" },
    { name: "Моринок", date: "2007-02-04" },
    { name: "Хома", date: "2009-03-23" },
    { name: "Моди", date: "2007-04-29" },
    { name: "Пашок", date: "2005-05-07" },
    { name: "Энд", date: "2007-05-28" },
    { name: "Аня", date: "2005-07-04" },
    { name: "Стасик", date: "2007-07-22" },
    { name: "Ника", date: "2007-08-18" },
    { name: "PG78", date: "2022-09-12" },
    { name: "Костя", date: "2006-09-26" },
    { name: "Ержан", date: "2006-10-19" },
    { name: "Драгоман", date: "2008-10-26" },
    { name: "Андрей", date: "2002-11-01" },
    { name: "Жанибек", date: "2006-11-12" },
    { name: "Настя", date: "2007-12-05" }
  ];

  birthdays.forEach(birthday => {
    const [year, month, day] = birthday.date.split('-');
    const bdayThisYear = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));

    // За 7 дней в 15:00
    const sevenDaysBefore = new Date(bdayThisYear);
    sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
    sevenDaysBefore.setHours(15, 0, 0, 0);
    schedule.scheduleJob(sevenDaysBefore, async () => {
      console.log(`📬 Отправка: За 7 дней до ${birthday.name}`);
      await sendNotification(birthday.name, 7, '15:00');
    });

    // За 2 дня в 15:00
    const twoDaysBefore = new Date(bdayThisYear);
    twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
    twoDaysBefore.setHours(15, 0, 0, 0);
    schedule.scheduleJob(twoDaysBefore, async () => {
      console.log(`📬 Отправка: За 2 дня до ${birthday.name}`);
      await sendNotification(birthday.name, 2, '15:00');
    });

    // За 1 день в 15:00
    const oneDayBefore = new Date(bdayThisYear);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    oneDayBefore.setHours(15, 0, 0, 0);
    schedule.scheduleJob(oneDayBefore, async () => {
      console.log(`📬 Отправка: За 1 день до ${birthday.name}`);
      await sendNotification(birthday.name, 1, '15:00');
    });

    // В день рождения в 00:00
    const birthdayMidnight = new Date(bdayThisYear);
    birthdayMidnight.setHours(0, 0, 0, 0);
    schedule.scheduleJob(birthdayMidnight, async () => {
      console.log(`🎂 Отправка: День рождения ${birthday.name} (00:00)`);
      await sendNotification(birthday.name, 0, '00:00');
    });

    // В день рождения в 15:00
    const birthdayAfternoon = new Date(bdayThisYear);
    birthdayAfternoon.setHours(15, 0, 0, 0);
    schedule.scheduleJob(birthdayAfternoon, async () => {
      console.log(`🎉 Отправка: День рождения ${birthday.name} (15:00)`);
      await sendNotification(birthday.name, 0, '15:00');
    });
  });
}

// Вспомогательная функция для отправки уведомления
async function sendNotification(name, days, time) {
  let message = '';
  if (days === 7) {
    message = `За неделю до дня рождения ${name}!`;
  } else if (days === 2) {
    message = `За два дня до дня рождения ${name}!`;
  } else if (days === 1) {
    message = `Завтра день рождения ${name}! 🎉`;
  } else if (days === 0) {
    message = time === '00:00' ? 
      `Сегодня день рождения ${name}! 🎂 Поздравляем! 🎉` : 
      `Вечер! День рождения ${name} продолжается! 🎊`;
  }

  const notification = {
    title: `🎂 ${name}`,
    body: message,
    icon: 'https://i.imgur.com/1sd499C.png',
    badge: 'https://i.imgur.com/1sd499C.png',
    tag: `birthday-${name}-${days}-${time}`,
    requireInteraction: false
  };

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(notification));
    } catch (error) {
      if (error.statusCode === 410) {
        subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
      }
    }
  }
}

// ==================== ЗАПУСК СЕРВЕРА ====================

// Инициализируем расписание при запуске
sendBirthdayNotifications();

// Здоровье сервера
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    subscriptions: subscriptions.length
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend запущен на порту ${PORT}`);
  console.log(`📍 API доступен по адресу http://localhost:${PORT}`);
  console.log(`\n📧 VAPID Email: ${process.env.VAPID_EMAIL}`);
  console.log(`🔑 Public Key готов для frontend\n`);
});
