#!/bin/bash

echo "🚀 Запуск Vaults.cc сервера..."

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "📦 Установка Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Проверка PM2
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Установка PM2..."
    npm install -g pm2
fi

# Создание директории для логов
mkdir -p logs

# Установка зависимостей
echo "📋 Установка зависимостей..."
npm install --production

# Запуск приложения
echo "🔧 Запуск приложения..."
pm2 start ecosystem.config.js --env production

# Настройка автозапуска
pm2 startup
pm2 save

# Открытие порта в файрволе
echo "🔥 Настройка файрвола..."
sudo ufw allow 3000 || echo "Файрвол не настроен или уже открыт"

# Информация о статусе
echo ""
echo "✅ Vaults.cc успешно запущен!"
echo "🌐 Сайт доступен по адресу: http://$(curl -s ifconfig.me):3000"
echo ""
echo "🔧 Управление:"
echo "  pm2 status       - статус приложений"
echo "  pm2 logs         - просмотр логов"
echo "  pm2 restart all  - перезапуск"
echo "  pm2 stop all     - остановка"
echo "" 