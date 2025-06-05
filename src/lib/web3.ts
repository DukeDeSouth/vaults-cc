import { ethers } from 'ethers';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import type { CryptoCurrency, Blockchain } from '@/types';

// Ethereum/Polygon провайдеры
export const getEthereumProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

// Solana подключение
export const getSolanaConnection = () => {
  return new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
};

// Подключение кошелька
export const connectWallet = async (type: 'ethereum' | 'solana'): Promise<string | null> => {
  try {
    if (type === 'ethereum') {
      const provider = getEthereumProvider();
      if (!provider) {
        throw new Error('MetaMask не установлен');
      }
      
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      return await signer.getAddress();
    } else if (type === 'solana') {
      if (typeof window !== 'undefined' && window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        return response.publicKey.toString();
      } else {
        throw new Error('Phantom кошелёк не установлен');
      }
    }
  } catch (error) {
    console.error('Ошибка подключения кошелька:', error);
    return null;
  }
  return null;
};

// Отключение кошелька
export const disconnectWallet = async (type: 'ethereum' | 'solana') => {
  try {
    if (type === 'solana' && typeof window !== 'undefined' && window.solana) {
      await window.solana.disconnect();
    }
  } catch (error) {
    console.error('Ошибка отключения кошелька:', error);
  }
};

// Получение баланса
export const getBalance = async (
  address: string,
  currency: CryptoCurrency,
  blockchain: Blockchain
): Promise<number> => {
  try {
    if (blockchain === 'Ethereum' || blockchain === 'Polygon') {
      const provider = getEthereumProvider();
      if (!provider) return 0;

      if (currency === 'ETH') {
        const balance = await provider.getBalance(address);
        return parseFloat(ethers.formatEther(balance));
      } else if (currency === 'USDC') {
        // USDC контракт адрес (для примера)
        const usdcAddress = '0xA0b86a33E6441b4e8E1E13Af2b7F0A72d5C0C44E';
        const usdcContract = new ethers.Contract(
          usdcAddress,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );
        const balance = await usdcContract.balanceOf(address);
        return parseFloat(ethers.formatUnits(balance, 6)); // USDC имеет 6 десятичных знаков
      }
    } else if (blockchain === 'Solana') {
      const connection = getSolanaConnection();
      const publicKey = new PublicKey(address);
      
      if (currency === 'SOL') {
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9; // Конвертация из lamports
      }
    }
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
  }
  return 0;
};

// Отправка транзакции
export const sendTransaction = async (
  to: string,
  amount: number,
  currency: CryptoCurrency,
  blockchain: Blockchain
): Promise<string | null> => {
  try {
    if (blockchain === 'Ethereum' || blockchain === 'Polygon') {
      const provider = getEthereumProvider();
      if (!provider) return null;

      const signer = await provider.getSigner();
      
      if (currency === 'ETH') {
        const tx = await signer.sendTransaction({
          to,
          value: ethers.parseEther(amount.toString()),
        });
        return tx.hash;
      } else if (currency === 'USDC') {
        const usdcAddress = '0xA0b86a33E6441b4e8E1E13Af2b7F0A72d5C0C44E';
        const usdcContract = new ethers.Contract(
          usdcAddress,
          [
            'function transfer(address to, uint256 amount) returns (bool)',
          ],
          signer
        );
        const tx = await usdcContract.transfer(to, ethers.parseUnits(amount.toString(), 6));
        return tx.hash;
      }
    }
  } catch (error) {
    console.error('Ошибка отправки транзакции:', error);
  }
  return null;
};

// Проверка статуса транзакции
export const getTransactionStatus = async (
  txHash: string,
  blockchain: Blockchain
): Promise<'pending' | 'confirmed' | 'failed'> => {
  try {
    if (blockchain === 'Ethereum' || blockchain === 'Polygon') {
      const provider = getEthereumProvider();
      if (!provider) return 'failed';

      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) return 'pending';
      
      return receipt.status === 1 ? 'confirmed' : 'failed';
    } else if (blockchain === 'Solana') {
      const connection = getSolanaConnection();
      const status = await connection.getSignatureStatus(txHash);
      
      if (!status.value) return 'pending';
      if (status.value.err) return 'failed';
      return 'confirmed';
    }
  } catch (error) {
    console.error('Ошибка проверки статуса транзакции:', error);
  }
  return 'failed';
};

// Подпись сообщения для аутентификации
export const signMessage = async (
  message: string,
  blockchain: Blockchain
): Promise<string | null> => {
  try {
    if (blockchain === 'Ethereum' || blockchain === 'Polygon') {
      const provider = getEthereumProvider();
      if (!provider) return null;

      const signer = await provider.getSigner();
      return await signer.signMessage(message);
    } else if (blockchain === 'Solana') {
      if (typeof window !== 'undefined' && window.solana) {
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
        return Array.from(signedMessage.signature).join(',');
      }
    }
  } catch (error) {
    console.error('Ошибка подписи сообщения:', error);
  }
  return null;
};

// Утилиты для форматирования
export const formatCurrency = (amount: number, currency: CryptoCurrency): string => {
  const decimals = currency === 'USDC' ? 2 : 4;
  return `${amount.toLocaleString('ru-RU', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: decimals 
  })} ${currency}`;
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Валидация адресов
export const isValidEthereumAddress = (address: string): boolean => {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
};

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Расширение window для типов
declare global {
  interface Window {
    ethereum?: any;
    solana?: {
      isPhantom: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
    };
  }
} 