import type { ReactNode } from 'react';
import React, { useEffect } from 'react';

import { useTransactionContext } from '../context/TransactionContext';
import { Alert } from './Alert';
import { Header } from './Header';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const { isConnected, checkIfWalletIsConnected } = useTransactionContext();
  const [msg, setMsg] = React.useState('');

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (isConnected === 'nometamask') {
      setMsg('Please install Metamask');
    } else if (isConnected === 'noaccount') {
      setMsg('Please connet Metamsk');
    } else if (isConnected === 'error') {
      setMsg('Some error is occured!');
    } else {
      setMsg('');
    }
  }, [isConnected]);

  return (
    <div className="flex justify-center">
      {props.meta}
      <main className="container text-title">
        <Header />
        {msg !== '' && (
          <div className="mx-auto px-[30px]">
            <Alert msg={msg} />
          </div>
        )}
        <div className="container flex items-center justify-center p-[14px]">
          {props.children}
        </div>
      </main>
    </div>
  );
};

export { Main };
