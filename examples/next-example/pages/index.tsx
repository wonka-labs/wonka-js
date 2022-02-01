import type { NextPage } from 'next';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Home: NextPage = () => {
  return (
    <div className="container flex mx-auto lg:px-48 px-20 justify-center items-center h-screen">
      <div>
        <h1 className="text-5xl text-center">Welcome to Wonka</h1>
        <p>
          Wonka JS simplifies the minting process with MetaPlex{"'"}s Candy Machine. Once you have followed the
          instructions to upload your NFTs, you can easily use the following commands to build your mint flow:{' '}
        </p>
        <ul className="list-disc px-10">
          <li>
            <code>mintCandyMachineToken(..)</code>
          </li>
          <li>
            <code>getCandyMachineMints(..)</code>
          </li>
          <li>
            <code>getCandyMachineState(..)</code>
          </li>
          <li>
            <code>getMintMetadata(..)</code>
          </li>
        </ul>
        <p>
          To get started, first you need to connect your wallet. We are using{' '}
          <a href="https://github.com/solana-labs/wallet-adapter">wallet adapter</a> from Solana Labs below, but you can
          also write you own.
        </p>
        <p className="text-center">
          <WalletMultiButton />
        </p>
      </div>
    </div>
  );
};

export default Home;
