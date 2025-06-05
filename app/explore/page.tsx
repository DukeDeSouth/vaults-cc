'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  TrendingUp,
  Clock,
  Star,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ArtFilters, SortOptions, ArtPiece } from '@/types';

// Демо данные
const mockArtworks: ArtPiece[] = [
  {
    id: '1',
    title: 'Цифровые Сны',
    description: 'Абстрактная композиция, созданная с помощью AI',
    imageUrl: '/api/placeholder/400/400',
    category: 'digital',
    tags: ['AI', 'Abstract', 'Futuristic'],
    style: 'abstract',
    artist: {
      id: '1',
      walletAddress: '0x123',
      username: 'CryptoArtist',
      verified: true,
      totalStaked: 0,
      totalEarned: 0,
      joinedAt: new Date(),
      lastActivity: new Date(),
    },
    price: 2.5,
    currency: 'ETH',
    totalShares: 1000,
    availableShares: 340,
    status: 'auction',
    verified: true,
    metadata: {
      dimensions: { width: 1920, height: 1080 },
      year: 2024,
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Космическая Одиссея',
    description: 'Вдохновлено космическими путешествиями',
    imageUrl: '/api/placeholder/400/400',
    category: 'digital',
    tags: ['Space', 'Journey', 'Digital'],
    style: 'surrealism',
    artist: {
      id: '2',
      walletAddress: '0x456',
      username: 'SpaceCreator',
      verified: true,
      totalStaked: 0,
      totalEarned: 0,
      joinedAt: new Date(),
      lastActivity: new Date(),
    },
    price: 3.2,
    currency: 'ETH',
    totalShares: 1000,
    availableShares: 890,
    status: 'active',
    verified: true,
    metadata: {
      dimensions: { width: 2048, height: 1536 },
      year: 2024,
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
  // Добавим ещё несколько для демонстрации
  {
    id: '3',
    title: 'Минималистичная Гармония',
    description: 'Простота в каждой линии',
    imageUrl: '/api/placeholder/400/400',
    category: 'digital',
    tags: ['Minimal', 'Clean', 'Modern'],
    style: 'minimalism',
    artist: {
      id: '3',
      walletAddress: '0x789',
      username: 'MinimalArt',
      verified: false,
      totalStaked: 0,
      totalEarned: 0,
      joinedAt: new Date(),
      lastActivity: new Date(),
    },
    price: 1.8,
    currency: 'ETH',
    totalShares: 1000,
    availableShares: 550,
    status: 'fractional',
    verified: true,
    metadata: {
      dimensions: { width: 1600, height: 1200 },
      year: 2023,
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
  },
];

const categories = [
  { id: 'all', name: 'Все категории', count: 127 },
  { id: 'digital', name: 'Цифровое искусство', count: 89 },
  { id: 'photography', name: 'Фотография', count: 45 },
  { id: 'painting', name: 'Живопись', count: 32 },
  { id: 'sculpture', name: 'Скульптура', count: 18 },
  { id: 'generative', name: 'Генеративное', count: 23 },
];

const priceRanges = [
  { id: 'all', name: 'Любая цена', min: 0, max: Infinity },
  { id: 'low', name: 'До 1 ETH', min: 0, max: 1 },
  { id: 'mid', name: '1-5 ETH', min: 1, max: 5 },
  { id: 'high', name: '5-10 ETH', min: 5, max: 10 },
  { id: 'premium', name: 'Свыше 10 ETH', min: 10, max: Infinity },
];

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ArtFilters>({});
  const [sortBy, setSortBy] = useState<SortOptions>({
    field: 'created',
    direction: 'desc'
  });

  // Фильтрация и сортировка
  const filteredArtworks = useMemo(() => {
    let filtered = [...mockArtworks];

    // Поиск по названию и описанию
    if (searchQuery) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Фильтр по категории
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(artwork => 
        filters.category!.includes(artwork.category)
      );
    }

    // Фильтр по цене
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      filtered = filtered.filter(artwork => {
        const price = artwork.price;
        return (!filters.priceMin || price >= filters.priceMin) &&
               (!filters.priceMax || price <= filters.priceMax);
      });
    }

    // Фильтр по статусу
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(artwork => 
        filters.status!.includes(artwork.status)
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy.field) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'created':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'popular':
          aValue = (a.totalShares - a.availableShares);
          bValue = (b.totalShares - b.availableShares);
          break;
        default:
          return 0;
      }

      if (sortBy.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Исследовать арт</h1>
              <p className="text-gray-600 mt-1">
                Найдите произведения искусства для инвестирования
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск произведений..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Категории</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (category.id === 'all') {
                        setFilters(prev => ({ ...prev, category: undefined }));
                      } else {
                        setFilters(prev => ({ 
                          ...prev, 
                          category: [category.id as any] 
                        }));
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      (category.id === 'all' && !filters.category) ||
                      (filters.category && filters.category.includes(category.id as any))
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Ценовой диапазон</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => {
                      if (range.id === 'all') {
                        setFilters(prev => ({ 
                          ...prev, 
                          priceMin: undefined, 
                          priceMax: undefined 
                        }));
                      } else {
                        setFilters(prev => ({ 
                          ...prev, 
                          priceMin: range.min, 
                          priceMax: range.max === Infinity ? undefined : range.max 
                        }));
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm ${
                      (range.id === 'all' && !filters.priceMin && !filters.priceMax) ||
                      (filters.priceMin === range.min && 
                       (filters.priceMax === range.max || (range.max === Infinity && !filters.priceMax)))
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Статус</h3>
              <div className="space-y-2">
                {[
                  { id: 'active', name: 'Доступно для покупки', color: 'green' },
                  { id: 'auction', name: 'На аукционе', color: 'red' },
                  { id: 'fractional', name: 'Долевое владение', color: 'blue' },
                ].map((status) => (
                  <label key={status.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status.id as any) || false}
                      onChange={(e) => {
                        const newStatus = filters.status || [];
                        if (e.target.checked) {
                          setFilters(prev => ({ 
                            ...prev, 
                            status: [...newStatus, status.id as any] 
                          }));
                        } else {
                          setFilters(prev => ({ 
                            ...prev, 
                            status: newStatus.filter(s => s !== status.id) 
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{status.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Найдено <span className="font-semibold">{filteredArtworks.length}</span> произведений
                </p>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={`${sortBy.field}-${sortBy.direction}`}
                    onChange={(e) => {
                      const [field, direction] = e.target.value.split('-');
                      setSortBy({ field: field as any, direction: direction as any });
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="created-desc">Сначала новые</option>
                    <option value="created-asc">Сначала старые</option>
                    <option value="price-asc">Сначала дешёвые</option>
                    <option value="price-desc">Сначала дорогие</option>
                    <option value="popular-desc">Популярные</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Artworks Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden bg-gray-100 ${
                    viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-vault-500/20" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        artwork.status === 'auction' 
                          ? 'bg-red-100 text-red-700'
                          : artwork.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {artwork.status === 'auction' && 'Аукцион'}
                        {artwork.status === 'active' && 'Доступно'}
                        {artwork.status === 'fractional' && 'Долевое'}
                      </span>
                    </div>

                    {/* Heart Icon */}
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {artwork.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          от {artwork.artist.username}
                          {artwork.artist.verified && <span className="text-blue-500 ml-1">✓</span>}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {artwork.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {artwork.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price and Progress */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xl font-bold text-gray-900">
                          {artwork.price} {artwork.currency}
                        </p>
                        <p className="text-sm text-gray-500">Текущая цена</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary-600">
                          {artwork.availableShares} долей
                        </p>
                        <p className="text-xs text-gray-500">доступно</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Прогресс</span>
                        <span>{Math.round(((artwork.totalShares - artwork.availableShares) / artwork.totalShares) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-vault-500 h-2 rounded-full"
                          style={{ width: `${((artwork.totalShares - artwork.availableShares) / artwork.totalShares) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button className="flex-1">
                        {artwork.status === 'auction' ? 'Сделать ставку' : 'Купить долю'}
                      </Button>
                      <Button variant="outline" size="md">
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredArtworks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ничего не найдено</h3>
                <p className="text-gray-600 mb-4">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}