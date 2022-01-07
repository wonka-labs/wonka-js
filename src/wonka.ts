
import { Program, Provider } from '@project-serum/anchor';
import { Keypair } from '@solana/web3.js';
import {
  CANDY_MACHINE_PROGRAM_ID,
} from './program-ids';

import { getCandyMachineMints } from './metadata-utils';
import { mintCandyMachineToken } from './minting-utils';

export class Wonka {
  private _provider: Provider
  private _candyMachineId: string
  private _candyMachineConfig: string

  public constructor(provider: Provider, candyMachineId: string, candyMachineConfig: string) {
    this._provider = provider
    this._candyMachineId = candyMachineId
    this._candyMachineConfig = candyMachineConfig
  }

  public async getCandyMachineMints() {
    return await getCandyMachineMints(
      this._candyMachineId,
      this._provider.connection
    )
  }

  public async mintCandyMachineToken(recipientWalletAddress: Keypair, treasuryAddress: string) {
    return await mintCandyMachineToken(
      this._provider.connection,
      this._provider,
      recipientWalletAddress,
      treasuryAddress,
      this._candyMachineId,
      this._candyMachineConfig
    )
  }

  public async getCandyMachineState() {
    const candyMachineProgramIDL = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_ID, this._provider);
    const candyMachineProgram = new Program(candyMachineProgramIDL!, CANDY_MACHINE_PROGRAM_ID, this._provider);
    const candyMachineAccount = await candyMachineProgram.account.candyMachine.fetch(this._candyMachineId);
    const itemsAvailable = candyMachineAccount.data.itemsAvailable.toNumber();
    const itemsRedeemed = candyMachineAccount.itemsRedeemed.toNumber();
    const itemsRemaining = itemsAvailable - itemsRedeemed;
    const goLiveData = candyMachineAccount.data.goLiveDate.toNumber();
    const goLiveDateTimeString = `${new Date(
      goLiveData * 1000
    ).toUTCString()}`
    return {
      itemsAvailable,
      itemsRedeemed,
      itemsRemaining,
      goLiveData,
      goLiveDateTimeString,
    };
  };
}