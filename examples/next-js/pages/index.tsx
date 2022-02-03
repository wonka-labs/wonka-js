import type { NextPage } from 'next';
import Button from '../components/Button';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push('/state')
    }
  }, [connected, router])

  function didTapAuthenticate() {
    setVisible(true)
  }

  return (
    <div className="container flex flex-col mx-auto lg:px-80 px-20 justify-center items-center min-h-screen">
      <h1 className="text-5xl text-center pb-4">Welcome to Wonka</h1>
      <p>
        Wonka JS simplifies the minting process with MetaPlex{"'"}s Candy Machine. Once you have followed the
        instructions to upload your NFTs, you can easily use the following commands to build your mint flow:{' '}
      </p>
      <div className='w-full'>
        <ul className="list-disc px-10">
          <li>
            <code>getCandyMachineState(..)</code>
          </li>
          <li>
            <code>mintCandyMachineToken(..)</code>
          </li>
          <li>
            <code>getCandyMachineMints(..)</code>
          </li>
          <li>
            <code>getMintMetadata(..)</code>
          </li>
        </ul>
      </div>
      <p className='pb-10'>
        To get started, first you need to connect your wallet. We are using{' '}
        <a href="https://github.com/solana-labs/wallet-adapter">wallet adapter</a> from Solana Labs below, but you can
        also write you own.
      </p>

      <Button title="Connect Wallet to Continue" didTapButton={didTapAuthenticate} />
    </div>
  );
};

export default Home;
