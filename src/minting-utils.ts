
import { Program, Provider, web3 } from '@project-serum/anchor';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Token } from '@solana/spl-token';
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

const mintCandyMachineToken = async (
  connection: Connection,
  provider: Provider,
  recipientWalletAddress: Keypair,
  treasuryAddress: string,
  candyMachineId: string,
  candyMachineConfig: string) => {
  try {
    const config = new web3.PublicKey(candyMachineConfig);
    const mint = web3.Keypair.generate();
    const tokenPDA = await getTokenWallet(recipientWalletAddress, mint)
    const metadataPDA = await Metadata.getPDA(mint.publicKey);
    const masterEdition = await MasterEdition.getPDA(mint.publicKey);
    const rent = await connection.getMinimumBalanceForRentExemption(
      MintLayout.span
    );
    const accounts = {
      config,
      candyMachine: candyMachineId,
      payer: recipientWalletAddress.publicKey,
      wallet: treasuryAddress,
      mint: mint.publicKey,
      metadata: metadataPDA,
      masterEdition,
      mintAuthority: recipientWalletAddress.publicKey,
      updateAuthority: recipientWalletAddress.publicKey,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      clock: web3.SYSVAR_CLOCK_PUBKEY,
    };
    const signers = [mint];
    const instructions = [
      web3.SystemProgram.createAccount({
        fromPubkey: recipientWalletAddress.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports: rent,
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0,
        recipientWalletAddress.publicKey,
        recipientWalletAddress.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        tokenPDA,
        recipientWalletAddress.publicKey,
        recipientWalletAddress.publicKey,
        mint.publicKey
      ),
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        tokenPDA,
        recipientWalletAddress.publicKey,
        [],
        1
      ),
    ];
    const candyMachineProgramIDL = await Program.fetchIdl(CANDY_MACHINE_PROGRAM_ID, provider);
    const candyMachineProgram = new Program(candyMachineProgramIDL!, CANDY_MACHINE_PROGRAM_ID, provider);
    // @ts-ignore
    const txn = await candyMachineProgram.rpc.mintNft({
      accounts,
      signers,
      instructions,
    });
    return new Promise(resolve => {
      connection.onSignatureWithOptions(
        txn,
        async (notification, context) => {
          if (notification.type === 'status') {
            const { result } = notification;
            if (!result.err) {
              // NFT got minted!
              resolve(txn)
            }
          }
        },
        { commitment: 'processed' }
      );
    })
  } catch (error: any) {
    const message = _getWarningMesssage(error)
    return { error, message }
  }
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

const getTokenWallet = async (wallet: Keypair, mint: Keypair) => {
  return (
    await web3.PublicKey.findProgramAddress(
      [
        wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
};

const createAssociatedTokenAccountInstruction = (
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

export {
  mintCandyMachineToken,
  _getWarningMesssage
};