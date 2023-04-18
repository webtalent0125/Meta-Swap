import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const TransactionContext = React.createContext();

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [isConnected, setIsConnected] = useState();
  const [balance, setBalance] = useState(0);
  const [provider, setProvider] = useState(null);

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
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
