import { web3 } from '@project-serum/anchor';

/**
 * We get these numbers from the CLI scripts source:
 * https://github.com/metaplex-foundation/metaplex/blob/master/js/packages/cli/src/helpers/constants.ts
 */
const CANDY_MACHINE_PROGRAM_ID = new web3.PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');
const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export { CANDY_MACHINE_PROGRAM_ID, TOKEN_METADATA_PROGRAM_ID, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID };
