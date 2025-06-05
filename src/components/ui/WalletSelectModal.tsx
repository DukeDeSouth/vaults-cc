'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertCircle, Check } from 'lucide-react';
import { 
  detectWallets, 
  connectWallet, 
  WalletType, 
  WalletInfo,
  ConnectedWallet,
  getNetworkName 
} from '@/lib/walletProviders';

interface WalletSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (wallet: ConnectedWallet) => void;
}

export default function WalletSelectModal({ 
  isOpen, 
  onClose, 
  onWalletConnected 
}: WalletSelectModalProps) {
  const [wallets, setWallets] = useState<Record<WalletType, WalletInfo>>({} as any);
  const [connecting, setConnecting] = useState<WalletType | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setWallets(detectWallets());
      setError('');
    }
  }, [isOpen]);

  const handleConnectWallet = async (walletType: WalletType) => {
    try {
      setConnecting(walletType);
      setError('');

      const wallet = await connectWallet(walletType);
      
      if (wallet) {
        onWalletConnected(wallet);
        onClose();
      } else {
        setError('Не удалось подключить кошелёк');
      }
    } catch (error: any) {
      console.error('Ошибка подключения:', error);
      setError(error.message || 'Ошибка подключения к кошельку');
    } finally {
      setConnecting(null);
    }
  };

  const getInstallUrl = (walletType: WalletType): string => {
    const urls: Record<WalletType, string> = {
      [WalletType.METAMASK]: 'https://metamask.io/download/',
      [WalletType.PHANTOM]: 'https://phantom.app/',
      [WalletType.WALLETCONNECT]: '',
      [WalletType.COINBASE]: 'https://www.coinbase.com/wallet',
      [WalletType.TRUST]: 'https://trustwallet.com/',
    };
    return urls[walletType];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Подключить кошелёк
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Ошибка */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Список кошельков */}
            <div className="space-y-3">
              {Object.entries(wallets).map(([walletType, wallet]) => (
                <motion.button
                  key={walletType}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnectWallet(walletType as WalletType)}
                  disabled={connecting !== null}
                  className={`
                    w-full p-4 rounded-xl border transition-all duration-200 flex items-center justify-between
                    ${wallet.installed
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                    }
                    ${connecting === walletType ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {wallet.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {wallet.installed ? 'Установлен' : 'Не установлен'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {connecting === walletType ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : wallet.installed ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <a
                        href={getInstallUrl(walletType as WalletType)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Подсказки */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Что такое Web3 кошелёк?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Кошелёк позволяет безопасно хранить криптовалюту и взаимодействовать с блокчейн приложениями.
                Ваши средства остаются под вашим полным контролем.
              </p>
            </div>

            {/* Дополнительная информация */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Подключая кошелёк, вы соглашаетесь с нашими{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Условиями использования
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 