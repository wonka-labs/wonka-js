import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { Wonka, CandyMachineState } from '@triton-labs/wonka';
import { Provider } from '@project-serum/anchor';
import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { ToastContainer, toast } from 'react-toastify';

function solscanMintLink(address: string, cluster: string): string {
  return `https://solscan.io/token/${address}?cluster=${cluster}`;
}

function solscanTxidLink(txid: string, cluster: string): string {
  return `https://solscan.io/tx/${txid}?cluster=${cluster}`;
}

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

enum MintState {
  READY = 0,
  QUEUED,
  MINTING,
}

namespace MintState {
  export function toString(mintState: MintState): string {
    switch (mintState) {
      case MintState.READY:
        return 'ready';
      case MintState.QUEUED:
        return 'queued';
      case MintState.MINTING:
        return 'minting';
    }
    return 'unknown';
  }
}

function toastWithMessage(message: string, error: boolean = false) {
  if (error) {
    toast.error(message, {
      position: 'bottom-center',
      pauseOnFocusLoss: false,
    });
  } else {
    toast(message, {
      position: 'bottom-center',
      pauseOnFocusLoss: false,
    });
  }
}

const StatePage: NextPage = () => {
  // State:
  const [wonka, setWonka] = useState<Wonka | null>(null);
  const [mintState, setMintState] = useState<MintState>(MintState.READY);
  const [mintAddress, setMintAddress] = useState<PublicKey>();
  const [mintTxid, setMintTxid] = useState<string>();

  // Hooks:
  const { connection } = useConnection();
  const { publicKey } = useWallet();
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
    async function mint() {
      if (wonka && mintState === MintState.QUEUED) {
        setMintState(MintState.MINTING);
        const { mintAddress: address, txid, error } = await wonka.mintCandyMachineToken(publicKey!);
        if (error) {
          toastWithMessage('Unable to mint, check logs for info.', true);
        } else {
          setMintAddress(address!);
          setMintTxid(txid);
        }
        setMintState(MintState.READY);
      }
    }
    mint();
  }, [wonka, mintState, publicKey]);

  function didTapMint() {
    setMintState(MintState.QUEUED);
  }

  function didTapContinue() {
    router.push('/mints');
  }

  return (
    <div className="container flex flex-col mx-auto lg:px-48 px-20 justify-center items-center h-screen">
      <h1 className="text-5xl text-center">Mint a New Token</h1>
      <p>
        Use <code>mintCandyMachineToken(...)</code> to mint a new token. Once successfully minted, you should see the
        token&apos;s public address and transaction ID.
      </p>
      <ul className="list-disc px-10 w-full">
        <li>
          Minter State: <b>{MintState.toString(mintState)}</b>
        </li>
        <li>
          Mint Address:{' '}
          <b>
            {mintAddress ? (
              <a href={solscanMintLink(mintAddress.toString(), 'devnet')}>{mintAddress.toString()}</a>
            ) : (
              'pending'
            )}
          </b>
        </li>
        <li>
          Mint Transaction: <b>{mintTxid ? <a href={solscanTxidLink(mintTxid, 'devnet')}>{mintTxid}</a> : 'pending'}</b>
        </li>
      </ul>
      <div className="flex flex-row space-x-3 my-10">
        <Button title="Tap to Mint" didTapButton={didTapMint} />
        <Button title="Fetch Mints >" didTapButton={didTapContinue} />
      </div>
    </div>
  );
};

export default StatePage;
