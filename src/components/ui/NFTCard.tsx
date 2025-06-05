'use client';

import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, Users, Clock, Star } from 'lucide-react';
import { Button } from './Button';
import { formatNFTPrice, calculateROI } from '@/lib/nft';
import type { NFTCollection, NFTAsset } from '@/lib/nft';

interface NFTCardProps {
  collection?: NFTCollection;
  asset?: NFTAsset;
  type: 'collection' | 'asset';
  onSelect?: () => void;
}

export default function NFTCard({ collection, asset, type, onSelect }: NFTCardProps) {
  if (type === 'collection' && collection) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
        onClick={onSelect}
      >
        {/* Изображение коллекции */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          {collection.image_url ? (
            <img 
              src={collection.image_url} 
              alt={collection.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
          
          {/* Оверлей с статистикой */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">{formatNFTPrice(collection.floor_price)}</p>
                  <p className="text-xs opacity-80">Floor</p>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">{collection.owners}</p>
                  <p className="text-xs opacity-80">Owners</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Информация о коллекции */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {collection.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {collection.description || 'Популярная NFT коллекция для инвестиций'}
          </p>

          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {formatNFTPrice(collection.floor_price)}
              </p>
              <p className="text-sm text-gray-500">Floor Price</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">
                {formatNFTPrice(collection.volume_24h)}
              </p>
              <p className="text-sm text-gray-500">24h Volume</p>
            </div>
          </div>

          {/* Прогресс-бар доступности */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Доступно для инвестиций</span>
              <span>{Math.round((collection.owners / collection.total_supply) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min((collection.owners / collection.total_supply) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex space-x-3">
            <Button className="flex-1">
              Инвестировать
            </Button>
            <Button variant="outline" size="md">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === 'asset' && asset) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
        onClick={onSelect}
      >
        {/* Изображение NFT */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {asset.image_url ? (
            <img 
              src={asset.image_url} 
              alt={asset.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Бейдж статуса */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              #{asset.identifier}
            </span>
          </div>

          {/* Индикатор последней продажи */}
          {asset.last_sale && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Sold
              </span>
            </div>
          )}
        </div>

        {/* Информация о NFT */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {asset.name || `${asset.collection} #${asset.identifier}`}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Владелец: {asset.owner ? `${asset.owner.slice(0, 6)}...${asset.owner.slice(-4)}` : 'Unknown'}
          </p>

          {/* Цена */}
          {asset.last_sale && (
            <div className="mb-4">
              <p className="text-xl font-bold text-gray-900">
                {formatNFTPrice(asset.last_sale.price, asset.last_sale.currency)}
              </p>
              <p className="text-sm text-gray-500">Последняя продажа</p>
            </div>
          )}

          {/* Редкость (трейты) */}
          {asset.traits && asset.traits.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Свойства:</p>
              <div className="flex flex-wrap gap-2">
                {asset.traits.slice(0, 3).map((trait, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
                  >
                    {trait.trait_type}: {trait.value}
                  </span>
                ))}
                {asset.traits.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-500">
                    +{asset.traits.length - 3} еще
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex space-x-3">
            <Button className="flex-1">
              Купить долю
            </Button>
            <Button variant="outline" size="md">
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
} 