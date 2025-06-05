import type { Blockchain } from '@/types';

// OpenSea API интеграция
const OPENSEA_API_BASE = 'https://api.opensea.io/api/v2';
const OPENSEA_TESTNET_API_BASE = 'https://testnets-api.opensea.io/api/v2';

export interface NFTCollection {
  slug: string;
  name: string;
  description: string;
  image_url: string;
  external_url: string;
  total_supply: number;
  floor_price: number;
  market_cap: number;
  volume_24h: number;
  owners: number;
}

export interface NFTAsset {
  identifier: string;
  name: string;
  description: string;
  image_url: string;
  animation_url?: string;
  traits: Array<{
    trait_type: string;
    value: string;
  }>;
  owner: string;
  contract: string;
  collection: string;
  last_sale?: {
    price: number;
    currency: string;
    date: string;
  };
  current_price?: {
    price: number;
    currency: string;
  };
}

// Получить популярные коллекции NFT
export const getPopularCollections = async (limit: number = 12): Promise<NFTCollection[]> => {
  try {
    const response = await fetch(`${OPENSEA_API_BASE}/collections?order_by=market_cap&limit=${limit}`, {
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenSea API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.collections?.map((collection: any) => ({
      slug: collection.collection,
      name: collection.name,
      description: collection.description,
      image_url: collection.image_url,
      external_url: collection.external_url,
      total_supply: collection.total_supply || 0,
      floor_price: collection.stats?.floor_price || 0,
      market_cap: collection.stats?.market_cap || 0,
      volume_24h: collection.stats?.one_day_volume || 0,
      owners: collection.stats?.num_owners || 0,
    })) || [];
  } catch (error) {
    console.error('Ошибка получения коллекций:', error);
    return [];
  }
};

// Получить NFT из коллекции
export const getCollectionNFTs = async (
  collectionSlug: string, 
  limit: number = 20
): Promise<NFTAsset[]> => {
  try {
    const response = await fetch(
      `${OPENSEA_API_BASE}/collection/${collectionSlug}/nfts?limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenSea API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.nfts?.map((nft: any) => ({
      identifier: nft.identifier,
      name: nft.name,
      description: nft.description,
      image_url: nft.image_url,
      animation_url: nft.animation_url,
      traits: nft.traits || [],
      owner: nft.owners?.[0]?.address || '',
      contract: nft.contract,
      collection: collectionSlug,
      last_sale: nft.last_sale ? {
        price: parseFloat(nft.last_sale.total_price) / 1e18,
        currency: 'ETH',
        date: nft.last_sale.event_timestamp,
      } : undefined,
    })) || [];
  } catch (error) {
    console.error('Ошибка получения NFT:', error);
    return [];
  }
};

// Поиск NFT
export const searchNFTs = async (query: string, limit: number = 20): Promise<NFTAsset[]> => {
  try {
    const response = await fetch(
      `${OPENSEA_API_BASE}/chain/ethereum/nfts?name=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-API-KEY': process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenSea API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.nfts?.map((nft: any) => ({
      identifier: nft.identifier,
      name: nft.name,
      description: nft.description,
      image_url: nft.image_url,
      animation_url: nft.animation_url,
      traits: nft.traits || [],
      owner: nft.owners?.[0]?.address || '',
      contract: nft.contract,
      collection: nft.collection,
    })) || [];
  } catch (error) {
    console.error('Ошибка поиска NFT:', error);
    return [];
  }
};

// Получить статистику коллекции
export const getCollectionStats = async (collectionSlug: string) => {
  try {
    const response = await fetch(`${OPENSEA_API_BASE}/collections/${collectionSlug}/stats`, {
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenSea API error: ${response.status}`);
    }

    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    return null;
  }
};

// Генерация мок-данных для демонстрации
export const generateMockArtAuctions = (): Array<{
  id: string;
  title: string;
  artist: string;
  image: string;
  currentBid: number;
  currency: string;
  endTime: Date;
  description: string;
  tags: string[];
}> => {
  const mockAuctions = [
    {
      id: '1',
      title: 'Digital Renaissance #001',
      artist: 'CryptoVinci',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      currentBid: 2.5,
      currency: 'ETH',
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      description: 'Уникальное цифровое произведение искусства в стиле ренессанса',
      tags: ['Digital Art', 'Renaissance', 'Exclusive']
    },
    {
      id: '2',
      title: 'Neon Dreams',
      artist: 'NeonArtist',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
      currentBid: 1.8,
      currency: 'ETH',
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
      description: 'Яркое неоновое искусство будущего',
      tags: ['Neon', 'Future', 'Vibrant']
    },
    {
      id: '3',
      title: 'Abstract Emotions',
      artist: 'EmotionFlow',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      currentBid: 3.2,
      currency: 'ETH',
      endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      description: 'Абстрактное выражение человеческих эмоций',
      tags: ['Abstract', 'Emotions', 'Expressive']
    },
    {
      id: '4',
      title: 'Cosmic Journey',
      artist: 'SpaceArt',
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop',
      currentBid: 4.1,
      currency: 'ETH',
      endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
      description: 'Путешествие через космические просторы',
      tags: ['Space', 'Journey', 'Cosmic']
    }
  ];

  return mockAuctions;
};

// Утилиты для работы с ценами
export const formatNFTPrice = (price: number, currency: string = 'ETH'): string => {
  if (price === 0) return 'Не продается';
  
  const decimals = currency === 'ETH' ? 4 : 2;
  return `${price.toLocaleString('ru-RU', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: decimals 
  })} ${currency}`;
};

export const calculateROI = (buyPrice: number, currentPrice: number): number => {
  if (buyPrice === 0) return 0;
  return ((currentPrice - buyPrice) / buyPrice) * 100;
}; 