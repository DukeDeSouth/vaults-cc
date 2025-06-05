#!/bin/bash

# Ручной деплой на сервер vaults.cc
# Использовать пока GitHub Actions не заработает

echo "🚀 Начинаю ручной деплой на vaults.cc..."

# Проверяем SSH ключ
if [[ ! -f ~/.ssh/vaults_cc_deploy ]]; then
    echo "❌ SSH ключ не найден в ~/.ssh/vaults_cc_deploy"
    exit 1
fi

# Билдим проект локально
echo "📦 Билдим проект..."
npm ci
npm run build

# Синхронизируем файлы на сервер
echo "📤 Загружаем файлы на сервер..."
rsync -avz --delete -e "ssh -i ~/.ssh/vaults_cc_deploy -p 43988" \
  ./ root@69.10.59.234:/var/www/vaults-cc/ \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.next

# Запускаем команды на сервере
echo "⚙️ Настраиваем сервер..."
ssh -i ~/.ssh/vaults_cc_deploy -p 43988 root@69.10.59.234 << 'EOF'
cd /var/www/vaults-cc

# Устанавливаем зависимости и билдим
npm ci
npm run build

# Устанавливаем/настраиваем Nginx если нужно
if ! command -v nginx &> /dev/null; then
    apt update
    apt install -y nginx certbot python3-certbot-nginx
    
    # Копируем конфигурацию Nginx
    cp nginx.conf /etc/nginx/sites-available/vaults-cc
    ln -sf /etc/nginx/sites-available/vaults-cc /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Проверяем и запускаем Nginx
    nginx -t && systemctl restart nginx
    systemctl enable nginx
    
    # Получаем SSL сертификат
    certbot --nginx -d vaults.cc --non-interactive --agree-tos --email admin@vaults.cc
fi

# Перезапускаем PM2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Деплой завершен успешно!"
echo "🌐 Сайт доступен по адресу: https://vaults.cc"
EOF

echo "🎉 Ручной деплой завершен! Проверьте https://vaults.cc" 