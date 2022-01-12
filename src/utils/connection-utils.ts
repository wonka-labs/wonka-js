import {
  Keypair,
  Commitment,
  Connection,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

const COMMITMENT_TYPE: Commitment = 'singleGossip'

export const sendTransaction = async (
  connection: Connection,
  wallet: any,
  instructions: TransactionInstruction[],
  signers: Keypair[]
) => {
  let transaction = new Transaction();
  instructions.forEach(instruction => transaction.add(instruction));
  transaction.recentBlockhash = (await connection.getRecentBlockhash(COMMITMENT_TYPE)).blockhash;
  transaction.feePayer = wallet.publicKey
  transaction.partialSign(...signers);
  transaction = await wallet.signTransaction(transaction);
  const txid = await connection.sendRawTransaction(transaction.serialize(), {
    skipPreflight: true,
    preflightCommitment: COMMITMENT_TYPE,
  });
  return txid;
};