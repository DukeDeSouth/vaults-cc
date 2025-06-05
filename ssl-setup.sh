#!/bin/bash

echo "🔒 Настройка SSL сертификата для vaults.cc..."

# Установка certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Получение SSL сертификата
sudo certbot --nginx -d vaults.cc -d www.vaults.cc --non-interactive --agree-tos --email admin@vaults.cc

# Автоматическое обновление сертификата
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ SSL сертификат установлен!"
echo "🌐 Сайт теперь доступен по HTTPS: https://vaults.cc" 