import { request, gql } from 'graphql-request';
import { PublicKey } from '@solana/web3.js';
import log from 'loglevel';

// Also can use visual explorer called GraphiQL: 
// 'https://windex-api.onrender.com/api/v1/devnet/graphiql';
const WINDEX_ENDPOINT = 'https://windex-api.onrender.com/api/v1/devnet/graphql';

export interface Collection {
  items: CollectionItem[];
  candyMachine: candyMachineV2;
}

export interface CollectionItem {
  address: string;
  name: string;
  uri: string;
}

type candyMachineV2 = {
  items_redeemed: number;
  items_available: number;
  price: number;
};

type nftEdge = {
  node: {
    name: string;
    metaplex_metadata: {
      mint: string;
    };
    image: {
      orig: string;
    };
  };
};

const fetchCollectionQuery = (candyMachineId: string) => gql`
  {
    candyMachineV2(id: "${candyMachineId}") {
      items_redeemed
      items_available
      price
    }
    nftsByCollection(collectionId:"${candyMachineId}",first:124) {
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
  }
`;

/**
 * Wonka Indexer is the fastest indexer in the wild west.
 */
export default class Windex {
  private _candyMachineId: PublicKey;

  public constructor(candyMachineId: string) {
    this._candyMachineId = new PublicKey(candyMachineId);
    log.info(`Initialized a Windex with candy machine ID: ${candyMachineId}.`);
  }

  public async fetchCollection(): Promise<Collection> {
    const collectionQueryResults = await request(
      WINDEX_ENDPOINT,
      fetchCollectionQuery(this._candyMachineId.toString()),
    );
    const collectionItems = collectionQueryResults.nftsByCollection.edges.map(({ node }: nftEdge): CollectionItem => {
      return {
        address: node.metaplex_metadata.mint,
        name: node.name,
        uri: node.image.orig,
      };
    });
    const candyMachine = collectionQueryResults.candyMachineV2 as candyMachineV2;
    return { items: collectionItems, candyMachine };
  }
}

export { Windex };
