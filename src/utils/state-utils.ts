import { Program, Provider } from '@project-serum/anchor'
import { PublicKey} from '@solana/web3.js';
import { CANDY_MACHINE_PROGRAM_ID } from '../program-ids';
import * as anchor from '@project-serum/anchor';
import {
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export interface CandyMachineState {
  itemsAvailable: number;
  itemsRedeemed: number;
  itemsRemaining: number;
  treasury: anchor.web3.PublicKey;
  tokenMint: anchor.web3.PublicKey;
  isSoldOut: boolean;
  isActive: boolean;
  isPresale: boolean;
  goLiveDate: Date;
  price: number;
  gatekeeper: null | {
    expireOnUse: boolean;
    gatekeeperNetwork: anchor.web3.PublicKey;
  };
  endSettings: null | {
    number: anchor.BN;
    endSettingType: any;
  };
  whitelistMintSettings: null | {
    mode: any;
    mint: anchor.web3.PublicKey;
    presale: boolean;
    discountPrice: null | number;
  };
  hiddenSettings: null | {
    name: string;
    uri: string;
    hash: Uint8Array;
  };
}

const numberFormater = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatNumber = {
  format: (val?: number) => {
    if (!val) {
      return '--';
    }
    return numberFormater.format(val / LAMPORTS_PER_SOL);
  },
};

export function getMintPrice(candyMachineState: CandyMachineState): string {
  const price = formatNumber.format(
    candyMachineState.isPresale && candyMachineState.whitelistMintSettings?.discountPrice
      ? candyMachineState.whitelistMintSettings?.discountPrice!
      : candyMachineState.price!,
  );

  return `◎ ${price}`;
};

export async function getCandyMachineState(provider: Provider, candyMachineId: PublicKey): Promise<CandyMachineState> {
  const idl = await anchor.Program.fetchIdl(CANDY_MACHINE_PROGRAM_ID, provider);
  const program = new anchor.Program(idl!, CANDY_MACHINE_PROGRAM_ID, provider);
  const state: any = await program.account.candyMachine.fetch(candyMachineId);
  const itemsAvailable = state.data.itemsAvailable.toNumber();
  const itemsRedeemed = state.itemsRedeemed.toNumber();
  const itemsRemaining = itemsAvailable - itemsRedeemed;
  const presale =
    state.data.whitelistMintSettings &&
    state.data.whitelistMintSettings.presale &&
    (!state.data.goLiveDate || state.data.goLiveDate.toNumber() > new Date().getTime() / 1000);
  const isActive =
    (presale || state.data.goLiveDate?.toNumber() < new Date().getTime() / 1000) &&
    (state.data.endSettings
      ? state.data.endSettings.endSettingType.date
        ? state.data.endSettings.number.toNumber() > new Date().getTime() / 1000
        : itemsRedeemed < state.data.endSettings.number.toNumber()
      : true);
  const goLiveDate = new Date(state.data.goLiveDate.toNumber() * 1000);
  const price = state.data.price.toNumber();
  const whitelistMintSettings = state.data.whitelistMintSettings
  if (whitelistMintSettings && whitelistMintSettings.discountPrice) {
    whitelistMintSettings.discountPrice = whitelistMintSettings.discountPrice.toNumber()
  }
  return {
    itemsAvailable,
    itemsRedeemed,
    itemsRemaining,
    isSoldOut: itemsRemaining === 0,
    isActive,
    isPresale: presale,
    goLiveDate,
    treasury: state.wallet,
    tokenMint: state.tokenMint,
    gatekeeper: state.data.gatekeeper,
    endSettings: state.data.endSettings,
    whitelistMintSettings,
    hiddenSettings: state.data.hiddenSettings,
    price,
  };
}