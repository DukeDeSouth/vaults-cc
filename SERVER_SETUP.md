# 🔧 Настройка сервера для деплоя Vaults.cc

## 📋 Требования к серверу

- Ubuntu 20.04+ / CentOS 8+
- 2+ GB RAM
- 20+ GB свободного места
- Docker и Docker Compose

## 🔐 1. Настройка безопасности

### Создание SSH-ключей (на локальной машине)
```bash
# Генерация SSH ключей
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Копирование публичного ключа на сервер
ssh-copy-id -i ~/.ssh/id_rsa.pub root@YOUR_SERVER_IP
```

### Настройка SSH (на сервере)
```bash
# Отключение входа по паролю
sudo nano /etc/ssh/sshd_config

# Изменить эти параметры:
PasswordAuthentication no
PermitRootLogin prohibit-password
PubkeyAuthentication yes

# Перезапуск SSH
sudo systemctl restart sshd
```

### Настройка файрвола
```bash
# Ubuntu/Debian
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## 🐳 2. Установка Docker

### Ubuntu
```bash
# Обновление пакетов
sudo apt update

# Установка зависимостей
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Добавление Docker GPG ключа
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Добавление репозитория
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### CentOS
```bash
# Установка Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io

# Запуск Docker
sudo systemctl start docker
sudo systemctl enable docker

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 📁 3. Подготовка директорий

```bash
# Создание директории проекта
sudo mkdir -p /opt/vaults-cc
sudo chown $USER:$USER /opt/vaults-cc

# Создание директорий для данных
sudo mkdir -p /opt/vaults-cc/data/postgres
sudo mkdir -p /opt/vaults-cc/data/redis
sudo mkdir -p /opt/vaults-cc/logs
```

## 🚀 4. Деплой проекта

### Подготовка на локальной машине
```bash
# Сделать скрипт исполняемым
chmod +x deploy.sh

# Запуск деплоя
./deploy.sh YOUR_SERVER_IP ~/.ssh/id_rsa
```

### Ручной деплой (альтернативный способ)
```bash
# На локальной машине - создание архива
npm run build
tar -czf vaults-cc.tar.gz --exclude=node_modules --exclude=.git .

# Загрузка на сервер
scp vaults-cc.tar.gz root@YOUR_SERVER_IP:/opt/vaults-cc/

# На сервере - извлечение и запуск
cd /opt/vaults-cc
tar -xzf vaults-cc.tar.gz
docker-compose up -d
```

## 🔍 5. Мониторинг

### Проверка статуса
```bash
# Статус контейнеров
docker-compose ps

# Логи приложения
docker-compose logs -f app

# Логи базы данных
docker-compose logs -f postgres

# Использование ресурсов
docker stats
```

### Полезные команды
```bash
# Перезапуск приложения
docker-compose restart app

# Полная пересборка
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Очистка неиспользуемых образов
docker system prune -a
```

## 🌐 6. Настройка домена (опционально)

### Nginx конфигурация
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL сертификат (Let's Encrypt)
```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com
```

## 🚨 Важные замечания

1. **Никогда не используйте пароли в продакшене** - только SSH-ключи
2. **Регулярно обновляйте сервер** и Docker образы
3. **Настройте автоматические бэкапы** базы данных
4. **Мониторьте логи** на предмет ошибок и атак
5. **Используйте SSL сертификаты** для HTTPS 