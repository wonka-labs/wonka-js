import { PublicKey } from '@solana/web3.js';
import { CANDY_MACHINE_PROGRAM_ID } from '../program-ids';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

const getCandyMachineCreator = async (candyMachine: PublicKey): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM_ID,
  );
};

const getTokenWallet = async (wallet: PublicKey, mint: PublicKey) => {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )
  )[0];
};

export {getCandyMachineCreator, getTokenWallet}