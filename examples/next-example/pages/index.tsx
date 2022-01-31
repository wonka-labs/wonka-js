import type { NextPage } from 'next';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Home: NextPage = () => {
  return (
    <div>
      <div>
        <h1>Welcome to Wonka</h1>
        <p>
          To get started, first you need to connect your wallet. We are using{' '}
          <a href="https://github.com/solana-labs/wallet-adapter">wallet adapter</a> from Solana Labs below, but you can
          also write you own.
        </p>
        <WalletMultiButton />
      </div>
    </div>
  );
};

export default Home;
