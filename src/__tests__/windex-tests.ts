import { Windex } from '../windex';
import {PublicKey} from '@solana/web3.js'

const testCandyMachineId = new PublicKey("Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb")

test('should be able to fetch candy machine state', () => {
  return Windex.fetchCandyMachineState(testCandyMachineId).then(results => {
    expect(results.items_available).toBe(100);
    expect(results.price).toBe(1000000000);
    expect(results.items_redeemed).toBeDefined();
  });
});

test('should be able to fetch first candy machine NFT', () => {
  return Windex.fetchNFTsByCandyMachineID(testCandyMachineId, 2).then(results => {
    expect(results[0].address).toBeDefined()
    expect(results[0].name).toBeDefined()
    expect(results[0].image_url).toBeDefined()
  });
}, 10000);

test('should be able to fetch NFT by Wallet', () => {
  const testWalletId = new PublicKey("6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6")
  return Windex.fetchNFTsByWallet(testWalletId, 2).then(results => {
    expect(results[0].address).toBeDefined()
    expect(results[0].name).toBeDefined()
    expect(results[0].image_url).toBeDefined()
  });
}, 10000);

test('should be able to fetch NFT by Wallet (mainnet)', () => {
  const testWalletId = new PublicKey("BYeHCJtokQecDkN34ZE4fWgF7U4vDtwjX6bkaiaprQmt")
  return Windex.fetchNFTsByWallet(testWalletId, 2, Windex.MAINNET_ENDPOINT).then(results => {
    expect(results[0].address).toBeDefined()
    expect(results[0].name).toBeDefined()
    expect(results[0].image_url).toBeDefined()
  });
}, 10000);

test('should be able to fetch NFT by ID', () => {
  const testNFTId = new PublicKey("GsuMovmB1rrYqHeTvoheAr8LFJTLktqrr6U2hZRvKDSj")
  return Windex.fetchNFTByMintAddress(testNFTId).then(results => {
    expect(results!.address).toBe("GsuMovmB1rrYqHeTvoheAr8LFJTLktqrr6U2hZRvKDSj");
    expect(results!.name).toBe("Wagmify PFP 45");
    expect(results!.image_url).toBe("https://www.arweave.net/p0zxL9xdNDA_lcRCTOiTCISa4hnG19GDQIjulEiIUNs?ext=png");
  });
}, 10000);
