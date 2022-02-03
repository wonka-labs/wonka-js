import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { SpinnerCircularFixed } from 'spinners-react';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Wonka, CandyMachineState } from '@triton-labs/wonka';
import { Provider } from '@project-serum/anchor';
import { useState, useEffect, useRef } from 'react';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';

interface Mint {
  key: string;
  name: string;
  imageURL: string;
}

const Mints: NextPage = () => {
  // State:
  const [wonka, setWonka] = useState<Wonka | null>(null);
  const [mintMetadata, setMintMetadata] = useState<Metadata>();
  const [mint, setMint] = useState<Mint>();

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
        const data = await (await fetch(metadata.data.data.uri)).json();
        setMintMetadata(metadata);
        setMint({ key: metadata.data.mint, name: data.name, imageURL: data.image });
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
    <div className="container flex flex-col mx-auto lg:px-80 px-20 justify-center items-center min-h-screen">
      <h1 className="text-5xl text-center">Fetching Mint Metdata</h1>
      <p className='mb-3'>
        Using <code>getMintMetadata(..)</code> to fetch more information about the mint.
      </p>
      {mint && mintMetadata ? (
        <div className="grid grid-cols-2 w-full">
          <ul>
            <li>
              Name: <b>{mint.name}</b>
            </li>
            <li>
              Symbol: <b>{mintMetadata.data.data.symbol ?? "undefined"}</b>
            </li>
            <li>
              Collection: <b>{mintMetadata.data.collection ?? "undefined"}</b>
            </li>
            <li>
              Primary Sale Happened: <b>{mintMetadata.data.primarySaleHappened ? 'YES' : 'NO'}</b>
            </li>
            <li>
              Is Mutable: <b>{mintMetadata.data.isMutable ? 'YES' : 'NO'}</b>
            </li>
            <li>
              Number of Creators: <b>{mintMetadata.data.data.creators!.length}</b>
            </li>
            <li>
              Seller Fee Basis Points: <b>{mintMetadata.data.data.sellerFeeBasisPoints}</b>
            </li>
          </ul>
          <div className="relative aspect-square mx-auto">
            <Image width="348" height="348" src={mint.imageURL} alt={`wagmii profile photo.`} />
          </div>
        </div>
      ) : (
        <SpinnerCircularFixed color="white" secondaryColor="#515154" className="mx-auto mt-3" />
      )}
      <div className='mt-10'>
      <Button title="< Back to Mints" didTapButton={didTapBack} />
      </div>
    </div>
  );
};

export default Mints;
