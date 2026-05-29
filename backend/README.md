# 🎂 Birthday Notifications Backend

Backend сервер для системы push-уведомлений о днях рождения PG78.

## 📋 Требования

- **Node.js** версия 14+ 
- **npm** или **yarn**
- **VPS/сервер** для production (DigitalOcean, Linode, AWS и т.д.)

## 🚀 Быстрый старт (Локально)

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Генерация VAPID ключей

```bash
npm run generate-keys
```

Это создаст файл `.env` с VAPID ключами. **Важно:** файл `.env` НЕ должен коммититься в Git.

### 3. Запуск сервера

**Разработка (с автоперезагрузкой):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Сервер запустится на `http://localhost:3000`

## 🔧 Конфигурация

Отредактируйте файл `.env`:

```env
# Web Push VAPID Keys
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_EMAIL=mailto:admin@pg78calendar.com

# Server
PORT=3000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=http://localhost:3000
# Для production: FRONTEND_URL=https://yourdomain.com
```

## 📡 API Endpoints

### 1. **GET `/api/vapid-public-key`**
Получить публичный VAPID ключ для frontend

```bash
curl http://localhost:3000/api/vapid-public-key
```

### 2. **POST `/api/subscribe`**
Подписать пользователя на push уведомления

```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{...subscription_object...}'
```

### 3. **POST `/api/unsubscribe`**
Отписать пользователя

```bash
curl -X POST http://localhost:3000/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"..."}'
```

### 4. **POST `/api/send-test`**
Отправить тестовое уведомление всем подписанным

```bash
curl -X POST http://localhost:3000/api/send-test
```

### 5. **POST `/api/send-birthday`**
Отправить уведомление о дне рождения

```bash
curl -X POST http://localhost:3000/api/send-birthday \
  -H "Content-Type: application/json" \
  -d '{"name":"Иван","days":7,"time":"15:00"}'
```

### 6. **GET `/api/stats`**
Получить статистику подписок

```bash
curl http://localhost:3000/api/stats
```

### 7. **GET `/api/health`**
Проверить здоровье сервера

```bash
curl http://localhost:3000/api/health
```

## 🌍 Развертывание на VPS

### DigitalOcean (рекомендуется)

1. **Создать Droplet**
   - Выберите Ubuntu 22.04 LTS
   - Минимум 512MB RAM ($5/месяц)

2. **Подключиться по SSH и установить Node.js**
```bash
ssh root@your_ip
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Клонировать репозиторий и установить**
```bash
git clone https://github.com/yourusername/PG78HUB-REBORN.git
cd PG78HUB-REBORN/backend
npm install
```

4. **Сгенерировать VAPID ключи**
```bash
npm run generate-keys
```

5. **Настроить PM2 для автозапуска**
```bash
sudo npm install -g pm2
pm2 start server.js --name "birthday-notifications"
pm2 startup
pm2 save
```

6. **Настроить Nginx как reverse proxy**
```bash
sudo apt-get install -y nginx
```

Создайте файл `/etc/nginx/sites-available/birthday`:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте:
```bash
sudo ln -s /etc/nginx/sites-available/birthday /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Получить SSL сертификат (Let's Encrypt)**
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

## 📝 Frontend интеграция

Обновите `BACKEND_URL` в `pages/pgCALENDAR/calendar_script.js`:

```javascript
const BACKEND_URL = 'https://your_domain.com'; // Вместо localhost:3000
```

## 🔐 Безопасность

- ❌ Никогда не коммитьте `.env` файл
- ✅ Используйте HTTPS в production
- ✅ Регулярно обновляйте зависимости: `npm update`
- ✅ Ограничивайте доступ по IP если возможно

## 🐛 Логирование

Логи сервера:
```bash
pm2 logs birthday-notifications
```

## 📚 Дополнительно

- [Web Push API документация](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Node Schedule](https://www.npmjs.com/package/node-schedule)

## 💬 Поддержка

Если возникли проблемы, проверьте:
1. Запущен ли Node.js сервер
2. Правильный ли `BACKEND_URL` в frontend
3. CORS настройки совпадают с адресом frontend
4. Браузер поддерживает Push API (не все браузеры поддерживают)
