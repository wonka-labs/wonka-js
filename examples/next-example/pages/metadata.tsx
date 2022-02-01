import type { NextPage } from 'next';
import Image from "next/image";
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Wonka, CandyMachineState } from '@triton-labs/wonka';
import { Provider } from '@project-serum/anchor';
import { useState, useEffect, useRef } from 'react';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

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

  // 2. Fetch mints.
  useEffect(() => {
    async function fetchMints() {
      if (wonka) {
        const fetchedMints = await wonka.getCandyMachineMints()
        setMints(fetchedMints)
      }
    }
    fetchMints();
  }, [wonka]);

  function didTapContinue() {
    router.push("mint")
  }

  return (
    <div className="container flex flex-col mx-auto lg:px-48 px-20 justify-center items-center h-screen">
      <div id="latest" className="pt-10">
          <div>
            <p className="opacity-50 text-2xl pb-4">Latest Wagmiis</p>
          </div>

          {mints && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
              {mints.map((mint, index) => {
                return (
                  <div key={item.uri + index}>
                    <Image
                      width="208"
                      height="208"
                      src={item.uri}
                      alt={`wagmii profile photo.`}
                    />
                    <p className="text-2xl">{item.name}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      <div className="my-10">
        <Button title="Continue to Minting >" didTapButton={didTapContinue} />
      </div>
    </div>
  );
};

export default Mints;
