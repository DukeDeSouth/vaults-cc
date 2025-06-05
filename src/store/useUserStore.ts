import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Wallet, CryptoCurrency, Blockchain } from '@/types';

interface UserState {
  // Состояние пользователя
  user: User | null;
  wallet: Wallet | null;
  isConnected: boolean;
  currentWalletType: 'ethereum' | 'solana' | null;
  walletAddress: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setWallet: (wallet: Wallet | null) => void;
  setConnected: (connected: boolean) => void;
  setWalletType: (type: 'ethereum' | 'solana' | null) => void;
  setWalletAddress: (address: string | null) => void;
  updateBalance: (currency: CryptoCurrency, amount: number) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      user: null,
      wallet: null,
      isConnected: false,
      currentWalletType: null,
      walletAddress: null,

      // Actions
      setUser: (user) => set({ user }),
      
      setWallet: (wallet) => set({ wallet }),
      
      setConnected: (connected) => set({ isConnected: connected }),
      
      setWalletType: (type) => set({ currentWalletType: type }),
      
      setWalletAddress: (address) => set({ walletAddress: address }),
      
      updateBalance: (currency, amount) => {
        const { wallet } = get();
        if (wallet) {
          set({
            wallet: {
              ...wallet,
              balances: {
                ...wallet.balances,
                [currency]: amount,
              },
            },
          });
        }
      },
      
      resetUser: () => set({
        user: null,
        wallet: null,
        isConnected: false,
        currentWalletType: null,
        walletAddress: null,
      }),
    }),
    {
      name: 'vaults-user-storage',
      partialize: (state) => ({
        user: state.user,
        wallet: state.wallet,
        isConnected: state.isConnected,
        currentWalletType: state.currentWalletType,
        walletAddress: state.walletAddress,
      }),
    }
  )
); 