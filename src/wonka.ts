import { Provider } from '@project-serum/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
import { web3 } from '@project-serum/anchor';
import { getCandyMachineMints, getMintMetadata, updateMintImage, updateMintGLB } from './utils/metadata-utils';
import { mintCandyMachineToken } from './utils/minting-utils';
import { Wallet } from '@metaplex/js';
import ArweaveUploader from './arweave-uploader';
import log from 'loglevel';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import {getCandyMachineState, CandyMachineState} from './utils/state-utils';

export default class Wonka {
  private _provider: Provider;
  private _candyMachineId: PublicKey;

  public constructor(provider: Provider, candyMachineId: string) {
    this._provider = provider;
    this._candyMachineId = new web3.PublicKey(candyMachineId);
    log.info(`Initialized a Wonka with candy machine ID: ${candyMachineId}.`);
  }

  public async getCandyMachineMints(): Promise<Metadata[]> {
    return await getCandyMachineMints(this._candyMachineId.toString(), this._provider.connection);
  }

  public async mintCandyMachineToken(recipientWalletAddress: PublicKey) {
    return await mintCandyMachineToken(this._provider, this._candyMachineId, recipientWalletAddress);
  }

  public async getMintMetadata(mintAddress: PublicKey): Promise<Metadata> {
    return await getMintMetadata(this._provider.connection, mintAddress);
  }

  public static async getMintMetadata(connection: Connection, mintAddress: PublicKey) {
    return await getMintMetadata(connection, mintAddress);
  }

  public async updateMintImage(
    b64image: string,
    arweaveUploader: ArweaveUploader,
    wallet: Wallet,
    mintAddress: PublicKey,
    imageContext: any,
  ) {
    return await updateMintImage(
      b64image,
      this._provider.connection,
      arweaveUploader,
      wallet,
      mintAddress,
      imageContext,
    );
  }

  public async updateMintGLB(
    glb: ArrayBufferLike,
    b64image: string,
    arweaveUploader: ArweaveUploader,
    wallet: Wallet,
    mintAddress: PublicKey,
    imageContext: any,
  ) {
    return await updateMintGLB(
      glb,
      b64image,
      this._provider.connection,
      arweaveUploader,
      wallet,
      mintAddress,
      imageContext,
    );
  }

  public async getCandyMachineState(): Promise<CandyMachineState> {
    return await getCandyMachineState(this._provider, this._candyMachineId)
  }
}
