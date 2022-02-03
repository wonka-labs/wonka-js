import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Wonka, CandyMachineState } from '@triton-labs/wonka';
import { Provider } from '@project-serum/anchor';
import { useState, useEffect, useRef } from 'react';

const CandyMachineState = ({ candyMachineState }: { candyMachineState: CandyMachineState }) => {
  return (
    <div>
      <h1 className="text-5xl text-center">Fetching Candy Machine State</h1>
      <p>
        Used <code>getCandyMachineState(...)</code> to fetch candy machine state.
      </p>
      <ul className="list-disc px-10">
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
      </ul>
    </div>
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
    router.push("mint")
  }

  return (
    <div className="container flex flex-col mx-auto lg:px-48 px-20 justify-center items-center h-screen">
      {candyMachineState && <CandyMachineState candyMachineState={candyMachineState!} />}
      <div className="my-10">
        <Button title="Continue to Minting >" didTapButton={didTapContinue} />
      </div>
    </div>
  );
};

export default StatePage;
