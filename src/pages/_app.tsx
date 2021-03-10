import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

// Cache
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Styles
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'theme';

// Fontawesome imports
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
faConfig.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import Layout from 'components/Layout';

export const cache = createCache({ key: 'css', prepend: true });

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  const showLayout = () => {
    return (<Layout><Component {...pageProps} /></Layout>);
  }

  return (
    <CacheProvider value={cache}>
      <Head>
        <title>Gestão de Estoque</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
          { showLayout() }
      </ThemeProvider>
    </CacheProvider>
  );
}
