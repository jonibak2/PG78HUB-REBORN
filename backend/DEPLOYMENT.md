# 🚀 Руководство по развертыванию

## Опция 1: DigitalOcean (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Создать Droplet

1. Перейти на [DigitalOcean](https://www.digitalocean.com/)
2. Нажать **Create** → **Droplets**
3. Выбрать:
   - **Image**: Ubuntu 22.04 x64
   - **Size**: Basic ($5/месяц - 1GB RAM, 1 CPU, 25GB SSD)
   - **Region**: любой рядом с пользователями
   - **SSH key**: добавить вашу SSH ключ или использовать пароль

### Шаг 2: Подключиться к серверу

```bash
ssh root@YOUR_DROPLET_IP
```

### Шаг 3: Обновить систему

```bash
apt update
apt upgrade -y
```

### Шаг 4: Установить Node.js 18

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
node --version
npm --version
```

### Шаг 5: Установить Git

```bash
apt install -y git
```

### Шаг 6: Клонировать репозиторий

```bash
git clone https://github.com/yourusername/PG78HUB-REBORN.git
cd PG78HUB-REBORN/backend
```

### Шаг 7: Установить зависимости

```bash
npm install
```

### Шаг 8: Генерировать VAPID ключи

```bash
npm run generate-keys
```

Скопируйте значения `VAPID_PUBLIC_KEY` и `VAPID_PRIVATE_KEY` - они нужны.

### Шаг 9: Отредактировать .env

```bash
nano .env
```

Убедитесь:
- `VAPID_EMAIL=mailto:admin@pg78calendar.com`
- `PORT=3000`
- `NODE_ENV=production`
- `FRONTEND_URL=https://yourdomain.com` (если у вас есть домен)

Сохранить: `Ctrl+X` → `Y` → `Enter`

### Шаг 10: Установить PM2 (для автозапуска)

```bash
npm install -g pm2
```

### Шаг 11: Запустить сервер через PM2

```bash
pm2 start server.js --name "birthday-notifications"
pm2 startup
pm2 save
```

### Шаг 12: Настроить Nginx

```bash
apt install -y nginx
```

Создать конфиг:
```bash
nano /etc/nginx/sites-available/birthday
```

Вставить:
```nginx
server {
    listen 80;
    server_name YOUR_IP_ADDRESS;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Сохранить и активировать:
```bash
ln -s /etc/nginx/sites-available/birthday /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Шаг 13: Получить SSL сертификат (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d YOUR_IP_ADDRESS
```

Или если у вас есть домен:
```bash
certbot --nginx -d yourdomain.com
```

### Шаг 14: Обновить Frontend

В файле `pages/pgCALENDAR/calendar_script.js` измените:
```javascript
const BACKEND_URL = 'https://YOUR_IP_ADDRESS'; // или https://yourdomain.com
```

---

## Опция 2: Linode

### Шаг 1-2: Создать Linode

1. Перейти на [Linode](https://www.linode.com/)
2. **Create** → **Linode**
3. Выбрать Ubuntu 22.04, Nanode ($5/месяц)

### Шаг 3+: Следовать шагам 2-14 как в DigitalOcean

---

## Опция 3: AWS EC2

### Шаг 1: Создать EC2 инстанс

1. Перейти на [AWS Console](https://console.aws.amazon.com/)
2. **EC2** → **Launch Instances**
3. Выбрать **Ubuntu 22.04 LTS**
4. Выбрать **t2.micro** (free tier eligible)

### Шаг 2: Создать Security Group

Разрешить:
- Port 22 (SSH)
- Port 80 (HTTP)
- Port 443 (HTTPS)

### Шаг 3+: Следовать шагам 2-14 как в DigitalOcean

---

## Опция 4: Heroku (БЕСПЛАТНО, но медленнее)

### Шаг 1: Установить Heroku CLI

```bash
npm install -g heroku
heroku login
```

### Шаг 2: Перейти в backend папку

```bash
cd backend
```

### Шаг 3: Создать Heroku app

```bash
heroku create your-app-name
```

### Шаг 4: Установить переменные окружения

```bash
heroku config:set VAPID_PUBLIC_KEY="your_key"
heroku config:set VAPID_PRIVATE_KEY="your_key"
heroku config:set VAPID_EMAIL="mailto:admin@pg78calendar.com"
heroku config:set NODE_ENV="production"
heroku config:set FRONTEND_URL="https://your-frontend.com"
```

### Шаг 5: Добавить Procfile

```bash
echo "web: node server.js" > Procfile
```

### Шаг 6: Развернуть

```bash
git push heroku main
heroku logs --tail
```

**Backend URL:** `https://your-app-name.herokuapp.com`

---

## Проверка работоспособности

После развертывания:

```bash
# Проверить здоровье сервера
curl https://YOUR_SERVER/api/health

# Отправить тестовое уведомление
curl -X POST https://YOUR_SERVER/api/send-test

# Получить VAPID ключ
curl https://YOUR_SERVER/api/vapid-public-key
```

---

## Мониторинг

### Просмотр логов PM2

```bash
pm2 logs birthday-notifications
```

### Просмотр всех процессов PM2

```bash
pm2 list
```

### Перезагрузить приложение

```bash
pm2 restart birthday-notifications
```

### Перезагрузить после перезагрузки сервера

```bash
pm2 resurrect
```

---

## Обновление кода

Чтобы обновить код на сервере:

```bash
cd PG78HUB-REBORN/backend
git pull origin main
npm install
pm2 restart birthday-notifications
```

---

## Решение проблем

### Ошибка: "Cannot find module 'express'"
```bash
npm install
```

### Ошибка: "Port 3000 already in use"
```bash
pm2 restart birthday-notifications
# или измените PORT в .env
```

### Ошибка: "VAPID keys not set"
```bash
npm run generate-keys
```

### Сервер не отправляет уведомления
1. Проверьте логи: `pm2 logs`
2. Убедитесь, что есть подписки: `curl https://YOUR_SERVER/api/stats`
3. Проверьте CORS настройки в `server.js`

---

## Рекомендации

- 🔒 Регулярно обновляйте Node.js и npm
- 📊 Мониторьте использование памяти: `free -h`
- 🔄 Включите автоматическое резервное копирование
- 🚀 Для высоконагруженных систем используйте load balancer
