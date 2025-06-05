'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  TrendingUp, 
  Users, 
  Zap, 
  Wallet,
  Search,
  Filter,
  ArrowRight,
  Star,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import WalletSelectModal from '@/components/ui/WalletSelectModal';
import { Header } from '@/components/Layout/Header';
import { useWallet, useWalletModals } from '@/store/walletStore';
import { getPopularCollections, generateMockArtAuctions, NFTCollection } from '@/lib/nft';

// Демо данные
const featuredArtworks = [
  {
    id: '1',
    title: 'Цифровые Сны',
    artist: 'CryptoArtist',
    price: 2.5,
    currency: 'ETH',
    image: '/api/placeholder/400/400',
    category: 'Digital',
    shares: 1000,
    availableShares: 340,
    status: 'auction' as const,
  },
  {
    id: '2',
    title: 'Абстрактные Формы',
    artist: 'NFTCreator',
    price: 1.8,
    currency: 'ETH',
    image: '/api/placeholder/400/400',
    category: 'Abstract',
    shares: 1000,
    availableShares: 670,
    status: 'active' as const,
  },
  {
    id: '3',
    title: 'Космическая Одиссея',
    artist: 'ArtVault',
    price: 3.2,
    currency: 'ETH',
    image: '/api/placeholder/400/400',
    category: 'Sci-Fi',
    shares: 1000,
    availableShares: 890,
    status: 'fractional' as const,
  },
];

const stats = [
  { label: 'Общий объём торгов', value: '12.5M', unit: 'USDC', icon: TrendingUp },
  { label: 'Активные пользователи', value: '8.4K', unit: '', icon: Users },
  { label: 'Арт-объектов', value: '1.2K', unit: '', icon: Palette },
  { label: 'Средняя доходность', value: '24.7', unit: '%', icon: Zap },
];

export default function HomePage() {
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [mockAuctions, setMockAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isConnected, connectWallet } = useWallet();
  const { showWalletModal, openWalletModal, closeWalletModal } = useWalletModals();

  useEffect(() => {
    loadNFTData();
  }, []);

  const loadNFTData = async () => {
    try {
      setLoading(true);
      
      // Загружаем популярные коллекции NFT
      const popularCollections = await getPopularCollections(6);
      setCollections(popularCollections);
      
      // Генерируем мок-данные для аукционов
      const auctions = generateMockArtAuctions();
      setMockAuctions(auctions);
      
    } catch (error) {
      console.error('Ошибка загрузки NFT данных:', error);
      // Fallback на мок-данные
      setMockAuctions(generateMockArtAuctions());
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Инвестируйте в искусство
              <span className="block bg-gradient-to-r from-primary-600 to-vault-600 bg-clip-text text-transparent">
                вместе с сообществом
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Покупайте доли в произведениях искусства, участвуйте в аукционах и получайте доход 
              от роста стоимости через долевое владение на блокчейне
            </p>

                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg">
                  Начать инвестировать
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Как это работает
                </Button>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                  <span className="text-lg font-normal text-gray-500 ml-1">
                    {stat.unit}
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Популярные лоты</h2>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Поиск
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-vault-500/20" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                      {artwork.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    {artwork.status === 'auction' && (
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Аукцион
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {artwork.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    от {artwork.artist}
                  </p>

                  {/* Price and Shares */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {artwork.price} {artwork.currency}
                      </p>
                      <p className="text-sm text-gray-500">Текущая цена</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">
                        {artwork.availableShares}
                      </p>
                      <p className="text-sm text-gray-500">долей доступно</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Прогресс инвестирования</span>
                      <span>{Math.round(((artwork.shares - artwork.availableShares) / artwork.shares) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-vault-500 h-2 rounded-full"
                        style={{ width: `${((artwork.shares - artwork.availableShares) / artwork.shares) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button className="flex-1">
                      {artwork.status === 'auction' ? 'Сделать ставку' : 'Купить долю'}
                    </Button>
                    <Button variant="outline" size="md">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-vault-600 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-vault-600 bg-clip-text text-transparent">
                Vaults.cc
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Децентрализованная платформа для инвестиций в искусство
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <a href="#" className="hover:text-primary-600 transition-colors">О нас</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Условия</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Конфиденциальность</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Поддержка</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Wallet Connect Modal */}
      <WalletSelectModal 
        isOpen={showWalletModal}
        onClose={closeWalletModal}
        onWalletConnected={connectWallet}
      />
    </div>
  );
} 