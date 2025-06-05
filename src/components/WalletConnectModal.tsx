'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
// import { connectWallet } from '@/lib/web3';
// import { useUserStore } from '@/store/useUserStore';
import toast from 'react-hot-toast';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    type: 'ethereum' as const,
    icon: '🦊',
    description: 'Подключиться через MetaMask',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    type: 'solana' as const,
    icon: '👻',
    description: 'Подключиться через Phantom',
  },
];

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  // const { setUser, setConnected, setWalletType, setWalletAddress } = useUserStore();

  const handleConnect = async (walletType: 'ethereum' | 'solana', walletId: string) => {
    setConnecting(walletId);
    
    try {
      // const address = await connectWallet(walletType);
      
      // Временная заглушка для демо
      const address = `demo_${walletType}_address_${Date.now()}`;
      
      if (address) {
        // setWalletAddress(address);
        // setWalletType(walletType);
        // setConnected(true);
        
        toast.success(`Кошелёк ${walletType === 'ethereum' ? 'MetaMask' : 'Phantom'} успешно подключён!`);
        onClose();
      } else {
        toast.error('Не удалось подключить кошелёк');
      }
    } catch (error) {
      console.error('Ошибка подключения:', error);
      toast.error('Ошибка подключения кошелька');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Подключить кошелёк
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">
                Выберите кошелёк для подключения к платформе Vaults.cc
              </p>

              {/* Wallet Options */}
              <div className="space-y-3">
                {walletOptions.map((wallet) => (
                  <motion.button
                    key={wallet.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConnect(wallet.type, wallet.id)}
                    disabled={connecting === wallet.id}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{wallet.icon}</div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-700">
                          {wallet.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {wallet.description}
                        </p>
                      </div>
                      {connecting === wallet.id && (
                        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Warning */}
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">Важно!</p>
                  <p className="text-yellow-700 mt-1">
                    Убедитесь, что у вас установлен соответствующий кошелёк в браузере.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <p className="text-xs text-gray-500 text-center">
                Подключая кошелёк, вы соглашаетесь с условиями использования платформы
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 