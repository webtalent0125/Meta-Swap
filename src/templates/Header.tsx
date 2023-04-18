import { Dropdown } from '@nextui-org/react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import React, { useContext, useEffect } from 'react';

import logo from '../../public/assets/images/logo.png';
import eth from '../../public/assets/images/networks/1.png';
import bnb from '../../public/assets/images/networks/2.png';
import pol from '../../public/assets/images/networks/3.png';
import aur from '../../public/assets/images/networks/4.png';
import { TransactionContext } from '../context/TransactionContext';

declare global {
  interface Window {
    ethereum?: any;
  }
}
interface Network {
  label: string;
  logo?: string | StaticImageData;
  chainId: string;
}

const networks: Network[] = [
  {
    label: 'Ethereum',
    logo: eth,
    chainId: '0x1',
  },
  {
    label: 'BNB Chain',
    logo: bnb,
    chainId: '0x38',
  },
  {
    label: 'Polygon',
    logo: pol,
    chainId: '0x89',
  },
  {
    label: 'Optimism',
    logo: aur,
    chainId: '0xa',
  },
];

const Header = () => {
  const [selected, setSelected] = React.useState<string>();
  const [currentAddress, setCurrentAddress] = React.useState<string>();
  const {
    isConnected,
    connectWallet,
    setIsConnected,
    currentAccount,
    balance,
    setCurrentNetwork,
    currentNetwork,
  } = useContext<any>(TransactionContext);

  const getCurrentChain = async () => {
    const hex = Number(window.ethereum.networkVersion).toString(16);
    const chainId = await networks.filter(
      (value: Network) => value.chainId === `0x${hex}`
    );
    setSelected(chainId[0]?.label);
  };

  const switchNetwork = async (switchedNetwork: Network) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: switchedNetwork.chainId }],
    });
  };

  useEffect(() => {
    if (currentAccount) {
      setCurrentAddress(
        `${currentAccount.slice(0, 6)}...${currentAccount.slice(
          currentAccount.length - 4,
          currentAccount.length
        )}`
      );
    }
  }, [currentAccount]);

  useEffect(() => {
    if (selected) {
      const tempNetwork: Network[] = networks.filter(
        (value) => value.label === selected
      );
      if (tempNetwork[0]) {
        switchNetwork(tempNetwork[0]);
      }
      setCurrentNetwork(tempNetwork[0]);
    }
  }, [selected]);

  useEffect(() => {
    getCurrentChain();
  }, []);

  const handleNetworkChange = async (e: any) => {
    setSelected(e.currentKey);
  };

  const handleConnect = () => {
    connectWallet().then((res: string) => {
      if (res === 'nometamask') {
        setIsConnected(res);
      } else if (res === 'error') {
        setIsConnected(res);
      } else {
        setIsConnected(res);
      }
    });
  };

  return (
    <nav>
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-[14px]">
        <div className="flex items-center">
          <Image className="h-[70px] w-[70px]" src={logo} alt="1linch Logo" />
        </div>
        <div className="flex items-center md:order-2">
          <Dropdown>
            <Dropdown.Button
              id="switchnetwork"
              className="min-h-[47px] rounded-[7px!important] bg-[#c1c116!important]"
            >
              <div className="flex">
                <span className="flex items-center text-center">
                  {currentNetwork && currentNetwork.logo && (
                    <Image
                      id="currentlogo"
                      className="h-[25px] w-[25px]"
                      src={currentNetwork.logo}
                      alt="network"
                    ></Image>
                  )}
                </span>
                <span className="ml-2 flex items-center text-center">
                  {currentNetwork?.label}
                </span>
              </div>
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Single selection actions"
              color="secondary"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selected}
              onSelectionChange={(e) => handleNetworkChange(e)}
            >
              {networks.map((value: any) => {
                return (
                  <Dropdown.Item key={value.label} textValue={value.label}>
                    <span className="flex">
                      <Image
                        className="h-[25px] w-[25px]"
                        src={value.logo}
                        alt="network"
                      ></Image>
                      <span className="ml-2 flex items-center text-center">
                        {value.label}
                      </span>
                    </span>
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <span className="ml-2 rounded-md bg-bgsection px-[32px] py-[16px] text-[15px] text-subtitle">
            {balance}
          </span>
          {currentAddress && (
            <span className="ml-2 rounded-md bg-bgsection px-[32px] py-[16px] text-[15px] text-subtitle">
              {currentAddress}
            </span>
          )}
          {isConnected === 'noaccount' && (
            <button
              onClick={() => handleConnect()}
              className="ml-2 cursor-pointer rounded-md bg-bgbutton px-[32px] py-[16px] text-center text-title hover:bg-[#cdcd42]"
            >
              Connet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export { Header };
