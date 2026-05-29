# 🎂 PG78 Birthday Notifications - Полное руководство

## ✅ Что было создано

### Backend (Node.js + Express + Web Push)
- ✨ Express сервер на порту 3000
- 📧 Web Push API для отправки уведомлений
- 📅 Автоматическое расписание уведомлений
- 🔐 VAPID ключи для безопасности
- 📊 API endpoints для управления подписками

### Frontend интеграция
- 🔔 Service Worker для получения push
- 📲 Подписка на push от backend
- 🧪 Кнопка для тестирования
- 🎨 Красивые анимации

### Документация
- 📖 README.md - полное описание
- 🚀 DEPLOYMENT.md - инструкции по развертыванию
- 📡 API_EXAMPLES.md - примеры API запросов

---

## 🚀 Быстрый старт (Локально)

### 1. Установка

```bash
cd backend
npm install
```

### 2. Генерация VAPID ключей

```bash
npm run generate-keys
```

Это создаст файл `.env` с ключами.

### 3. Запуск сервера

```bash
npm run dev
```

Сервер будет доступен на `http://localhost:3000`

### 4. Обновить Frontend URL

Откройте `pages/pgCALENDAR/calendar_script.js` и найдите:

```javascript
const BACKEND_URL = 'http://localhost:3000'; // Или URL вашего сервера
```

### 5. Тестирование

1. Откройте `calendar.html` в браузере
2. Нажмите "🔔 Разрешить уведомления" → подтвердите
3. Нажмите "🧪 Тест уведомления" 
4. Должно приходить тестовое уведомление

---

## 🌍 Развертывание на VPS

### Быстро (DigitalOcean)

**Следуйте этим инструкциям:**
```
backend/DEPLOYMENT.md
```

**Примерные шаги:**
1. Создать Droplet ($5/месяц)
2. Установить Node.js
3. Клонировать репозиторий
4. `npm install && npm run generate-keys`
5. Запустить через PM2
6. Настроить Nginx + SSL
7. Обновить `BACKEND_URL` в frontend

**Результат:** Все уведомления будут работать даже при закрытом браузере! ✅

---

## 📡 API Endpoints

### Основные
- `GET /api/vapid-public-key` - получить публичный ключ
- `POST /api/subscribe` - подписать пользователя
- `POST /api/send-test` - отправить тестовое уведомление
- `POST /api/send-birthday` - отправить уведомление о дне рождения
- `GET /api/stats` - статистика подписок
- `GET /api/health` - проверка здоровья

**Полные примеры:** `backend/API_EXAMPLES.md`

---

## 🔔 Расписание уведомлений

Система автоматически отправляет:

| День | Время | Сообщение |
|------|-------|----------|
| За 7 дней | 15:00 | "За неделю до дня рождения X" |
| За 2 дня | 15:00 | "За два дня до дня рождения X" |
| За 1 день | 15:00 | "Завтра день рождения X! 🎉" |
| День рождения | 00:00 | "Сегодня день рождения X! 🎂" |
| День рождения | 15:00 | "Вечер! День рождения X продолжается! 🎊" |

---

## 📁 Структура проекта

```
backend/
├── server.js                 # Главный файл сервера
├── generate-keys.js          # Генератор VAPID ключей
├── package.json              # Зависимости
├── .env.example              # Пример конфигурации
├── .gitignore                # Исключения для Git
├── README.md                 # Документация
├── DEPLOYMENT.md             # Инструкции по развертыванию
└── API_EXAMPLES.md           # Примеры API запросов

frontend/
├── calendar.html
├── pages/pgCALENDAR/
│   ├── calendar_script.js    # (обновлен с backend интеграцией)
│   ├── calendar_styles.css
│   └── notification-worker.js # (обновлен для push)
```

---

## 🔐 Переменные окружения

**Создается автоматически через `npm run generate-keys`:**

```env
VAPID_PUBLIC_KEY=...        # Публичный ключ для frontend
VAPID_PRIVATE_KEY=...       # Приватный ключ (СЕКРЕТНЫЙ!)
VAPID_EMAIL=mailto:...      # Email для уведомлений

PORT=3000                   # Порт сервера
NODE_ENV=production         # Режим

FRONTEND_URL=...            # URL вашего frontend
```

⚠️ **НИКОГДА** не коммитьте `.env` в Git!

---

## 🎯 Преимущества решения

✅ Уведомления работают даже при закрытом браузере
✅ Надежное расписание (node-schedule)
✅ Масштабируемая архитектура
✅ Использует стандартные Web Push API
✅ Легко развернуть на VPS
✅ Бесплатно (если сами хостите)
✅ Поддержка всех современных браузеров

---

## 🐛 Решение проблем

### Проблема: Backend не запускается
```bash
# Проверить версию Node.js (нужна 14+)
node --version

# Переинсталлировать зависимости
rm -rf node_modules package-lock.json
npm install
```

### Проблема: Уведомления не приходят
1. Проверить логи: `npm run dev`
2. Убедиться что подписка отправилась: `curl http://localhost:3000/api/stats`
3. Проверить браузер поддерживает Push API (Chrome, Edge, Firefox, Opera)

### Проблема: CORS ошибка
Убедитесь что `FRONTEND_URL` в `.env` совпадает с адресом frontend

### Проблема: Ошибка SSL сертификата
Используйте Let's Encrypt для бесплатного сертификата (см. DEPLOYMENT.md)

---

## 📚 Дополнительные ресурсы

- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Node.js Schedule](https://www.npmjs.com/package/node-schedule)
- [Express.js](https://expressjs.com/)

---

## 🎉 Готово!

Система push-уведомлений полностью настроена!

**Следующие шаги:**
1. Протестировать локально
2. Развернуть на VPS (следуя DEPLOYMENT.md)
3. Обновить BACKEND_URL в frontend
4. Готово! 🚀

---

## 💡 Советы

- 📊 Регулярно проверяйте статистику: `curl http://localhost:3000/api/stats`
- 🔄 Обновляйте npm пакеты: `npm update`
- 📝 Логируйте все операции для отладки
- 🔐 Используйте сильные пароли и HTTPS
- ⏰ Тестируйте расписание перед production

---

**Автор:** GitHub Copilot
**Дата:** 30 Май 2026
**Версия:** 1.0.0
