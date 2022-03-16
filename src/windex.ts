import { request, gql } from 'graphql-request';
import { PublicKey } from '@solana/web3.js';
import log from 'loglevel';

export interface SolDomainMetadata {
  address: string;
  solName?: string;
  twitter?: string;
}

export interface CandyMachineState {
  id: string;
  items_redeemed: number;
  items_available: number;
  price: number;
  go_live_date: number;
}

export interface CollectionItem {
  address: string;
  name: string;
  symbol: string | null;
  description: string | null | undefined;
  external_url: string | null | undefined;
  image_url: string;
  explorer_url: string;
  creators: {
    address: string;
    verified: boolean;
    share: number;
  }[];
  files: {
    uri: string | null;
    type: string | null;
  }[];
  attributes: {
    trait_type: string | null;
    value: string | null;
  }[];
}

type nft = {
  id: string;
  name: string;
  symbol: string | null;
  explorer_url: string;
  image: {
    orig: string;
  };
  metaplex_metadata: {
    mint: string;
    creators: {
      address: string;
      verified: boolean;
      share: number;
    }[];
  };
  external_metadata: {
    description: string | null;
    external_url: string | null;
    properties: {
      files:
        | {
            uri: string | null;
            type: string | null;
          }[]
        | null;
    } | null;
    attributes:
      | {
          trait_type: string | null;
          value: string | null;
        }[]
      | null;
  } | null;
};

function nftToCollectionItem(n: nft): CollectionItem {
  return {
    address: n.metaplex_metadata.mint,
    name: n.name,
    symbol: n.symbol,
    description: n.external_metadata?.description,
    external_url: n.external_metadata?.external_url,
    image_url: n.image.orig,
    explorer_url: n.explorer_url,
    creators: n.metaplex_metadata.creators,
    files: n.external_metadata?.properties?.files || [],
    attributes: n.external_metadata?.attributes || [],
  };
}

function nftsToCollectionItems(nfts: nft[]): CollectionItem[] {
  return nfts.map((n): CollectionItem => {
    return nftToCollectionItem(n);
  });
}

/**
 * Wonka Indexer is the fastest indexer in the wild west.
 * Currently, we have four data sets you can fetch through windex:
 * - Candy Machine State
 * - NFTs by Candy Machine
 * - NFTs by Wallet Address
 * - NFT by Mint Address
 * - Sol Domain Name by Address [and vice versa]
 */
export default class Windex {
  // Solana Devnet (https://explorer.solana.com/?cluster=devnet)
  // To explore queries: https://api.wonkalabs.xyz/v0.1/solana/graphiql?cluster=devnet
  static DEVNET_ENDPOINT = 'https://api.wonkalabs.xyz/v0.1/solana/devnet/graphql?src=wonka-js';

  // Solana Mainnet Beta (https://explorer.solana.com/)
  // To explore queries: https://api.wonkalabs.xyz/v0.1/solana/graphiql?cluster=mainnet
  static MAINNET_ENDPOINT = 'https://api.wonkalabs.xyz/v0.1/solana/mainnet/graphql?src=wonka-js';

  public static async fetchCandyMachineState(
    candyMachineId: PublicKey,
    endpoint: string = Windex.DEVNET_ENDPOINT,
  ): Promise<CandyMachineState> {
    log.info(`Fetching candy machine state for candy machine with ID: ${candyMachineId.toString()}`);
    const fetchCandyMachineStateQuery = gql`
    {
      candyMachineV2(id: "${candyMachineId.toString()}") {
        id
        items_redeemed
        items_available
        price
        go_live_date
      }
    }`;
    const results = await request(endpoint, fetchCandyMachineStateQuery);
    return results.candyMachineV2 as CandyMachineState;
  }

  public static async fetchAddressBySolDomain(solDomain: string): Promise<SolDomainMetadata | null> {
    log.info(`Fetching address by sol domain: ${solDomain}`);
    if (!solDomain.endsWith(".sol")) { throw new Error("Sol domain names should end in sol.") }
    // 1. First fetch the public address of the sol domain.
    const fetchAddressQuery = gql`
    {
      addressForSolDomainName(domainName: "${solDomain}")
    }`;
    const fetchAddressQueryResults = await request(Windex.MAINNET_ENDPOINT, fetchAddressQuery);
    // 2. If address is found, try to fetch the twitter handle. Long term, we should combine these queries.
    if (fetchAddressQueryResults.addressForSolDomainName) {
      const address = fetchAddressQueryResults.addressForSolDomainName;
      const fetchTwitterHandleQuery = gql`
      {
        twitterHandleForAddress(address: "${address}")
      }`;
      const fetchTwitterHandleQueryResults = await request(Windex.MAINNET_ENDPOINT, fetchTwitterHandleQuery);
      return { address: address, solName: solDomain, twitter: fetchTwitterHandleQueryResults.twitterHandleForAddress };
    }
    // 3. If nothing else was found, return null.
    return null;
  }

  public static async fetchSolDomainMetadataByAddress(address: PublicKey): Promise<SolDomainMetadata> {
    log.info(`Fetching sol domain by address: ${address.toString()}`);
    const fetchSolNameQuery = gql`
    {
      solDomainNameForAddress(address: "${address.toString()}")
      twitterHandleForAddress(address: "${address.toString()}")
    }`;
    const results = await request(Windex.MAINNET_ENDPOINT, fetchSolNameQuery);
    return {
      address: address.toString(),
      solName: results.solDomainNameForAddress,
      twitter: results.twitterHandleForAddress,
    };
  }

  public static async fetchNFTsByCandyMachineID(
    candyMachineID: PublicKey,
    first: number = 20,
    endpoint: string = Windex.DEVNET_ENDPOINT,
  ): Promise<CollectionItem[]> {
    return await Windex.fetchNFTsByCollectionID(candyMachineID, first, endpoint);
  }

  public static async fetchNFTsByCollectionID(
    collectionID: PublicKey,
    first: number = 20,
    endpoint: string = Windex.DEVNET_ENDPOINT,
  ): Promise<CollectionItem[]> {
    log.info(`Fetching NFTs by candy machine with ID: ${collectionID.toString()}`);
    const fetchNFTsByCandyMachineQuery = gql`
    {
      nftsByCollection(collectionId:"${collectionID.toString()}", first:${first}) {
        edges {
          node {
            id
            name
            symbol
            explorer_url
            image {
              orig
            }
            metaplex_metadata {
              mint
              creators {
                address
                verified
                share
              }
            }
            external_metadata {
              description
              external_url
              properties {
                files {
                  uri
                  type
                }
              }
              attributes {
                trait_type
                value
              }
            }
          }
        }
      }
    }`;
    const results = await request(endpoint, fetchNFTsByCandyMachineQuery);
    const nfts = results.nftsByCollection.edges.map((edge) => edge.node) as nft[];
    return nftsToCollectionItems(nfts);
  }

  public static async fetchNFTsByWallet(
    walletAddress: PublicKey,
    first: number = 20,
    endpoint: string = Windex.DEVNET_ENDPOINT,
  ): Promise<CollectionItem[]> {
    log.info(`Fetching NFTs by wallet with ID: ${walletAddress.toString()}`);
    const fetchNFTsByCandyMachineQuery = gql`
    {
      nftsByWallet(wallet: "${walletAddress.toString()}", first: ${first}) {
        edges {
          node {
            id
            name
            symbol
            explorer_url
            image {
              orig
            }
            metaplex_metadata {
              mint
              creators {
                address
                verified
                share
              }
            }
            external_metadata {
              description
              external_url
              properties {
                files {
                  uri
                  type
                }
              }
              attributes {
                trait_type
                value
              }
            }
          }
        }
      }
    }`;
    const results = await request(endpoint, fetchNFTsByCandyMachineQuery);
    const nfts = results.nftsByWallet.edges.map((edge) => edge.node) as nft[];
    return nftsToCollectionItems(nfts);
  }

  public static async fetchNFTByMintAddress(
    mintAddress: PublicKey,
    endpoint: string = Windex.DEVNET_ENDPOINT,
  ): Promise<CollectionItem | null> {
    log.info(`Fetching NFTs by mint address with ID: ${mintAddress.toString()}`);
    const fetchNFTsByCandyMachineQuery = gql`
    {
      nftByMintID(mintID: "${mintAddress.toString()}") {
        id
        name
        symbol
        explorer_url
        image {
          orig
        }
        metaplex_metadata {
          mint
          creators {
            address
            verified
            share
          }
        }
        external_metadata {
          description
          external_url
          properties {
            files {
              uri
              type
            }
          }
          attributes {
            trait_type
            value
          }
        }
      }
    }`;
    const results = await request(endpoint, fetchNFTsByCandyMachineQuery);
    return nftToCollectionItem(results.nftByMintID);
  }
}

export { Windex };
