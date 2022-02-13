import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Wonka, CandyMachineState, getMintPrice } from '@triton-labs/wonka';
import { Provider } from '@project-serum/anchor';
import { useState, useEffect } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import { Windex } from '@triton-labs/wonka'

const CandyMachineState = ({ candyMachineState }: { candyMachineState: CandyMachineState }) => {
  return (
    <ul className="list-disc px-10 w-full">
      <li>
        Is Sold Out?: <b>{candyMachineState.isSoldOut ? "Yes" : "No"}</b>
      </li>
      <li>
        Items Available: <b>{candyMachineState.itemsAvailable}</b>
      </li>
      <li>
        Items Redeemed: <b>{candyMachineState.itemsRedeemed}</b>
      </li>
      <li>
        Items Remaining: <b>{candyMachineState.itemsRemaining}</b>
      </li>
      <li>
        Go Live Date: <b>{candyMachineState.goLiveDate.toUTCString()}</b>
      </li>
      <li>
        Price: <b>{getMintPrice(candyMachineState)}</b>
      </li>
    </ul>
  );
};

const StatePage: NextPage = () => {
  // State:
  const [wonka, setWonka] = useState<Wonka | null>(null);
  const [candyMachineState, setCandyMachineState] = useState<CandyMachineState>();

  // Hooks:
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const router = useRouter();

  // Sneak peak at Windex ;)
  useEffect(() => {
    console.log("foo")
    async function fetch() {
      const windex = new Windex(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!)
      const collection = await windex.fetchCollection()
      console.log(collection)
    }
    fetch()
  }, [])

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

  // 2. Fetch state.
  useEffect(() => {
    async function fetchState() {
      if (wonka) {
        const state = await wonka.getCandyMachineState();
        setCandyMachineState(state);
      }
    }
    fetchState();
  }, [wonka]);

  function didTapContinue() {
    router.push('mint');
  }

  return (
    <div className="container flex flex-col mx-auto lg:px-80 px-20 justify-center items-center h-screen">
      <h1 className="text-5xl text-center">Candy Machine State</h1>
      <p className='w-full'>
        Using <code>getCandyMachineState(...)</code> to fetch candy machine state. Useful for knowing how many mints are still available and if the candy machine is already sold out!
      </p>
      {candyMachineState ? (
        <CandyMachineState candyMachineState={candyMachineState!} />
      ) : (
        <SpinnerCircularFixed color="white" secondaryColor="#515154" className="mx-auto mt-3" />
      )}
      <div className="my-10">
        <Button title="Continue to Minting >" didTapButton={didTapContinue} />
      </div>
    </div>
  );
};

export default StatePage;
