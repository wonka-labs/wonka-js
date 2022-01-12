import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import log from 'loglevel';

export class ArweaveUploader {
  private _arweaveKey: JWKInterface;
  private _arweave:Arweave; 

  public constructor(arweaveKey: string) {
    this._arweaveKey = JSON.parse(arweaveKey) as JWKInterface
    this._arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
  }

  public async uploadJSON(json: any) {
    const buf = Buffer.from(JSON.stringify(json));
    let transaction = await this._arweave.createTransaction({ data: buf }, this._arweaveKey);
    transaction.addTag('Content-Type', 'application/json');
    await this._arweave.transactions.sign(transaction, this._arweaveKey);
    const response = await this._arweave.transactions.post(transaction);
    const status = await this._arweave.transactions.getStatus(transaction.id)
    log.info(`Completed transaction ${transaction.id} with status code ${status.status}!`)
    return `https://www.arweave.net/${transaction.id}?ext=json`
  }

  public async uploadBase64PNG(b64string: string) {
    // #1 Convert base64 string to a binary data buffer.
    const buf = Buffer.from(b64string, 'base64');

    // #4 Check out wallet balance. We should probably fail if too low? 
    const arweaveWallet = await this._arweave.wallets.jwkToAddress(this._arweaveKey);
    const arweaveWalletBallance = await this._arweave.wallets.getBalance(arweaveWallet);

    // #5 Core flow: create a transaction, upload and wait for the status! 
    let transaction = await this._arweave.createTransaction({ data: buf }, this._arweaveKey);
    transaction.addTag('Content-Type', 'image/png');
    await this._arweave.transactions.sign(transaction, this._arweaveKey);
    const response = await this._arweave.transactions.post(transaction);
    const status = await this._arweave.transactions.getStatus(transaction.id)
    log.info(`Completed transaction ${transaction.id} with status code ${status}!`)

    // #6 This is the tricky part, use the format below to get to the PNG url! 
    return `https://www.arweave.net/${transaction.id}?ext=png`
  }
}
