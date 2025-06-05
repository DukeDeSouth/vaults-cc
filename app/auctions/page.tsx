'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Gavel, 
  TrendingUp, 
  Users, 
  Zap,
  Filter,
  Eye,
  Heart,
  AlertCircle,
  Timer,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Layout/Header';
import type { Auction, Bid } from '@/types';

// Демо данные аукционов
const mockAuctions: (Auction & { artwork: any })[] = [
  {
    id: '1',
    artPieceId: '1',
    type: 'english',
    startPrice: 1.5,
    currentPrice: 2.8,
    reservePrice: 2.0,
    buyNowPrice: 5.0,
    currency: 'ETH',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // через 3 часа
    bids: [
      {
        id: '1',
        auctionId: '1',
        bidderId: 'user1',
        amount: 2.8,
        currency: 'ETH',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        id: '2',
        auctionId: '1',
        bidderId: 'user2',
        amount: 2.5,
        currency: 'ETH',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
    status: 'active',
    extensionTime: 300, // 5 минут
    artwork: {
      title: 'Цифровые Сны',
      imageUrl: '/api/placeholder/400/400',
      artist: { username: 'CryptoArtist', verified: true },
      category: 'Digital Art',
    },
  },
  {
    id: '2',
    artPieceId: '2',
    type: 'dutch',
    startPrice: 5.0,
    currentPrice: 3.2,
    currency: 'ETH',
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    bids: [],
    status: 'active',
    extensionTime: 0,
    artwork: {
      title: 'Абстрактная Геометрия',
      imageUrl: '/api/placeholder/400/400',
      artist: { username: 'GeometryMaster', verified: true },
      category: 'Abstract',
    },
  },
  {
    id: '3',
    artPieceId: '3',
    type: 'english',
    startPrice: 0.8,
    currentPrice: 1.2,
    currency: 'ETH',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // через 2 часа
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000), // через 26 часов
    bids: [],
    status: 'upcoming',
    extensionTime: 300,
    artwork: {
      title: 'Космическая Одиссея',
      imageUrl: '/api/placeholder/400/400',
      artist: { username: 'SpaceExplorer', verified: false },
      category: 'Sci-Fi',
    },
  },
];

// Компонент таймера
const AuctionTimer = ({ endTime, status, onTimeEnd }: { 
  endTime: Date; 
  status: string;
  onTimeEnd?: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onTimeEnd?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeEnd]);

  if (status === 'upcoming') {
    return (
      <div className="flex items-center space-x-2 text-blue-600">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Начнётся через:</span>
        <div className="flex space-x-1 font-mono text-sm">
          <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span>:</span>
          <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span>:</span>
          <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
    );
  }

  const isEnding = timeLeft.days === 0 && timeLeft.hours < 1;

  return (
    <div className={`flex items-center space-x-2 ${isEnding ? 'text-red-600' : 'text-gray-600'}`}>
      <Timer className="w-4 h-4" />
      <span className="text-sm font-medium">Осталось:</span>
      <div className="flex space-x-1 font-mono text-sm">
        {timeLeft.days > 0 && (
          <>
            <span>{timeLeft.days}д</span>
            <span className="mx-1">:</span>
          </>
        )}
        <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span>:</span>
        <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span>:</span>
        <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default function AuctionsPage() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'upcoming' | 'ended'>('active');
  const [auctions, setAuctions] = useState(mockAuctions);

  const tabs = [
    { id: 'active', name: 'Активные', count: auctions.filter(a => a.status === 'active').length },
    { id: 'upcoming', name: 'Предстоящие', count: auctions.filter(a => a.status === 'upcoming').length },
    { id: 'ended', name: 'Завершённые', count: auctions.filter(a => a.status === 'ended').length },
  ];

  const filteredAuctions = auctions.filter(auction => {
    if (selectedTab === 'active') return auction.status === 'active';
    if (selectedTab === 'upcoming') return auction.status === 'upcoming';
    if (selectedTab === 'ended') return auction.status === 'ended';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-vault-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Gavel className="w-8 h-8" />
                <h1 className="text-4xl md:text-6xl font-bold">Аукционы</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Участвуйте в захватывающих торгах за уникальные произведения искусства
              </p>
              
              {/* Live Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">24</div>
                  <div className="text-blue-100 text-sm">Активных аукционов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">156</div>
                  <div className="text-blue-100 text-sm">Участников</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">45.2</div>
                  <div className="text-blue-100 text-sm">ETH оборот</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">98%</div>
                  <div className="text-blue-100 text-sm">Успешных продаж</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-900">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Все категории</option>
              <option>Digital Art</option>
              <option>Abstract</option>
              <option>Photography</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live обновления</span>
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-vault-500/20" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    auction.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : auction.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {auction.type === 'english' && 'Английский'}
                    {auction.type === 'dutch' && 'Голландский'}
                    {auction.type === 'blind' && 'Слепой'}
                  </span>
                </div>

                {/* Auction Type Indicator */}
                <div className="absolute top-4 right-4">
                  {auction.status === 'active' && (
                    <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-700">LIVE</span>
                    </div>
                  )}
                </div>

                {/* Watchers */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-xs text-white font-medium">
                      {Math.floor(Math.random() * 50) + 10}
                    </span>
                  </div>
                </div>

                {/* Heart */}
                <div className="absolute bottom-4 right-4">
                  <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {auction.artwork.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      от {auction.artwork.artist.username}
                      {auction.artwork.artist.verified && <span className="text-blue-500 ml-1">✓</span>}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    {auction.artwork.category}
                  </span>
                </div>

                {/* Timer */}
                <div className="mb-4">
                  <AuctionTimer 
                    endTime={auction.status === 'upcoming' ? auction.startTime : auction.endTime} 
                    status={auction.status}
                  />
                </div>

                {/* Price Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {auction.type === 'dutch' ? 'Текущая цена' : 'Текущая ставка'}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {auction.currentPrice} {auction.currency}
                    </span>
                  </div>
                  
                  {auction.type === 'english' && auction.reservePrice && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Резервная цена</span>
                      <span className="text-gray-700">{auction.reservePrice} {auction.currency}</span>
                    </div>
                  )}

                  {auction.buyNowPrice && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Купить сейчас</span>
                      <span className="text-green-600 font-medium">
                        {auction.buyNowPrice} {auction.currency}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bid History */}
                {auction.bids.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Последние ставки ({auction.bids.length})
                    </div>
                    <div className="space-y-1">
                      {auction.bids.slice(0, 2).map((bid) => (
                        <div key={bid.id} className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">
                            {bid.bidderId.slice(0, 6)}...
                          </span>
                          <span className="font-medium">
                            {bid.amount} {bid.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {auction.status === 'active' && (
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        {auction.type === 'dutch' ? 'Купить' : 'Сделать ставку'}
                      </Button>
                      {auction.buyNowPrice && auction.type === 'english' && (
                        <Button variant="outline">
                          Купить сейчас
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {auction.status === 'upcoming' && (
                    <Button variant="outline" className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Уведомить о старте
                    </Button>
                  )}

                  {auction.status === 'ended' && (
                    <div className="text-center py-2">
                      <span className="text-sm text-gray-500">Аукцион завершён</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gavel className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет {selectedTab === 'active' ? 'активных' : selectedTab === 'upcoming' ? 'предстоящих' : 'завершённых'} аукционов
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedTab === 'active' 
                ? 'В данный момент нет активных торгов'
                : selectedTab === 'upcoming'
                ? 'Скоро появятся новые аукционы'
                : 'История аукционов пока пуста'
              }
            </p>
            <Button variant="outline">
              Перейти к исследованию
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}