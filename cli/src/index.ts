import { program } from 'commander';
import log from 'loglevel';
import util from 'util';
import { clusterApiUrl, Cluster, PublicKey, Connection, Keypair } from '@solana/web3.js';
import Wonka from '@triton-labs/wonka';
import fs from 'fs';
import { Provider, Wallet } from '@project-serum/anchor';
import fetch from 'node-fetch';

program.version('1.1.0');
log.setLevel('info');

programCommand('get-mints')
  .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
  .action(async (_, cmd) => {
    const { keypair, env, candyMachineId } = cmd.opts();
    const wonka = wonkaWithCommandOptions(keypair, env, candyMachineId);
    const mints = await wonka.getCandyMachineMints();
    prettyPrint(`Fetched all mints from candy machine: ${candyMachineId}:`, mints)
  });

programCommand('get-state')
  .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
  .action(async (_, cmd) => {
    const { keypair, env, candyMachineId } = cmd.opts();
    const wonka = wonkaWithCommandOptions(keypair, env, candyMachineId);
    const state = await wonka.getCandyMachineState();
    prettyPrint(`Fetched state for candy machine: ${candyMachineId}:`, state)
  });

programCommand('get-metadata')
  .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
  .option('-m, --mint <string>', 'base58 mint key')
  .action(async (_, cmd) => {
    const { keypair, env, candyMachineId, mint } = cmd.opts();
    const wonka = wonkaWithCommandOptions(keypair, env, candyMachineId);
    const mintAddress = new PublicKey(mint);
    const mintMetadata = await wonka.getMintMetadata(mintAddress);
    const metadataDataURIData = await fetch(mintMetadata.uri);
    const metadataDataURIDataJSON = await metadataDataURIData.json();
    prettyPrint(`Fetched metadata for mint: ${mint}:`, mintMetadata)
    prettyPrint(`Fetched metadata URI data for mint: ${mint}:`, metadataDataURIDataJSON)
  });

function wonkaWithCommandOptions(keypairFile: string, env: Cluster, candyMachineId: string): Wonka {
  const connection = new Connection(clusterApiUrl(env));
  const loadedKeypair = loadKeypair(keypairFile);
  const payerWallet = new Wallet(loadedKeypair);
  const provider = new Provider(connection, payerWallet, {
    commitment: 'processed',
  });
  return new Wonka(provider, candyMachineId);
}

function loadKeypair(keypairFile): Keypair {
  if (!keypairFile || keypairFile == '') {
    throw new Error('Keypair is required!');
  }
  const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())));
  log.info(`Loaded keypair with public key: ${keypair.publicKey}.`);
  return keypair;
}

function programCommand(name: string) {
  return program
    .command(name)
    .option(
      '-e, --env <string>',
      'Solana cluster env name',
      'devnet', //mainnet-beta, testnet, devnet
    )
    .option('-k, --keypair <path>', `Solana wallet location`, '--keypair not provided')
    .option('-l, --log-level <string>', 'log level', setLogLevel);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLogLevel(value) {
  if (value === undefined || value === null) {
    return;
  }
  log.info('setting the log value to: ' + value);
  log.setLevel(value);
}

function prettyPrint(description: string, obj: any) {
  console.log(description)
  console.log(util.inspect(obj, {colors: true, depth: 4}))
}

program.parse(process.argv);
