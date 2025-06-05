# 🚀 Ручной деплой Vaults.cc на сервер

## 📦 У вас готов архив: `vaults-cc.tar.gz`

### Вариант 1: Через веб-панель управления сервером

1. **Войдите в панель управления сервером** (cPanel, ISPmanager, Plesk и т.д.)
2. **Загрузите файл** `vaults-cc.tar.gz` в директорию `/opt/vaults-cc/`
3. **Разархивируйте** файл через файловый менеджер
4. **Установите Node.js** (если не установлен):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
5. **Перейдите в папку проекта** и установите зависимости:
   ```bash
   cd /opt/vaults-cc
   npm install --production
   ```
6. **Запустите приложение**:
   ```bash
   npm run start
   ```

### Вариант 2: Через FTP/SFTP

1. **Подключитесь к серверу** через FTP клиент (FileZilla, WinSCP)
2. **Загрузите архив** `vaults-cc.tar.gz` в папку `/opt/vaults-cc/`
3. **Подключитесь по SSH** и выполните команды:
   ```bash
   cd /opt/vaults-cc
   tar -xzf vaults-cc.tar.gz
   npm install --production
   npm run start
   ```

### Вариант 3: Через Docker (если установлен)

1. **Загрузите архив** на сервер любым способом
2. **Выполните команды**:
   ```bash
   cd /opt/vaults-cc
   tar -xzf vaults-cc.tar.gz
   docker-compose up -d
   ```

## 🌐 Доступ к сайту

После запуска сайт будет доступен по адресу:
- **http://69.10.59.234:3000** (или другой порт)

## 🔧 Управление приложением

### Остановка
```bash
# Если запущено через npm
pkill -f "node"

# Если через Docker
docker-compose down
```

### Перезапуск
```bash
# Через npm
npm run start

# Через Docker
docker-compose restart
```

### Просмотр логов
```bash
# Если запущено через npm
tail -f /var/log/vaults-cc.log

# Через Docker
docker-compose logs -f
```

## 🚨 Проблемы и решения

### Порт занят
Если порт 3000 занят, измените в файле `package.json`:
```json
"start": "PORT=3001 next start"
```

### Нет прав доступа
```bash
sudo chown -R www-data:www-data /opt/vaults-cc
```

### Файрвол блокирует порт
```bash
sudo ufw allow 3000
```

## 📱 Альтернативные способы деплоя

### GitHub Pages (для статических файлов)
1. Создайте репозиторий на GitHub
2. Загрузите файлы проекта
3. Включите GitHub Pages в настройках

### Netlify Drop
1. Откройте https://app.netlify.com/drop
2. Перетащите папку `.next` в окно браузера
3. Получите мгновенный деплой

### Railway
1. Подключите GitHub репозиторий к Railway
2. Автоматический деплой при каждом push

---

**Архив готов к загрузке:** `vaults-cc.tar.gz` (в папке проекта)

Выберите удобный для вас способ и следуйте инструкции! 🎯 