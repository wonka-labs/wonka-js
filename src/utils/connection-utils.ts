import { AnchorProvider as Provider } from '@project-serum/anchor';
import { Keypair, Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js';

export const sendTransaction = async (
  provider: Provider,
  feePayer: PublicKey,
  instructions: TransactionInstruction[],
  signers: Keypair[],
) => {
  const transaction = new Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));
  transaction.recentBlockhash = (await provider.connection.getRecentBlockhash()).blockhash;
  transaction.feePayer = feePayer;
  transaction.partialSign(...signers);
  return await provider.sendAndConfirm(transaction, signers, {
    skipPreflight: false,
  });
};
