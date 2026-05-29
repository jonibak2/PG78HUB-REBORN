// Скрипт для генерации VAPID ключей
// Запустите один раз: node generate-keys.js

const webpush = require('web-push');
const fs = require('fs');

// Генерируем VAPID ключи
const vapidKeys = webpush.generateVAPIDKeys();

// Создаем .env файл с ключами
const envContent = `# Web Push VAPID Keys
VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
VAPID_EMAIL=mailto:admin@pg78calendar.com

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Если вы развернули на сервере, используйте:
# FRONTEND_URL=https://yourdomain.com
`;

fs.writeFileSync('.env', envContent);

console.log('✅ VAPID ключи успешно сгенерированы!');
console.log('✅ Файл .env создан');
console.log('\nPublic Key (скопируйте в frontend):');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key (держите в безопасности на сервере):');
console.log(vapidKeys.privateKey);
console.log('\n⚠️ ВАЖНО: Не коммитьте .env файл в Git!');
