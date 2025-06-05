// Пользователь
export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  totalStaked: number;
  totalEarned: number;
  joinedAt: Date;
  lastActivity: Date;
}

// Арт-объект
export interface ArtPiece {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  category: ArtCategory;
  tags: string[];
  style: ArtStyle;
  artist: User;
  price: number;
  currency: CryptoCurrency;
  totalShares: number;
  availableShares: number;
  status: ArtStatus;
  verified: boolean;
  metadata: ArtMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// Категории и стили арта
export type ArtCategory = 'digital' | 'physical' | 'generative' | 'photography' | 'sculpture' | 'painting';
export type ArtStyle = 'abstract' | 'realism' | 'minimalism' | 'surrealism' | 'contemporary' | 'classic';
export type ArtStatus = 'draft' | 'pending' | 'active' | 'sold' | 'auction' | 'fractional';

// Метаданные арта
export interface ArtMetadata {
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
  };
  medium?: string;
  year?: number;
  edition?: number;
  totalEditions?: number;
  provenance?: string[];
  exhibitions?: string[];
}

// Криптовалюты
export type CryptoCurrency = 'USDC' | 'ETH' | 'SOL' | 'VAULT';
export type Blockchain = 'Ethereum' | 'Polygon' | 'Solana';

// Стейкинг позиция
export interface StakingPosition {
  id: string;
  userId: string;
  artPieceId: string;
  amount: number;
  currency: CryptoCurrency;
  sharesOwned: number;
  percentage: number;
  stakedAt: Date;
  lastRewardClaim: Date;
  totalRewards: number;
}

// Аукцион
export interface Auction {
  id: string;
  artPieceId: string;
  type: AuctionType;
  startPrice: number;
  currentPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  currency: CryptoCurrency;
  startTime: Date;
  endTime: Date;
  bids: Bid[];
  status: AuctionStatus;
  winner?: string;
  extensionTime: number; // для anti-sniping
}

export type AuctionType = 'english' | 'dutch' | 'blind';
export type AuctionStatus = 'upcoming' | 'active' | 'extended' | 'ended' | 'cancelled' | 'finalized';

// Ставка в аукционе
export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  currency: CryptoCurrency;
  timestamp: Date;
  txHash?: string;
}

// Транзакция
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: CryptoCurrency;
  blockchain: Blockchain;
  txHash?: string;
  status: TransactionStatus;
  metadata: TransactionMetadata;
  createdAt: Date;
  confirmedAt?: Date;
}

export type TransactionType = 'purchase' | 'sale' | 'stake' | 'unstake' | 'reward' | 'bid' | 'deposit' | 'withdrawal';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface TransactionMetadata {
  artPieceId?: string;
  auctionId?: string;
  fromAddress?: string;
  toAddress?: string;
  gasUsed?: number;
  gasPrice?: number;
}

// Кошелёк пользователя
export interface Wallet {
  userId: string;
  balances: {
    [currency in CryptoCurrency]?: number;
  };
  stakingPositions: StakingPosition[];
  pendingRewards: number;
  totalInvested: number;
  totalReturns: number;
}

// DAO голосование
export interface DAOProposal {
  id: string;
  artPieceId: string;
  title: string;
  description: string;
  type: ProposalType;
  proposer: string;
  options: ProposalOption[];
  votingPower: { [userId: string]: number };
  votes: { [userId: string]: number }; // индекс опции
  startTime: Date;
  endTime: Date;
  status: ProposalStatus;
  quorum: number;
  results?: ProposalResults;
}

export type ProposalType = 'sale' | 'exhibition' | 'reinvestment' | 'governance';
export type ProposalStatus = 'pending' | 'active' | 'ended' | 'executed' | 'cancelled';

export interface ProposalOption {
  id: number;
  text: string;
  votes: number;
}

export interface ProposalResults {
  winningOption: number;
  totalVotes: number;
  participationRate: number;
  executed: boolean;
}

// Уведомления
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata?: any;
  createdAt: Date;
}

export type NotificationType = 'bid' | 'outbid' | 'auction_end' | 'sale' | 'reward' | 'proposal' | 'system';

// API типы
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Фильтры и поиск
export interface ArtFilters {
  category?: ArtCategory[];
  style?: ArtStyle[];
  priceMin?: number;
  priceMax?: number;
  currency?: CryptoCurrency;
  status?: ArtStatus[];
  verified?: boolean;
  artist?: string;
  search?: string;
}

export interface SortOptions {
  field: 'price' | 'created' | 'updated' | 'popular' | 'ending_soon';
  direction: 'asc' | 'desc';
} 