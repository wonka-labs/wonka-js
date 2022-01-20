import { Keypair } from "@solana/web3.js";

/**
 * Checks if user is connected to a Phantom wallet.
 * @returns Wallet's public key if one is connected, null otherwise. 
 */
const getWalletAddressIfConnected = async () => {
  try {
    const { solana } = window as any;
    if (solana && solana.isPhantom) {
      return await solana.connect({ onlyIfTrusted: true });
    } else {
      return null
    }
  } catch (error) {
    return null
  }
};

/**
 * Checks if user is connected to a Phantom wallet.
 * @returns True if user is connected to a Phantom wallet.
 */
const isWalletConnected = async () => {
  return await getWalletAddressIfConnected() !== null
}

/**
 * Attempts to connect to a solana wallet.
 */
const connectWallet = async (callback:(walletAddress: Keypair | null) => void) => {
  const { solana } = window as any;
  if (solana && solana.isPhantom) {
    callback(await solana.connect())
  }
};

export { 
  getWalletAddressIfConnected,
  isWalletConnected,
  connectWallet,
 };