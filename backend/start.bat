@echo off
REM Скрипт для быстрого запуска backend на Windows

echo.
echo ========================================
echo  PG78 Birthday Notifications Backend
echo ========================================
echo.

REM Проверяем наличие Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js не установлен!
    echo Скачайте с https://nodejs.org
    pause
    exit /b 1
)

echo [✓] Node.js установлен
echo.

REM Переходим в папку backend
cd /d "%~dp0"

REM Проверяем наличие node_modules
if not exist node_modules (
    echo [*] node_modules не найдены, устанавливаем зависимости...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Ошибка при установке зависимостей
        pause
        exit /b 1
    )
    echo [✓] Зависимости установлены
    echo.
)

REM Проверяем наличие .env
if not exist .env (
    echo [*] .env файл не найден, генерируем VAPID ключи...
    call npm run generate-keys
    if %errorlevel% neq 0 (
        echo [ERROR] Ошибка при генерации ключей
        pause
        exit /b 1
    )
    echo [✓] VAPID ключи сгенерированы
    echo [!] Не забудьте скопировать VAPID_PUBLIC_KEY в frontend!
    echo.
    pause
)

echo [*] Запуск сервера...
echo.
echo ========================================
echo  Backend запущен на http://localhost:3000
echo  Нажмите Ctrl+C для остановки
echo ========================================
echo.

call npm run dev

pause
