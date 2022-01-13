import { Program, Provider } from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { CANDY_MACHINE_PROGRAM_ID } from './program-ids';
import { web3 } from '@project-serum/anchor';
import { getCandyMachineMints, getMintMetadata, updateMintImage } from './utils/metadata-utils';
import { mintCandyMachineToken } from './utils/minting-utils';
import { Wallet } from '@metaplex/js';
import { ArweaveUploader } from './arweave-uploader'

export class Wonka {
  private _provider: Provider;
  private _candyMachineId: PublicKey;

  public constructor(provider: Provider, candyMachineId: string) {
    this._provider = provider;
    this._candyMachineId = new web3.PublicKey(candyMachineId);
  }

  public async getCandyMachineMints() {
    return await getCandyMachineMints(this._candyMachineId.toString(), this._provider.connection);
  }

  public async mintCandyMachineToken(recipientWalletAddress: Keypair) {
    return await mintCandyMachineToken(this._provider, this._candyMachineId, recipientWalletAddress);
  }

  public async getMintMetadata(mintAddress: string) {
    return await getMintMetadata(this._provider.connection, mintAddress)
  }

  public async updateMintImage(b64image: string,
    arweaveUploader: ArweaveUploader,
    wallet: Wallet, 
    mintAddress: string,
    imageContext: any) {
    return await updateMintImage(b64image, 
      this._provider.connection, 
      arweaveUploader, 
      wallet, 
      mintAddress, 
      imageContext)
  }

  public async getCandyMachineState() {
    const candyMachineProgramIDL = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_ID, this._provider);
    const candyMachineProgram = new Program(candyMachineProgramIDL!, CANDY_MACHINE_PROGRAM_ID, this._provider);
    const candyMachineAccount = await candyMachineProgram.account.candyMachine.fetch(this._candyMachineId);
    const itemsAvailable = candyMachineAccount.data.itemsAvailable.toNumber();
    const itemsRedeemed = candyMachineAccount.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;
    const goLiveData = candyMachineAccount.data.goLiveDate.toNumber();
    const goLiveDateTimeString = `${new Date(goLiveData * 1000).toUTCString()}`;
    return {
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      goLiveData,
      goLiveDateTimeString,
    };
  }
}
