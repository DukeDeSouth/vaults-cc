import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ConnectedWallet, 
  disconnectWallet, 
  getNetworkName,
  switchNetwork 
} from '@/lib/walletProviders';

interface WalletState {
  // Состояние
  wallet: ConnectedWallet | null;
  isConnecting: boolean;
  error: string | null;
  
  // Модалы
  showWalletModal: boolean;
  showNetworkModal: boolean;
  
  // Действия
  setWallet: (wallet: ConnectedWallet | null) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  
  // Модалы
  openWalletModal: () => void;
  closeWalletModal: () => void;
  openNetworkModal: () => void;
  closeNetworkModal: () => void;
  
  // Кошелёк
  connectWallet: (wallet: ConnectedWallet) => void;
  disconnectWallet: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<boolean>;
  
  // Утилиты
  isConnected: () => boolean;
  getNetworkName: () => string;
  getShortAddress: () => string;
  refresh: () => Promise<void>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      wallet: null,
      isConnecting: false,
      error: null,
      showWalletModal: false,
      showNetworkModal: false,

      // Сеттеры
      setWallet: (wallet) => set({ wallet }),
      setConnecting: (isConnecting) => set({ isConnecting }),
      setError: (error) => set({ error }),

      // Модалы
      openWalletModal: () => set({ showWalletModal: true, error: null }),
      closeWalletModal: () => set({ showWalletModal: false }),
      openNetworkModal: () => set({ showNetworkModal: true }),
      closeNetworkModal: () => set({ showNetworkModal: false }),

      // Подключение кошелька
      connectWallet: (wallet) => {
        set({ 
          wallet, 
          showWalletModal: false, 
          error: null 
        });
        
        // Слушаем события от кошелька
        if (wallet.provider?.on) {
          wallet.provider.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              get().disconnectWallet();
            } else {
              set({ 
                wallet: { 
                  ...wallet, 
                  address: accounts[0] 
                } 
              });
            }
          });

          wallet.provider.on('chainChanged', (chainId: string) => {
            const newChainId = parseInt(chainId, 16);
            set({ 
              wallet: { 
                ...wallet, 
                chainId: newChainId 
              } 
            });
          });

          wallet.provider.on('disconnect', () => {
            get().disconnectWallet();
          });
        }
      },

      // Отключение кошелька
      disconnectWallet: async () => {
        const { wallet } = get();
        if (wallet) {
          try {
            await disconnectWallet(wallet);
          } catch (error) {
            console.error('Ошибка отключения кошелька:', error);
          }
        }
        set({ 
          wallet: null, 
          error: null 
        });
      },

      // Смена сети
      switchNetwork: async (chainId: number) => {
        const { wallet } = get();
        if (!wallet) return false;

        try {
          const success = await switchNetwork(chainId, wallet.provider);
          if (success) {
            set({ 
              wallet: { 
                ...wallet, 
                chainId 
              } 
            });
          }
          return success;
        } catch (error) {
          console.error('Ошибка смены сети:', error);
          return false;
        }
      },

      // Утилиты
      isConnected: () => Boolean(get().wallet),
      
      getNetworkName: () => {
        const { wallet } = get();
        return wallet ? getNetworkName(wallet.chainId) : '';
      },

      getShortAddress: () => {
        const { wallet } = get();
        if (!wallet) return '';
        const address = wallet.address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      },

      // Обновление данных кошелька
      refresh: async () => {
        const { wallet } = get();
        if (!wallet || !wallet.provider) return;

        try {
          // Обновляем баланс и другие данные
          if (wallet.provider.getBalance) {
            const balance = await wallet.provider.getBalance(wallet.address);
            set({
              wallet: {
                ...wallet,
                balance: parseFloat(balance)
              }
            });
          }
        } catch (error) {
          console.error('Ошибка обновления данных кошелька:', error);
        }
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        wallet: state.wallet
      }),
    }
  )
);

// Хуки для удобного использования
export const useWallet = () => {
  const store = useWalletStore();
  return {
    wallet: store.wallet,
    isConnected: store.isConnected(),
    isConnecting: store.isConnecting,
    error: store.error,
    shortAddress: store.getShortAddress(),
    networkName: store.getNetworkName(),
    connectWallet: store.connectWallet,
    disconnectWallet: store.disconnectWallet,
    switchNetwork: store.switchNetwork,
    refresh: store.refresh,
  };
};

export const useWalletModals = () => {
  const store = useWalletStore();
  return {
    showWalletModal: store.showWalletModal,
    showNetworkModal: store.showNetworkModal,
    openWalletModal: store.openWalletModal,
    closeWalletModal: store.closeWalletModal,
    openNetworkModal: store.openNetworkModal,
    closeNetworkModal: store.closeNetworkModal,
  };
}; 