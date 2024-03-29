import type { NextPage } from 'next';
import Image from 'next/image';
import { SpinnerCircularFixed } from 'spinners-react';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Wonka } from '@triton-labs/wonka';
import { Provider } from '@project-serum/anchor';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Mint {
  key: string;
  name: string;
  imageURL: string;
}

const Mints: NextPage = () => {
  // State:
  const [wonka, setWonka] = useState<Wonka | null>(null);
  const [mints, setMints] = useState<Mint[]>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

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

  // 2. Fetch mints.
  useMemo(() => {
    async function fetchMints() {
      if (wonka && !mints && !isFetching) {
        setIsFetching(true);
        console.log('Fetching mints...');
        const fetchedMints = await wonka.getCandyMachineMints();
        const fetchedMintsData = await Promise.all(
          fetchedMints.map(async (metadata) => {
            const data = await fetch(metadata.data.data.uri);
            const dataJSON = await data.json();
            return { key: metadata.data.mint, name: dataJSON.name, imageURL: dataJSON.image };
          }),
        );
        setMints(fetchedMintsData);
        setIsFetching(false);
      }
    }
    fetchMints();
  }, [wonka, mints, isFetching]);

  function didTapBack() {
    router.push('/mint');
  }

  function didTapContinue() {
    router.push('/metadata');
  }

  return (
    <div className="container flex flex-col mx-auto lg:px-80 px-20 justify-center items-center min-h-screen">
      <div>
        <h1 className="text-5xl text-center mt-20">Fetching all Mints</h1>
        <p>
          Loading mints without using an indexer takes some time — give it a sec and we will load all existing minta via{' '}
          <code>getCandyMachineMints(..)</code>. Click on one of the mints to use <code>getMintMetadata(..)</code> to
          fetch mint metadata.
        </p>
        {mints ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14 mt-11">
            {mints.map((mint, index) => {
              console.log(`rendering mint with index: ${index}`);
              return (
                <Link key={mint.key} href={`/metadata?address=${mint.key}`} passHref={true}>
                  <div className='cursor-pointer'>
                    <Image width="208" height="208" src={mint.imageURL} alt={`wagmii profile photo.`} />
                    <p className="text-2xl">{mint.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <SpinnerCircularFixed color="white" secondaryColor="#515154" className="mx-auto mt-3" />
        )}
      </div>
      <div className="flex flex-row space-x-3 mt-10 mb-4">
        <Button title="Back to Minting" didTapButton={didTapBack} />
      </div>
      <p className='mb-10 italic'>Tap on one of the mints to go to metadata page.</p>
    </div>
  );
};

export default Mints;
