import { request, gql } from 'graphql-request';
import { PublicKey } from '@solana/web3.js';
import log from 'loglevel';

// Also can use visual explorer called GraphiQL:
// 'https://windex-api.onrender.com/api/v1/devnet/graphiql';
const WINDEX_ENDPOINT = 'https://windex-api.onrender.com/api/v1/devnet/graphql';

export interface Collection {
  candyMachine: CandyMachineState;
  items: CollectionItem[];
}

export interface CandyMachineState {
  items_redeemed: number;
  items_available: number;
  price: number;
}

export interface CollectionItem {
  address: string;
  name: string;
  uri: string;
}

type nft = {
  name: string;
  metaplex_metadata: {
    mint: string;
  };
  image: {
    orig: string;
  };
};

function nftToCollectionItem(nft: nft): CollectionItem {
  return {
    address: nft.metaplex_metadata.mint,
    name: nft.name,
    uri: nft.image.orig,
  };
}

function nftsToCollectionItems(nfts: nft[]): CollectionItem[] {
  return nfts.map((nft): CollectionItem => {
    return nftToCollectionItem(nft);
  });
}

/**
 * Wonka Indexer is the fastest indexer in the wild west.
 * Currently, we have four data sets you can fetch through windex:
 * - Candy Machine State
 * - NFTs by Candy Machine
 * - NFTs by Wallet Address
 * - NFT by Mint Address
 */
export default class Windex {
  public static async fetchCandyMachineState(candyMachineId: PublicKey): Promise<CandyMachineState> {
    log.info(`Fetching candy machine state for candy machine with ID: ${candyMachineId.toString()}`);
    const fetchCandyMachineStateQuery = gql`
    {
      candyMachineV2(id: "${candyMachineId.toString()}") {
        items_redeemed
        items_available
        price
      }
    }`;
    const results = await request(WINDEX_ENDPOINT, fetchCandyMachineStateQuery);
    return results.candyMachineV2 as CandyMachineState;
  }

  public static async fetchNFTsByCandyMachine(
    candyMachineId: PublicKey,
    first: number = 128,
  ): Promise<CollectionItem[]> {
    log.info(`Fetching NFTs by candy machine with ID: ${candyMachineId.toString()}`);
    const fetchNFTsByCandyMachineQuery = gql`
    {
      nftsByCollection(collectionId:"${candyMachineId.toString()}", first:${first}) {
        edges {
          node {
            metaplex_metadata {
              mint
            }
            name
            image {
              orig
            }
          }
        }
      }
    }`;
    const results = await request(WINDEX_ENDPOINT, fetchNFTsByCandyMachineQuery);
    const nfts = results.nftsByCollection.edges.map((edge) => edge.node) as nft[];
    return nftsToCollectionItems(nfts);
  }

  public static async fetchNFTsByWallet(walletAddress: PublicKey, first: number = 128): Promise<CollectionItem[]> {
    log.info(`Fetching NFTs by wallet with ID: ${walletAddress.toString()}`);
    const fetchNFTsByCandyMachineQuery = gql`
    {
      nftsByWallet(wallet: "${walletAddress.toString()}", first: ${first}) {
        edges {
          node {
            metaplex_metadata {
              mint
            }
            name
            image {
              orig
            }
          }
        }
      }
    }`;
    const results = await request(WINDEX_ENDPOINT, fetchNFTsByCandyMachineQuery);
    const nfts = results.nftsByWallet.edges.map((edge) => edge.node) as nft[];
    return nftsToCollectionItems(nfts);
  }

  public static async fetchNFTByMintAddress(mintAddress: PublicKey): Promise<CollectionItem | null> {
    log.info(`Fetching NFTs by mint address with ID: ${mintAddress.toString()}`);
    const fetchNFTsByCandyMachineQuery = gql`
    {
      nftByMintID(mintID: "${mintAddress.toString()}") {
        metaplex_metadata {
          mint
        }
        name
        image {
          orig
        }
      }
    }`;
    const results = await request(WINDEX_ENDPOINT, fetchNFTsByCandyMachineQuery);
    return nftToCollectionItem(results.nftByMintID);
  }
}

export { Windex };