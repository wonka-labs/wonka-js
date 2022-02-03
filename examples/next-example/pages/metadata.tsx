import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Wonka, CandyMachineState } from '@triton-labs/wonka';
import { Provider } from '@project-serum/anchor';
import { useState, useEffect, useRef } from 'react';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';

const Mints: NextPage = () => {
  // State:
  const [wonka, setWonka] = useState<Wonka | null>(null);
  const [mints, setMints] = useState<Metadata[]>();

  // Hooks:
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const router = useRouter();

  // 1. Create Wonka.
  useEffect(() => {
    if (anchorWallet && connection) {
      const provider = new Provider(connection, anchorWallet, {
        preflightCommitment: 'processed',
      });
      setWonka(new Wonka(provider, process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!));
    } else {
      setWonka(null);
    }
  }, [anchorWallet, connection]);

  // 2. Fetch mint metadata.
  useEffect(() => {
    async function fetchMintMetadata() {
      if (!wonka) {
        return;
      }
      const mintAddressString = router.query.address;
      if (mintAddressString) {
        const mintAddress = new PublicKey(mintAddressString);
        const metadata = await wonka.getMintMetadata(mintAddress);
        console.log(metadata);
      } else {
        router.push('/mints');
      }
    }
    fetchMintMetadata();
  }, [wonka, router]);

  function didTapBack() {
    router.push('mints');
  }

  return (
    <div className="container flex flex-col mx-auto lg:px-48 px-20 justify-center items-center min-h-screen">
      <div>
        <h1 className="text-5xl text-center">Fetching Mint Metdata</h1>
        <p>
          Using <code>getMintMetadata(..)</code> to fetch more information about the mint.
        </p>
      </div>
      <div className="my-10">
        <Button title="< Back to Mints" didTapButton={didTapBack} />
      </div>
    </div>
  );
};

export default Mints;
