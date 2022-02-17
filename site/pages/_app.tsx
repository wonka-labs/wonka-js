import DEFAULT_APP_SEO from "../next-seo.config";
import { DefaultSeo } from "next-seo";
import mixpanel from "mixpanel-browser";
import Head from "next/head";

import { AppProps } from "next/app";
import { FC } from "react";

require("../styles/globals.css");

mixpanel.init("71433a4be2ceb100976ad7b2ad8e7f70", {
  debug: process.env.NODE_ENV === "development",
});

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <DefaultSeo {...DEFAULT_APP_SEO} />
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
