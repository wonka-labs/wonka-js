import { Provider } from '@project-serum/anchor';
import { Keypair, Commitment, Connection, Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js';

const COMMITMENT_TYPE: Commitment = 'singleGossip';

export const sendTransaction = async (
  provider: Provider,
  feePayer: PublicKey,
  instructions: TransactionInstruction[],
  signers: Keypair[],
) => {
  let transaction = new Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));
  transaction.recentBlockhash = (await provider.connection.getRecentBlockhash(COMMITMENT_TYPE)).blockhash;
  transaction.feePayer = feePayer;
  transaction.partialSign(...signers);
  return await provider.send(transaction, signers, {
    skipPreflight: true,
    preflightCommitment: COMMITMENT_TYPE,
  });
};
