import React, { useEffect } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsArrowClockwise } from 'react-icons/bs';
import { IoSwapVertical } from 'react-icons/io5';
import { SlArrowLeft } from 'react-icons/sl';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import { useTransactionContext } from '../context/TransactionContext';

type Item = {
  symbol: string;
  name: string;
  address: string;
  decimals: 0;
  logoURI: string;
  id: 0;
};

const Index = () => {
  const [loading, setLoading] = React.useState<Boolean>(true);
  const [swapToken, setswapToken] = React.useState<Boolean>(false);
  const [swapFlag, setswapFlag] = React.useState<Boolean>();
  const [tokens, setTokens] = React.useState<Item[]>();
  const [sellToken, setsellToken] = React.useState<Item>();
  const [buyToken, setbuyToken] = React.useState<Item>();
  const [sellTokenNum, setSellTokenNum] = React.useState<number>();
  const [buyTokenNum, setBuyTokenNum] = React.useState<number>();
  const [sellAmount, setSellAmount] = React.useState<number>(0);
  const [buyAmount, setBuyAmount] = React.useState<number>(0);
  const { currentAccount } = useTransactionContext();

  const handleSellTokenBalance = async () => {
    if (sellToken && buyToken && currentAccount) {
      const response1 = await fetch(
        `https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${sellToken?.address}&walletAddress=${currentAccount}`
      );
      const response2 = await fetch(
        `https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${buyToken?.address}&walletAddress=${currentAccount}`
      );
      const sellTokenBalance = await response1.json();
      setSellTokenNum(Number(sellTokenBalance.allowance));
      const buyTokenBalance = await response2.json();
      setBuyTokenNum(Number(buyTokenBalance.allowance));
    }
  };

  const handleSetBuyToken = () => {
    setswapFlag(true);
    setswapToken(true);
  };

  const handleSetSelltoken = () => {
    setswapFlag(false);
    setswapToken(true);
  };

  // const handleReverse = () => {
  //   const temp = buyToken;
  //   // setSellAmount(buyAmount);
  //   setbuyToken(sellToken);
  //   setsellToken(temp);
  // };

  const handleBack = () => {
    setswapToken(false);
  };

  const handleOnSelect = (item: Item) => {
    if (swapFlag) {
      setbuyToken(item);
    } else {
      setsellToken(item);
    }
    setswapToken(false);
  };

  const formatResult = (item: Item) => {
    return (
      <div
        className="flex cursor-pointer hover:text-subtitle"
        key={item.symbol}
      >
        <img
          className="h-[30px] w-[30px]"
          src={item.logoURI}
          alt="token logo"
        />
        <span className="ml-2 flex items-center">{item.name}</span>
      </div>
    );
  };

  const getTokens = async () => {
    const response = await fetch('https://api.1inch.io/v5.0/1/tokens');
    const tokenResults = await response.json();
    const tokenArray: Item[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const i in tokenResults.tokens) {
      if (Object.hasOwn(tokenResults.tokens, i)) {
        tokenArray.push({
          ...tokenResults.tokens[i],
          ...{ id: tokenResults.tokens[i].address },
        });
      }
    }
    await setTokens(tokenArray);
    if (tokenArray?.length && tokenArray[0] && tokenArray[1]) {
      setsellToken(tokenArray[0]);
      setbuyToken(tokenArray[1]);
      setLoading(false);
    }
  };

  const handleQuoteB = async () => {
    if (sellToken && buyToken) {
      const response = await fetch(
        `https://api.1inch.io/v5.0/1/quote?fromTokenAddress=${sellToken?.address}&toTokenAddress=${buyToken?.address}&amount=${sellAmount}`
      );
      const result = await response.json();
      setBuyAmount(result.toTokenAmount);
    }
  };

  useEffect(() => {
    getTokens();
    handleQuoteB();
  }, []);

  useEffect(() => {
    handleSellTokenBalance();
  }, [sellToken, buyToken]);

  useEffect(() => {
    handleQuoteB();
  }, [sellAmount]);

  return (
    <>
      <Main meta={<Meta title="Meta swap" description="This is test task" />}>
        <div className="card card-border-gradiant relative w-[100%] max-w-[464px] rounded px-[24px] py-[30px]">
          <div
            className={`relative z-10${
              loading || swapToken ? ' opacity-0' : ''
            }`}
          >
            <div className="flex flex-row-reverse">
              <div className="cursor-pointer pr-[18px]">
                <IconContext.Provider
                  value={{
                    color: 'white',
                    className: 'global-class-name text-[20px]',
                  }}
                >
                  <AiOutlineSetting />
                </IconContext.Provider>
              </div>
              <div className="cursor-pointer pr-[18px]">
                <IconContext.Provider
                  value={{
                    color: 'white',
                    className: 'global-class-name text-[20px]',
                  }}
                >
                  <BsArrowClockwise />
                </IconContext.Provider>
              </div>
            </div>
            <div className="mt-[22px] rounded-lg bg-bgsection p-[18px] text-subtitle">
              <div className="flex justify-between text-[13px]">
                <span>~$10 921.69</span>
                <span> You buy</span>
              </div>
              <div className="mt-1 flex justify-between">
                <input
                  value={buyAmount}
                  disabled
                  className="flex w-[60%] items-center bg-[transparent] text-[24px] text-title focus:outline-0"
                />
                <div className="inline-flex">
                  <div className="mr-2 flex items-center">
                    <span className="cursor-pointer rounded-md border-[0.5px] border-bgbutton bg-bginnersection px-[10px] py-[4px] text-center text-[8px] text-title hover:bg-[#252c3e]">
                      MIN
                    </span>
                  </div>
                  <div
                    onClick={handleSetBuyToken}
                    className="flex w-[100px] cursor-pointer rounded-l-[24px] rounded-r-md bg-bginnersection px-[7px] py-[4px] text-[14px] text-title hover:bg-[#252c3e]"
                  >
                    {buyToken && (
                      <>
                        <img
                          src={buyToken.logoURI}
                          alt="logo"
                          className="h-[32px] w-[32px]"
                        />
                        <div className="flex items-center justify-center">
                          <span className="mx-2">
                            {buyToken.name.slice(0, 3)}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-center">
                      <svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.46094 6.53906C5.74219 6.84375 6.23438 6.84375 6.51562 6.53906L11.0156 2.03906C11.3203 1.75781 11.3203 1.26562 11.0156 0.984375C10.7344 0.679688 10.2422 0.679688 9.96094 0.984375L6 4.94531L2.01562 0.984375C1.73438 0.679688 1.24219 0.679688 0.960938 0.984375C0.65625 1.26562 0.65625 1.75781 0.960938 2.03906L5.46094 6.53906Z"
                          fill="#E5E5E5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-1 flex flex-row-reverse">
                <span className="text-[13px]">Balance: {sellTokenNum}</span>
              </div>
            </div>
            <div className="mt-[22px] grid grid-cols-1 divide-y">
              <hr className="h-[1px] bg-bgsection" />
              <div
                // onClick={handleReverse}
                className="swap-btn cursor-pointer hover:bg-[#252c3e]"
              >
                <IconContext.Provider
                  value={{
                    color: 'white',
                    className: 'global-class-name text-[17px]',
                  }}
                >
                  <IoSwapVertical />
                </IconContext.Provider>
              </div>
            </div>
            <div className="mt-[22px] rounded-lg bg-bgsection p-[18px] text-subtitle">
              <div className="flex justify-between text-[13px]">
                <span>~$10 921.69</span>
                <span> You sell</span>
              </div>
              <div className="mt-1 flex justify-between">
                <input
                  value={sellAmount}
                  onChange={(e: any) => setSellAmount(e.target.value)}
                  min={0}
                  type="number"
                  className="flex w-[60%] items-center bg-[transparent] text-[24px] text-title focus:outline-0"
                />
                <div className="inline-flex cursor-pointer">
                  <div
                    onClick={handleSetSelltoken}
                    className="flex w-[100px] rounded-l-[24px] rounded-r-md bg-bginnersection px-[7px] py-[4px] text-[14px] text-title hover:bg-[#252c3e]"
                  >
                    {sellToken && (
                      <>
                        <img
                          src={sellToken.logoURI}
                          alt="logo"
                          className="h-[32px] w-[32px]"
                        />

                        <div className="flex items-center justify-center">
                          <span className="mx-2">
                            {sellToken.name.slice(0, 3)}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-center">
                      <svg
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.46094 6.53906C5.74219 6.84375 6.23438 6.84375 6.51562 6.53906L11.0156 2.03906C11.3203 1.75781 11.3203 1.26562 11.0156 0.984375C10.7344 0.679688 10.2422 0.679688 9.96094 0.984375L6 4.94531L2.01562 0.984375C1.73438 0.679688 1.24219 0.679688 0.960938 0.984375C0.65625 1.26562 0.65625 1.75781 0.960938 2.03906L5.46094 6.53906Z"
                          fill="#E5E5E5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-1 flex flex-row-reverse">
                <span className="text-[13px]">Balance: {buyTokenNum}</span>
              </div>
            </div>
            <div className="mt-[22px] flex flex-wrap justify-around rounded-lg text-subtitle">
              <div className="w-[85px] rounded-md border-[0.5px] border-percentborder bg-bgsection py-[9px] text-center text-[14px]">
                25%
              </div>
              <div className="w-[85px] rounded-md border-[0.5px] border-percentborder bg-bgsection py-[9px] text-center text-[14px]">
                50%
              </div>
              <div className="w-[85px] rounded-md border-[0.5px] border-percentborder bg-bgsection py-[9px] text-center text-[14px]">
                75%
              </div>
              <div className="w-[85px] rounded-md border-[0.5px] border-percentborder bg-bgsection py-[9px] text-center text-[14px]">
                100%
              </div>
            </div>
            <div className="mt-[22px] flex justify-between rounded-md bg-bgsection p-[18px] text-[15px] text-subtitle">
              <span className="flex">
                <span className="pr-[14px]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 0C3.136 0 0 3.136 0 7C0 10.864 3.136 14 7 14C10.864 14 14 10.864 14 7C14 3.136 10.864 0 7 0ZM7.7 10.5H6.3V6.3H7.7V10.5ZM7.7 4.9H6.3V3.5H7.7V4.9Z"
                      fill="#7185AA"
                    />
                  </svg>
                </span>
                <span className="text-[15px] text-title">
                  1 ETH = 2031.21 ARB{' '}
                  <span className="text-subtitle">($2 030.4)</span>
                </span>
              </span>
              <div className="flex cursor-pointer">
                <span className="flex items-center justify-center ">
                  <span className="ml-2 mr-[10px]">$0</span>
                </span>
                <span className="flex items-center justify-center">
                  <svg
                    width="12"
                    height="7"
                    viewBox="0 0 12 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.46094 6.03906C5.74219 6.34375 6.23438 6.34375 6.51562 6.03906L11.0156 1.53906C11.3203 1.25781 11.3203 0.765625 11.0156 0.484375C10.7344 0.179688 10.2422 0.179688 9.96094 0.484375L6 4.44531L2.01562 0.484375C1.73438 0.179688 1.24219 0.179688 0.960938 0.484375C0.65625 0.765625 0.65625 1.25781 0.960938 1.53906L5.46094 6.03906Z"
                      fill="#7185AA"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="mt-[22px] w-[404px] cursor-pointer rounded-md bg-bgbutton px-[32px] py-[16px] text-center text-title hover:bg-[#cdcd42]">
                Swap
              </div>
            </div>
          </div>
          {loading && (
            <div className="absolute right-0 top-0 z-20 flex h-full w-full animate-pulse px-[24px] py-[30px]">
              <div className="h-full w-full">
                <div className="h-full animate-pulse">
                  <div className="mt-5 h-[25%] w-full rounded-md bg-bgsection"></div>
                  <div className="mt-12 h-[25%] w-full rounded-md bg-bgsection"></div>
                  <div className="mt-4 h-[10%] w-full rounded-md bg-bgsection"></div>
                  <div className="mt-10 h-[10%] w-full rounded-md bg-bgsection"></div>
                </div>
              </div>
            </div>
          )}
          {swapToken && tokens && (
            <div className="absolute right-0 top-0 z-20 h-full w-full px-[24px] py-[30px]">
              <div className="h-[25%]">
                <div onClick={handleBack} className="flex cursor-pointer">
                  <IconContext.Provider
                    value={{
                      color: 'white',
                      className: 'global-class-name text-[20px]',
                    }}
                  >
                    <SlArrowLeft />
                  </IconContext.Provider>
                  <div className="flex w-full justify-center text-center">
                    <span>Select Token</span>
                  </div>
                </div>
                <ReactSearchAutocomplete<Item>
                  items={tokens}
                  onSelect={handleOnSelect}
                  autoFocus
                  formatResult={formatResult}
                  className="relative z-50 mb-4 mt-7"
                  styling={{ backgroundColor: '#101010', color: 'white' }}
                />
              </div>

              <div className="h-[75%] w-full overflow-y-auto">
                {tokens &&
                  tokens.map((value: Item, key: number) => {
                    return (
                      <button
                        onClick={() => handleOnSelect(value)}
                        key={`tokenItem${key}`}
                        type="button"
                        className="relative inline-flex w-full cursor-pointer items-center border-b bg-[transparent] px-4 py-2 text-sm font-medium text-title hover:bg-bgsection focus:z-10 focus:ring-2"
                      >
                        <img
                          src={value.logoURI}
                          className="mr-2 h-4 w-4"
                          alt="token Item Image"
                        />
                        {value.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </Main>
    </>
  );
};
export default Index;
