import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import log from 'loglevel';

export function _sanitizeB64String(b64string: string) {
  const pngHTMLB64StringPrefix = "data:image/png;base64,"
  if (b64string.startsWith(pngHTMLB64StringPrefix)) {
    return b64string.slice(pngHTMLB64StringPrefix.length).trim()
  }
  return b64string
}

/**
 * Probably worth at one point to extract this out as a separate NPM.
 * Specifically the purpose is to provide easy ways to upload specific 
 * file types to Arweave i.e. PNG, JSON...
 */
export default class ArweaveUploader {
  private _arweaveKey: JWKInterface;
  private _arweave: Arweave; 

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
    return await this.uploadBuffer(buf, 'application/json', 'json');
  }

  public async uploadBase64PNG(b64string: string) {
    const buf = Buffer.from(_sanitizeB64String(b64string), 'base64');
    return await this.uploadBuffer(buf, 'image/png', 'png');
  }

  public async uploadBuffer(buf: ArrayBufferLike, mimeType: string, arweaveExt?: string): Promise<string> {
    console.log('uploadBuffer', mimeType, arweaveExt);
    const transaction = await this._arweave.createTransaction({ data: buf }, this._arweaveKey);
    transaction.addTag('Content-Type', mimeType);
    await this._arweave.transactions.sign(transaction, this._arweaveKey);
    const response = await this._arweave.transactions.post(transaction);
    const status = await this._arweave.transactions.getStatus(transaction.id)
    log.info(`Completed transaction ${transaction.id} with status code ${status.status}!`)
    const ext = arweaveExt ? `?ext=${encodeURIComponent(arweaveExt)}` : ''
    return `https://www.arweave.net/${transaction.id}${ext}`
  }
}
