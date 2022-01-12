import { Connection } from '@solana/web3.js';
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;

const getCandyMachineMints = async (candyMachineId: string, connection: Connection) => {
  const metadataAccounts = await MetadataProgram.getProgramAccounts(connection, {
    filters: [
      {
        memcmp: {
          offset:
            1 +
            32 +
            32 +
            4 +
            MAX_NAME_LENGTH +
            4 +
            MAX_URI_LENGTH +
            4 +
            MAX_SYMBOL_LENGTH +
            2 +
            1 +
            4 +
            0 * MAX_CREATOR_LEN,
          bytes: candyMachineId,
        },
      },
    ],
  });
  return await Promise.all(
    metadataAccounts.map(async (account) => {
      const accountInfo = await connection.getAccountInfo(account.pubkey);
      const metadata = new Metadata(candyMachineId.toString(), accountInfo!);
      return metadata;
    }),
  );
};

export { getCandyMachineMints };
