import { ethers } from 'ethers';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface TransactionContextProps {
  checkIfWalletIsConnected: () => Promise<any>;
  connectWallet: () => Promise<any>;
  currentAccount: string | undefined;
  isConnected: string | undefined;
  setIsConnected: React.Dispatch<string>;
  balance: string;
  setBalance: React.Dispatch<string>;
  setCurrentNetwork: React.Dispatch<any>;
  currentNetwork: any;
}

type Props = {
  children: ReactNode;
};

const TransactionContextDefaultValue: TransactionContextProps = {
  checkIfWalletIsConnected: async () => {},
  connectWallet: async () => {},
  currentAccount: '',
  isConnected: '',
  setIsConnected: () => {},
  balance: '0',
  setBalance: () => {},
  setCurrentNetwork: () => {},
  currentNetwork: {},
};

const TransactionContext = createContext<TransactionContextProps>(
  TransactionContextDefaultValue
);

export function useTransactionContext() {
  return useContext(TransactionContext);
}

export const TransactionProvider = ({ children }: Props) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isConnected, setIsConnected] = useState<string>();
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState<any>();

  const getBalance = async () => {
    if (isConnected === 'connected') {
      const coinBalance = await provider.getBalance(currentAccount);
      setBalance(ethers.utils.formatEther(coinBalance));
    }
  };

  const getProvider = async () => {
    if (typeof window !== 'undefined') {
      const httpprovider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(httpprovider);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const metamask = window.ethereum;
    try {
      if (!metamask) {
        setIsConnected('nometamask');
        return 'nometamask';
      }

      const accounts = await metamask.request({ method: 'eth_accounts' });

      if (accounts.length) {
        await setCurrentAccount(accounts[0]);
        await setIsConnected('connected');
        return currentAccount;
      }
      setIsConnected('noaccount');

      return 'noaccount';
    } catch (error) {
      setIsConnected('error');
      return 'error';
    }
  };

  const connectWallet = async () => {
    const metamask = window.ethereum;
    try {
      if (!metamask) return 'nometamask';

      const accounts = await metamask.request({
        method: 'eth_requestAccounts',
      });

      await setCurrentAccount(accounts[0]);
      return 'connected';
    } catch (error) {
      return 'error';
    }
  };

  useEffect(() => {
    getProvider();
    window.ethereum.on('chainChanged', () => {
      getProvider();
    });
  }, []);

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line
  }, [isConnected, provider]);

  return (
    <TransactionContext.Provider
      value={{
        checkIfWalletIsConnected,
        connectWallet,
        currentAccount,
        isConnected,
        setIsConnected,
        balance,
        setBalance,
        setCurrentNetwork,
        currentNetwork,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
