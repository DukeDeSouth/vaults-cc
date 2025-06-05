import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import QRCodeModal from '@walletconnect/qrcode-modal';

export interface WalletInfo {
  name: string;
  icon: string;
  installed: boolean;
  provider?: any;
}

export interface ConnectedWallet {
  address: string;
  provider: any;
  chainId: number;
  walletName: string;
  balance?: number;
}

// Типы поддерживаемых кошельков
export enum WalletType {
  METAMASK = 'metamask',
  PHANTOM = 'phantom',
  WALLETCONNECT = 'walletconnect',
  COINBASE = 'coinbase',
  TRUST = 'trust'
}

// Проверка установленных кошельков
export const detectWallets = (): Record<WalletType, WalletInfo> => {
  const isClient = typeof window !== 'undefined';
  
  return {
    [WalletType.METAMASK]: {
      name: 'MetaMask',
      icon: '🦊',
      installed: isClient && Boolean(window.ethereum && window.ethereum.isMetaMask),
      provider: isClient ? window.ethereum : null
    },
    [WalletType.PHANTOM]: {
      name: 'Phantom',
      icon: '👻',
      installed: isClient && Boolean(window.solana && window.solana.isPhantom),
      provider: isClient ? window.solana : null
    },
    [WalletType.WALLETCONNECT]: {
      name: 'WalletConnect',
      icon: '🔗',
      installed: true, // WalletConnect всегда доступен
      provider: null
    },
    [WalletType.COINBASE]: {
      name: 'Coinbase Wallet',
      icon: '🔵',
      installed: isClient && Boolean(window.ethereum && window.ethereum.isCoinbaseWallet),
      provider: isClient ? window.ethereum : null
    },
    [WalletType.TRUST]: {
      name: 'Trust Wallet',
      icon: '🛡️',
      installed: isClient && Boolean(window.ethereum && window.ethereum.isTrust),
      provider: isClient ? window.ethereum : null
    }
  };
};

// Подключение MetaMask
export const connectMetaMask = async (): Promise<ConnectedWallet | null> => {
  try {
    const wallets = detectWallets();
    const metamask = wallets[WalletType.METAMASK];
    
    if (!metamask.installed) {
      throw new Error('MetaMask не установлен');
    }

    const provider = new ethers.BrowserProvider(metamask.provider!);
    await metamask.provider!.request({ method: 'eth_requestAccounts' });
    
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);

    return {
      address,
      provider: metamask.provider,
      chainId: Number(network.chainId),
      walletName: 'MetaMask',
      balance: parseFloat(ethers.formatEther(balance))
    };
  } catch (error) {
    console.error('Ошибка подключения MetaMask:', error);
    return null;
  }
};

// Подключение Phantom (Solana)
export const connectPhantom = async (): Promise<ConnectedWallet | null> => {
  try {
    const wallets = detectWallets();
    const phantom = wallets[WalletType.PHANTOM];
    
    if (!phantom.installed) {
      throw new Error('Phantom кошелёк не установлен');
    }

    const response = await phantom.provider!.connect();
    const address = response.publicKey.toString();

    return {
      address,
      provider: phantom.provider,
      chainId: 101, // Solana mainnet
      walletName: 'Phantom'
    };
  } catch (error) {
    console.error('Ошибка подключения Phantom:', error);
    return null;
  }
};

// Подключение WalletConnect
export const connectWalletConnect = async (): Promise<ConnectedWallet | null> => {
  try {
    const provider = new WalletConnectProvider({
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID || '',
      qrcodeModal: QRCodeModal,
      rpc: {
        1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
        137: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      },
    });

    await provider.enable();
    
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const network = await ethersProvider.getNetwork();
    const balance = await ethersProvider.getBalance(address);

    return {
      address,
      provider,
      chainId: Number(network.chainId),
      walletName: 'WalletConnect',
      balance: parseFloat(ethers.formatEther(balance))
    };
  } catch (error) {
    console.error('Ошибка подключения WalletConnect:', error);
    return null;
  }
};

// Универсальная функция подключения
export const connectWallet = async (walletType: WalletType): Promise<ConnectedWallet | null> => {
  switch (walletType) {
    case WalletType.METAMASK:
      return await connectMetaMask();
    case WalletType.PHANTOM:
      return await connectPhantom();
    case WalletType.WALLETCONNECT:
      return await connectWalletConnect();
    case WalletType.COINBASE:
      return await connectMetaMask(); // Coinbase использует тот же интерфейс
    case WalletType.TRUST:
      return await connectMetaMask(); // Trust использует тот же интерфейс
    default:
      return null;
  }
};

// Отключение кошелька
export const disconnectWallet = async (wallet: ConnectedWallet) => {
  try {
    if (wallet.walletName === 'WalletConnect' && wallet.provider.disconnect) {
      await wallet.provider.disconnect();
    } else if (wallet.walletName === 'Phantom' && wallet.provider.disconnect) {
      await wallet.provider.disconnect();
    }
  } catch (error) {
    console.error('Ошибка отключения кошелька:', error);
  }
};

// Смена сети
export const switchNetwork = async (chainId: number, provider: any): Promise<boolean> => {
  try {
    const hexChainId = `0x${chainId.toString(16)}`;
    
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
    
    return true;
  } catch (error: any) {
    // Если сеть не добавлена, попытаемся её добавить
    if (error.code === 4902) {
      return await addNetwork(chainId, provider);
    }
    console.error('Ошибка смены сети:', error);
    return false;
  }
};

// Добавление новой сети
export const addNetwork = async (chainId: number, provider: any): Promise<boolean> => {
  const networks: Record<number, any> = {
    137: {
      chainId: '0x89',
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/'],
    },
    56: {
      chainId: '0x38',
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/'],
    },
  };

  try {
    const networkConfig = networks[chainId];
    if (!networkConfig) {
      throw new Error('Неподдерживаемая сеть');
    }

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig],
    });
    
    return true;
  } catch (error) {
    console.error('Ошибка добавления сети:', error);
    return false;
  }
};

// Получение названия сети
export const getNetworkName = (chainId: number): string => {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    137: 'Polygon',
    56: 'BSC',
    43114: 'Avalanche',
    250: 'Fantom',
    10: 'Optimism',
    42161: 'Arbitrum',
    101: 'Solana'
  };

  return networks[chainId] || `Unknown (${chainId})`;
};

// Форматирование адреса кошелька
export const formatWalletAddress = (address: string, length: number = 8): string => {
  if (!address) return '';
  const start = address.slice(0, length / 2 + 2);
  const end = address.slice(-length / 2);
  return `${start}...${end}`;
};

 