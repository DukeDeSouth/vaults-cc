# 🎨 Vaults.cc - Web3 Платформа для Инвестиций в Искусство

Децентрализованная платформа для долевого владения произведениями искусства с интеграцией блокчейна, аукционами и DAO-голосованием.

## 🚀 Основные возможности

### 🎯 Для инвесторов
- **Долевое владение**: Покупайте доли в произведениях искусства начиная от $10
- **Диверсификация**: Инвестируйте в различные стили и категории искусства
- **Ликвидность**: Торгуйте долями на вторичном рынке
- **Доходность**: Получайте прибыль от роста стоимости и экспонирования

### 🎨 Для художников
- **Монетизация**: Продавайте свои работы напрямую сообществу
- **Роялти**: Получайте комиссию с каждой перепродажи
- **Сообщество**: Взаимодействуйте с инвесторами и коллекционерами
- **Верификация**: Подтверждайте подлинность через блокчейн

### 🏛️ DAO функции
- **Голосование**: Участвуйте в принятии решений о продаже и экспонировании
- **Управление**: Влияйте на развитие платформы
- **Распределение**: Справедливое распределение прибыли между участниками

## 🛠️ Технологический стек

### Frontend
- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - Типизированный JavaScript
- **Tailwind CSS** - Utility-first CSS фреймворк
- **Framer Motion** - Анимации и переходы
- **Zustand** - Управление состоянием
- **React Query** - Кэширование и синхронизация данных

### Web3 интеграция
- **Ethers.js** - Взаимодействие с Ethereum
- **Solana Web3.js** - Взаимодействие с Solana
- **MetaMask** - Ethereum кошелёк
- **Phantom** - Solana кошелёк

### Backend (планируется)
- **Node.js + Fastify/Nest.js**
- **PostgreSQL** - Основная база данных
- **Redis** - Кэширование и очереди
- **Prisma** - ORM для работы с БД
- **Socket.io** - Realtime уведомления

## 📁 Структура проекта

```
vaults-cc/
├── app/                    # Next.js App Router
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   └── page.tsx          # Главная страница
├── src/
│   ├── components/        # React компоненты
│   │   ├── ui/           # Базовые UI компоненты
│   │   └── ...           # Специфичные компоненты
│   ├── lib/              # Утилиты и конфигурация
│   │   └── web3.ts       # Web3 функции
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript типы
│   └── hooks/            # React hooks
├── public/               # Статические файлы
└── docs/                # Документация
```

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
# или
yarn install
```

### Настройка переменных окружения

```bash
cp .env.example .env.local
```

Отредактируйте `.env.local` и добавьте ваши API ключи.

### Запуск в режиме разработки

```bash
npm run dev
# или
yarn dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для продакшена

```bash
npm run build
npm run start
```

## 🔗 Web3 интеграция

### Поддерживаемые сети
- **Ethereum Mainnet**
- **Polygon**
- **Solana**

### Поддерживаемые кошельки
- **MetaMask** (Ethereum/Polygon)
- **Phantom** (Solana)
- **WalletConnect** (планируется)

### Токены
- **ETH** - Нативный токен Ethereum
- **USDC** - Стейблкоин для расчётов
- **SOL** - Нативный токен Solana
- **VAULT** - Утилити токен платформы (планируется)

## 🎯 Основные компоненты

### ArtPiece (Арт-объект)
```typescript
interface ArtPiece {
  id: string;
  title: string;
  artist: User;
  price: number;
  currency: CryptoCurrency;
  totalShares: number;
  availableShares: number;
  status: ArtStatus;
  // ...
}
```

### StakingPosition (Стейкинг позиция)
```typescript
interface StakingPosition {
  id: string;
  artPieceId: string;
  amount: number;
  sharesOwned: number;
  percentage: number;
  // ...
}
```

### Auction (Аукцион)
```typescript
interface Auction {
  id: string;
  artPieceId: string;
  type: AuctionType;
  currentPrice: number;
  bids: Bid[];
  // ...
}
```

## 🔐 Безопасность

- **Multi-signature кошельки** для хранения средств
- **Смарт-контракты аудиты** перед деплоем
- **Rate limiting** для API запросов
- **HTTPS** для всех соединений
- **Input validation** и санитизация данных

## 📈 Дорожная карта

### Фаза 1 (Текущая) - MVP
- [x] Базовая архитектура frontend
- [x] Web3 интеграция (MetaMask, Phantom)
- [x] UI/UX компоненты
- [ ] Backend API
- [ ] Основные смарт-контракты

### Фаза 2 - Основной функционал
- [ ] Система аукционов
- [ ] Долевое владение (staking)
- [ ] Профили пользователей
- [ ] Загрузка и верификация арта

### Фаза 3 - Продвинутые функции
- [ ] DAO голосование
- [ ] Мобильное приложение
- [ ] NFT интеграция
- [ ] Расширенная аналитика

### Фаза 4 - Экосистема
- [ ] Партнёрство с галереями
- [ ] Физические выставки
- [ ] Кросс-чейн мосты
- [ ] DeFi интеграция

## 👥 Команда

- **Frontend Developer** - React/Next.js разработка
- **Smart Contract Developer** - Solidity/Rust контракты
- **Backend Developer** - Node.js API
- **UI/UX Designer** - Дизайн интерфейсов
- **Product Manager** - Управление продуктом

## 📄 Лицензия

Этот проект лицензирован под MIT License - смотрите файл [LICENSE](LICENSE) для деталей.

## 🤝 Вклад в проект

Мы приветствуем вклад сообщества! Пожалуйста, прочитайте [CONTRIBUTING.md](CONTRIBUTING.md) для получения информации о том, как внести свой вклад.

## 📞 Контакты

- **Website**: [vaults.cc](https://vaults.cc)
- **Email**: team@vaults.cc
- **Twitter**: [@VaultsCC](https://twitter.com/VaultsCC)
- **Discord**: [Vaults.cc Community](https://discord.gg/vaultscc)
- **Telegram**: [@VaultsCC](https://t.me/VaultsCC)

---

**Создайте будущее инвестиций в искусство вместе с Vaults.cc** 🎨✨ 