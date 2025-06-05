'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  TrendingUp, 
  Wallet,
  Settings,
  Copy,
  ExternalLink,
  Star,
  Trophy,
  PieChart,
  Calendar,
  DollarSign,
  Activity,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Layout/Header';
import type { StakingPosition, Transaction, ArtPiece } from '@/types';

// Демо данные пользователя
const mockUser = {
  id: '1',
  walletAddress: '0x742d35Cc6435C6A9C4d8B0a4f1C75d4b8C8E5e2e',
  username: 'CryptoCollector',
  avatar: null,
  bio: 'Коллекционер цифрового искусства и инвестор в Web3 проекты',
  verified: true,
  totalStaked: 15.7,
  totalEarned: 3.2,
  joinedAt: new Date('2023-06-15'),
  lastActivity: new Date(),
  stats: {
    artworksBought: 12,
    stakingPositions: 8,
    totalInvested: 18.9,
    totalReturns: 3.2,
    averageReturn: 16.9,
    bestPerformance: 45.6,
  }
};

const mockStakingPositions: (StakingPosition & { artwork: any })[] = [
  {
    id: '1',
    userId: '1',
    artPieceId: '1',
    amount: 2.5,
    currency: 'ETH',
    sharesOwned: 250,
    percentage: 25.0,
    stakedAt: new Date('2024-01-15'),
    lastRewardClaim: new Date('2024-02-01'),
    totalRewards: 0.8,
    artwork: {
      title: 'Цифровые Сны',
      imageUrl: '/api/placeholder/300/300',
      artist: 'CryptoArtist',
      currentValue: 3.2,
      change24h: 12.5,
      status: 'active'
    }
  },
  {
    id: '2',
    userId: '1',
    artPieceId: '2',
    amount: 1.8,
    currency: 'ETH',
    sharesOwned: 180,
    percentage: 18.0,
    stakedAt: new Date('2024-02-01'),
    lastRewardClaim: new Date('2024-02-15'),
    totalRewards: 0.3,
    artwork: {
      title: 'Абстрактная Геометрия',
      imageUrl: '/api/placeholder/300/300',
      artist: 'GeometryMaster',
      currentValue: 2.1,
      change24h: -5.2,
      status: 'active'
    }
  },
  {
    id: '3',
    userId: '1',
    artPieceId: '3',
    amount: 3.0,
    currency: 'ETH',
    sharesOwned: 300,
    percentage: 30.0,
    stakedAt: new Date('2023-12-10'),
    lastRewardClaim: new Date('2024-01-20'),
    totalRewards: 1.2,
    artwork: {
      title: 'Космическая Одиссея',
      imageUrl: '/api/placeholder/300/300',
      artist: 'SpaceExplorer',
      currentValue: 4.5,
      change24h: 28.3,
      status: 'sold'
    }
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'stake',
    amount: 2.5,
    currency: 'ETH',
    blockchain: 'Ethereum',
    txHash: '0x1234567890abcdef...',
    status: 'confirmed',
    metadata: { artPieceId: '1' },
    createdAt: new Date('2024-01-15'),
    confirmedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: '1',
    type: 'reward',
    amount: 0.8,
    currency: 'ETH',
    blockchain: 'Ethereum',
    status: 'confirmed',
    metadata: { artPieceId: '1' },
    createdAt: new Date('2024-02-01'),
    confirmedAt: new Date('2024-02-01'),
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'staking' | 'history' | 'settings'>('portfolio');
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(mockUser.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'portfolio', name: 'Портфолио', icon: PieChart },
    { id: 'staking', name: 'Стейкинг', icon: TrendingUp },
    { id: 'history', name: 'История', icon: Activity },
    { id: 'settings', name: 'Настройки', icon: Settings },
  ];

  const formatCurrency = (amount: number, currency: string = 'ETH') => {
    return `${amount.toFixed(3)} ${currency}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    const color = value >= 0 ? 'text-green-600' : 'text-red-600';
    return (
      <span className={color}>
        {sign}{value.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-vault-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{mockUser.username}</h1>
                {mockUser.verified && (
                  <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4" />
                    <span>Верифицирован</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-3">{mockUser.bio}</p>
              
              {/* Wallet Address */}
              <div className="flex items-center space-x-2 mb-4">
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono">
                  {mockUser.walletAddress.slice(0, 10)}...{mockUser.walletAddress.slice(-8)}
                </code>
                <button
                  onClick={copyAddress}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Копировать адрес"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Открыть в Etherscan"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Join Date */}
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                Участник с {mockUser.joinedAt.toLocaleDateString('ru-RU', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Настройки
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(mockUser.stats.totalInvested)}
              </div>
              <div className="text-sm text-gray-500">Всего инвестировано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {formatCurrency(mockUser.stats.totalReturns)}
              </div>
              <div className="text-sm text-gray-500">Общая прибыль</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {formatPercentage(mockUser.stats.averageReturn)}
              </div>
              <div className="text-sm text-gray-500">Средняя доходность</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-vault-600 mb-1">
                {mockUser.stats.artworksBought}
              </div>
              <div className="text-sm text-gray-500">Купленных работ</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'portfolio' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Portfolio Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Общая стоимость</h3>
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatCurrency(mockUser.stats.totalInvested + mockUser.stats.totalReturns)}
                  </div>
                  <div className="text-sm text-green-600">
                    +{formatCurrency(mockUser.stats.totalReturns)} прибыль
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Лучшая сделка</h3>
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPercentage(mockUser.stats.bestPerformance)}
                  </div>
                  <div className="text-sm text-gray-500">Космическая Одиссея</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Активных позиций</h3>
                    <Activity className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {mockUser.stats.stakingPositions}
                  </div>
                  <div className="text-sm text-gray-500">из {mockUser.stats.artworksBought} всего</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'staking' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockStakingPositions.map((position) => (
                  <div
                    key={position.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-vault-500/20" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          position.artwork.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {position.percentage}% владения
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {position.artwork.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        от {position.artwork.artist}
                      </p>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Вложено</span>
                          <span className="font-medium">{formatCurrency(position.amount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Текущая стоимость</span>
                          <span className="font-medium">{formatCurrency(position.artwork.currentValue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Доходность</span>
                          {formatPercentage(position.artwork.change24h)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Реварды</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(position.totalRewards)}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          Подробнее
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">История транзакций</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'stake' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {tx.type === 'stake' ? (
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          ) : (
                            <DollarSign className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {tx.type === 'stake' ? 'Стейкинг' : 'Получение реварда'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tx.createdAt.toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {tx.type === 'stake' ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                        </div>
                        <div className="text-sm text-gray-500">{tx.blockchain}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Настройки профиля</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя пользователя
                  </label>
                  <input
                    type="text"
                    defaultValue={mockUser.username}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Биография
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={mockUser.bio}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <Button>Сохранить изменения</Button>
                  <Button variant="outline">Отмена</Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 