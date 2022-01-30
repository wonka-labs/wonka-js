"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const loglevel_1 = __importDefault(require("loglevel"));
const util_1 = __importDefault(require("util"));
const web3_js_1 = require("@solana/web3.js");
const wonka_1 = __importDefault(require("@triton-labs/wonka"));
const fs_1 = __importDefault(require("fs"));
const anchor_1 = require("@project-serum/anchor");
const node_fetch_1 = __importDefault(require("node-fetch"));
commander_1.program.version('1.1.0');
loglevel_1.default.setLevel('info');
programCommand('get-mints')
    .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
    .action((_, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    const { keypair, env, candyMachineId } = cmd.opts();
    const wonka = wonkaWithCommandOptions(keypair, env, candyMachineId);
    const mints = yield wonka.getCandyMachineMints();
    prettyPrint(`Fetched all mints from candy machine: ${candyMachineId}:`, mints);
}));
programCommand('get-state')
    .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
    .action((_, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    const { keypair, env, candyMachineId } = cmd.opts();
    const wonka = wonkaWithCommandOptions(keypair, env, candyMachineId);
    const state = yield wonka.getCandyMachineState();
    prettyPrint(`Fetched state for candy machine: ${candyMachineId}:`, state);
}));
programCommand('get-metadata')
    .option('-cmid, --candy-machine-id <string>', 'Candy Machine ID.')
    .option('-m, --mint <string>', 'base58 mint key')
    .action((_, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    const { keypair, env, candyMachineId, mint } = cmd.opts();
    const wonka = wonkaWithCommandOptions(keypair, env, candyMachineId);
    const mintAddress = new web3_js_1.PublicKey(mint);
    const mintMetadata = yield wonka.getMintMetadata(mintAddress);
    const metadataDataURIData = yield (0, node_fetch_1.default)(mintMetadata.uri);
    const metadataDataURIDataJSON = yield metadataDataURIData.json();
    prettyPrint(`Fetched metadata for mint: ${mint}:`, mintMetadata);
    prettyPrint(`Fetched metadata URI data for mint: ${mint}:`, metadataDataURIDataJSON);
}));
function wonkaWithCommandOptions(keypairFile, env, candyMachineId) {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(env));
    const loadedKeypair = loadKeypair(keypairFile);
    const payerWallet = new anchor_1.Wallet(loadedKeypair);
    const provider = new anchor_1.Provider(connection, payerWallet, {
        commitment: 'processed',
    });
    return new wonka_1.default(provider, candyMachineId);
}
function loadKeypair(keypairFile) {
    if (!keypairFile || keypairFile == '') {
        throw new Error('Keypair is required!');
    }
    const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs_1.default.readFileSync(keypairFile).toString())));
    loglevel_1.default.info(`Loaded keypair with public key: ${keypair.publicKey}.`);
    return keypair;
}
function programCommand(name) {
    return commander_1.program
        .command(name)
        .option('-e, --env <string>', 'Solana cluster env name', 'devnet')
        .option('-k, --keypair <path>', `Solana wallet location`, '--keypair not provided')
        .option('-l, --log-level <string>', 'log level', setLogLevel);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLogLevel(value) {
    if (value === undefined || value === null) {
        return;
    }
    loglevel_1.default.info('setting the log value to: ' + value);
    loglevel_1.default.setLevel(value);
}
function prettyPrint(description, obj) {
    console.log(description);
    console.log(util_1.default.inspect(obj, { colors: true, depth: 4 }));
}
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map