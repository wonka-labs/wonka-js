import { Connection, ConfirmOptions} from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';

export async function connectProvider (endpoint: string, onlyIfTrusted: boolean = false): Promise<Provider | null> {
  const { solana } = window as any;
  if (solana && solana.isPhantom) {
    const wallet = await solana.connect({ onlyIfTrusted })
    const connection = new Connection(endpoint);
    const providerOptions: ConfirmOptions = {
      preflightCommitment: 'processed',
    };
    return new Provider(
      connection,
      wallet,
      providerOptions
    );
  }
  return null;
};
