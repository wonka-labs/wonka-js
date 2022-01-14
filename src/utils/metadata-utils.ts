import { Connection, PublicKey } from '@solana/web3.js';
import { Metadata, MetadataProgram, MetadataDataData } from '@metaplex-foundation/mpl-token-metadata';
import { Wallet, actions} from '@metaplex/js';
import { ArweaveUploader } from '../arweave-uploader';
import log from 'loglevel';

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

const getMintMetadata = async (connection: Connection, mintAddress: string): Promise<MetadataDataData> => {
  const metadataPDA = await Metadata.getPDA(mintAddress);
  const metaData = await Metadata.load(connection, metadataPDA);
  return metaData.data.data as MetadataDataData
}

const updateMintURI = async (
  connection: Connection, 
  arweaveUploader: ArweaveUploader,
  wallet: Wallet, 
  mintKey: string, 
  mintURI: string,
  imageContext: any) => {
  const metadataData = await getMintMetadata(connection, mintKey)
  const metadataDataData = await fetch(metadataData.uri)
  const metadataDataDataJSON = await metadataDataData.json()
  metadataDataDataJSON.image = mintURI
  metadataDataDataJSON.properties.files[0].uri = mintURI
  metadataDataDataJSON.imageContext = imageContext
  const metadataDataDataJSONArweaveURI = await arweaveUploader.uploadJSON(metadataDataDataJSON)
  metadataData.uri = metadataDataDataJSONArweaveURI
  const txid = await actions.updateMetadata({
    connection, 
    editionMint: new PublicKey(mintKey),
    wallet,
    newMetadataData: metadataData,
  })
  log.info(`Starting update metadata transaction with id:${txid}.`)
  return new Promise((resolve, reject) => {
    connection.onSignatureWithOptions(
      txid,
      async (notification, context) => {
        log.info(`Got notification of type: ${notification.type} from txid: ${txid}.`);
        if (notification.type === 'status') {
          const { result } = notification;
          if (result.err) {
            reject({ txid, error: result.err });
          } else {
            resolve(txid)
          }
        }
      },
      { commitment: 'processed' },
    );
  });
}

const updateMintImage = async (
  b64image: string,
  connection: Connection, 
  arweaveUploader: ArweaveUploader,
  wallet: Wallet, 
  mintAddress: string,
  imageContext: any) => { 
    const uri = await arweaveUploader.uploadBase64PNG(b64image)
    return updateMintURI(connection, arweaveUploader, wallet, mintAddress, uri, imageContext)
}

export { 
  getCandyMachineMints,
  getMintMetadata,
  updateMintURI,
  updateMintImage
 };
