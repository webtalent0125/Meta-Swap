import '../styles/global.css';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const use = async () => {
      /* eslint-disable-next-line */
      (await import('tw-elements')).default;
    };
    use();
  }, []);
  return <Component {...pageProps} />;
};

export default MyApp;
