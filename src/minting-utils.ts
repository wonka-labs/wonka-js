
import { Program, Provider, web3 } from '@project-serum/anchor';
import { PublicKey, Keypair, TransactionInstruction } from '@solana/web3.js';
import { Token } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { sendTransactions } from './connection'
import {
  MintLayout,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import {
  Metadata,
  MasterEdition
} from '@metaplex-foundation/mpl-token-metadata';
import {
  CANDY_MACHINE_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from './program-ids';

const _getTokenWallet = async (wallet: PublicKey, mint: PublicKey) => {
  return (
    await web3.PublicKey.findProgramAddress(
      [
        wallet.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
};

const _getCandyMachineCreator = async (
  candyMachine: anchor.web3.PublicKey,
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM_ID,
  );
};

const _getWarningMesssage = (error: any) => {
  if (error.msg) {
    if (error.code === 311) {
      return `All mints have been sold out.`;
    } else if (error.code === 312) {
      return `Minting period hasn't started yet.`;
    }
  } else {
    if (error.message.indexOf('0x138')) {
      return 'Minting failed! Please try again!';
    } else if (error.message.indexOf('0x137')) {
      return `All mints have been sold out.`;
    } else if (error.message.indexOf('0x135')) {
      return `Insufficient funds to mint. Please fund your wallet.`;
    }
  }
  return 'Minting failed! Please try again!';
}

const _createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new web3.TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

const _mintCandyMachineToken = async (
  provider: Provider,
  candyMachineAddress: PublicKey,
  recipientWalletAddress: Keypair,
) => {
  const mint = Keypair.generate();
  const candyMachineProgramIDL = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_ID, provider);
  const candyMachineProgram = new Program(candyMachineProgramIDL!, CANDY_MACHINE_PROGRAM_ID, provider);
  const userTokenAccountAddress = await _getTokenWallet(
    recipientWalletAddress.publicKey,
    mint.publicKey,
  );
  const candyMachine: any = await candyMachineProgram.account.candyMachine.fetch(
    candyMachineAddress,
  );
  const remainingAccounts: TransactionInstruction[] = [];
  const signers: anchor.web3.Keypair[] = [mint];
  const cleanupInstructions: TransactionInstruction[] = [];
  const instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: recipientWalletAddress.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MintLayout.span,
      lamports:
        await candyMachineProgram.provider.connection.getMinimumBalanceForRentExemption(
          MintLayout.span,
        ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      recipientWalletAddress.publicKey,
      recipientWalletAddress.publicKey,
    ),
    _createAssociatedTokenAccountInstruction(
      userTokenAccountAddress,
      recipientWalletAddress.publicKey,
      recipientWalletAddress.publicKey,
      mint.publicKey,
    ),
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccountAddress,
      recipientWalletAddress.publicKey,
      [],
      1,
    ),
  ];
  const metadataAddress = await Metadata.getPDA(mint.publicKey);
  const masterEdition = await MasterEdition.getPDA(mint.publicKey);
  const [candyMachineCreator, creatorBump] = await _getCandyMachineCreator(
    candyMachineAddress,
  );

  instructions.push(
    // @ts-ignore
    await candyMachineProgram.instruction.mintNft(creatorBump, {
      accounts: {
        candyMachine: candyMachineAddress,
        candyMachineCreator,
        payer: recipientWalletAddress.publicKey,
        wallet: candyMachine.wallet,
        mint: mint.publicKey,
        metadata: metadataAddress,
        masterEdition,
        mintAuthority: recipientWalletAddress.publicKey,
        updateAuthority: recipientWalletAddress.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        recentBlockhashes: anchor.web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      remainingAccounts:
        remainingAccounts.length > 0 ? remainingAccounts : undefined,
    }),
  );

  return (
    await sendTransactions(
      provider.connection,
      recipientWalletAddress,
      [instructions, cleanupInstructions],
      [signers, []],
    )
  )
}

const mintCandyMachineToken = async (
  provider: Provider,
  candyMachineAddress: PublicKey,
  recipientWalletAddress: Keypair,
) => {
  try {
    const txid = await _mintCandyMachineToken(provider, candyMachineAddress, recipientWalletAddress)
    console.log(txid)
    // return new Promise(resolve => {
    //   provider.connection.onSignatureWithOptions(
    //     txid,
    //     async (notification, context) => {
    //       if (notification.type === 'status') {
    //         const { result } = notification;
    //         if (!result.err) {

    //           resolve(txid)
    //         }
    //       }
    //     },
    //     { commitment: 'processed' }
    //   );
    // })
  } catch (error: any) {
    const message = _getWarningMesssage(error)
    return { error, message }
  }
}

export {
  mintCandyMachineToken,
  _getWarningMesssage
};