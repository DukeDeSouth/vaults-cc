#!/bin/bash

# Безопасный скрипт деплоя Vaults.cc
# Использование: ./deploy.sh [server-ip] [ssh-key-path]

set -e

SERVER_IP=${1:-"your-server-ip"}
SSH_KEY=${2:-"~/.ssh/id_rsa"}
PROJECT_NAME="vaults-cc"
REMOTE_PATH="/opt/vaults-cc"

echo "🚀 Начинаем деплой на сервер $SERVER_IP..."

# Проверка SSH ключа
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH ключ не найден: $SSH_KEY"
    exit 1
fi

# Создание production build
echo "📦 Создание production build..."
npm run build

# Создание архива проекта
echo "📋 Создание архива..."
tar -czf vaults-cc.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    --exclude="*.log" \
    .

# Загрузка на сервер
echo "📤 Загрузка на сервер..."
scp -i "$SSH_KEY" vaults-cc.tar.gz root@$SERVER_IP:$REMOTE_PATH/
scp -i "$SSH_KEY" docker-compose.yml root@$SERVER_IP:$REMOTE_PATH/
scp -i "$SSH_KEY" Dockerfile root@$SERVER_IP:$REMOTE_PATH/

# Деплой через SSH
echo "🔧 Запуск деплоя на сервере..."
ssh -i "$SSH_KEY" root@$SERVER_IP << 'EOF'
cd /opt/vaults-cc

# Остановка старых контейнеров
docker-compose down || true

# Извлечение архива
tar -xzf vaults-cc.tar.gz
rm vaults-cc.tar.gz

# Сборка и запуск
docker-compose build --no-cache
docker-compose up -d

# Проверка статуса
docker-compose ps

echo "✅ Деплой завершен!"
echo "🌐 Приложение доступно по адресу: http://$(curl -s ifconfig.me):3000"
EOF

# Очистка временных файлов
rm vaults-cc.tar.gz

echo "🎉 Деплой успешно завершен!" 