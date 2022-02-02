import type { NextPage } from 'next';
import Image from 'next/image';
import { SpinnerCircularFixed } from 'spinners-react';

import { useRouter } from 'next/router';
import Button from '../components/Button';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Wonka, CandyMachineState } from '@triton-labs/wonka';
import { Provider } from '@project-serum/anchor';
import { useState, useEffect, useRef } from 'react';
import { MetadataDataData } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';

interface Mint {
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
  useEffect(() => {
    async function fetchMints() {
      if (wonka && !isFetching) {
        setIsFetching(true);
        console.log('Fetching mints...');
        const fetchedMints = await wonka.getCandyMachineMints();
        const fetchedMintsData = await Promise.all(
          fetchedMints.map(async (mint) => {
            const data = await fetch(mint.data.data.uri);
            const dataJSON = await data.json();
            return { name: dataJSON.name, imageURL: dataJSON.image };
          }),
        );
        setMints(fetchedMintsData);
        setIsFetching(false);
      }
    }
    fetchMints();
  }, [wonka, isFetching]);

  function didTapBack() {
    router.push('/mint')
  }

  function didTapContinue() {
    router.push('metadata');
  }

  return (
    <div className="container flex flex-col mx-auto lg:px-48 px-20 justify-center items-center min-h-screen">
      <div>
        <h1 className="text-5xl text-center">Fetching all Mints</h1>
        <p>
          Loading mints without using an indexer takes some time — give it a sec and we will load all existing minta via{' '}
          <code>getCandyMachineMints(..).</code>
        </p>
        {mints ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14 mt-10">
            {mints.map((mint, index) => {
              return (
                <div key={mint.imageURL}>
                  <Image width="208" height="208" src={mint.imageURL} alt={`wagmii profile photo.`} />
                  <p className="text-2xl">{mint.name}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <SpinnerCircularFixed color="white" secondaryColor="#515154" className="mx-auto mt-3" />
        )}
      </div>
      <div className="flex flex-row space-x-3 my-10">
        <Button title="< Back to Minting" didTapButton={didTapBack} />
        <Button title="Continue to Mint Metadata >" didTapButton={didTapContinue} />
      </div>
    </div>
  );
};

export default Mints;
