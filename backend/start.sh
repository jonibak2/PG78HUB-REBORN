#!/bin/bash

# Скрипт для быстрого запуска backend на Linux/Mac

echo ""
echo "========================================"
echo "  PG78 Birthday Notifications Backend"
echo "========================================"
echo ""

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js не установлен!"
    echo "Скачайте с https://nodejs.org"
    exit 1
fi

echo "[✓] Node.js установлен: $(node --version)"
echo ""

# Переходим в папку скрипта
cd "$(dirname "$0")"

# Проверяем наличие node_modules
if [ ! -d "node_modules" ]; then
    echo "[*] node_modules не найдены, устанавливаем зависимости..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Ошибка при установке зависимостей"
        exit 1
    fi
    echo "[✓] Зависимости установлены"
    echo ""
fi

# Проверяем наличие .env
if [ ! -f ".env" ]; then
    echo "[*] .env файл не найден, генерируем VAPID ключи..."
    npm run generate-keys
    if [ $? -ne 0 ]; then
        echo "[ERROR] Ошибка при генерации ключей"
        exit 1
    fi
    echo "[✓] VAPID ключи сгенерированы"
    echo "[!] Не забудьте скопировать VAPID_PUBLIC_KEY в frontend!"
    echo ""
    read -p "Нажмите Enter для продолжения..."
fi

echo "[*] Запуск сервера..."
echo ""
echo "========================================"
echo "  Backend запущен на http://localhost:3000"
echo "  Нажмите Ctrl+C для остановки"
echo "========================================"
echo ""

npm run dev
