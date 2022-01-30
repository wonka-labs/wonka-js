import { program } from 'commander';
import log from 'loglevel';
import { clusterApiUrl, Cluster } from '@solana/web3.js';
import Wonka from '@triton-labs/wonka';
import fs from 'fs';
import { Connection } from '@solana/web3.js';
import { Provider, Wallet } from '@project-serum/anchor';
import { Keypair } from '@solana/web3.js';

program.version('1.1.0');
log.setLevel('info');
programCommand('mints')
  .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
  .action(async (directory, cmd) => {
    const { keypair, env, candyMachineId } = cmd.opts();
    const connection = new Connection(clusterApiUrl(env));
    const loadedKeypair = loadKeypair(keypair);
    const payerWallet = new Wallet(loadedKeypair);
    const provider = new Provider(connection, payerWallet, {
      commitment: 'processed',
    });

    console.log(candyMachineId);
    const wonka = new Wonka(provider, candyMachineId);
    const mints = await wonka.getCandyMachineMints();
    console.log(mints);
  });

programCommand('get-mints')
  .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
  .action(async (_, cmd) => {
    const { keypair, env, candyMachineId } = cmd.opts();
    const wonka = wonkaWithCommandOptions(keypair, env, candyMachineId);
    const mints = await wonka.getCandyMachineMints();
    console.log(mints);
  });

programCommand('get-state')
  .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
  .action(async (_, cmd) => {
    const { keypair, env, candyMachineId } = cmd.opts();
    const wonka = wonkaWithCommandOptions(keypair, env, candyMachineId);
    const state = await wonka.getCandyMachineState();
    console.log(state);
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

program.parse(process.argv);
