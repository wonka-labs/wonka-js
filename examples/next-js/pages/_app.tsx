import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Head from "next/head";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { AppProps } from "next/app";
import { FC, useMemo } from "react";

require("../styles/globals.css");
require("@solana/wallet-adapter-react-ui/styles.css");

const CANDY_MACHINE_ID = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID;

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  const CandyMachineIdSetupInstructions = () => {
    return (
      <div>
        <h1 className="text-5xl text-center">Set Candy Machine ID</h1>
        <p>
          Save your candy machine ID inside <code>.env</code> under a variable called{' '}
          <code>NEXT_PUBLIC_CANDY_MACHINE_ID</code> You can use <code>.env.template</code> as a starter.
        </p>
        <p>
          Once you have set it, please <b>restart the app</b> since Next.js doesn{"'"}t fast refresh .env variables).
        </p>
      </div>
    );
  };
  if (CANDY_MACHINE_ID == undefined) {
    return (<CandyMachineIdSetupInstructions />)
  }
  return (
    <>
      <Head>
        <title>Wonka Example</title>
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

export default App;
