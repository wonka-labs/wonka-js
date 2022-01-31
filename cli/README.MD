# Wonka JS: Command Line Interface (CLI)

The CLI comes in handy both as a tool to debug your candy machine as well as an easy way to test out the JS APIs. 

## Prerequisites
1. Install `node`
2. Instsall `npm`
3. Install `ts-node` 
4. [Setup a devnet wallet](https://docs.metaplex.com/candy-machine-v2/getting-started#setting-up-a-devnet-wallet-for-testing) (key in examples below is saved in `~/.config/solana/devnet.json`).
5. [Create a candy machine](https://docs.metaplex.com/candy-machine-v2/creating-candy-machine).

## Installation
1. `mkdir ~/triton-labs`
2. `cd ~/triton-labs`
3. `git clone git@github.com:TritonLabs/wonka.git` 
4. `cd wonka/cli` 
5. `npm i`

## Commands
Quick summary of the commands below:
* [`get-state`](#getting-machine-state): prints out current candy machine's state. 
* [`get-mints`](#getting-existing-mints): prints out all existing mints from a particular candy machine. 
* [`mint`](#minting-a-new-nft): mints a new NFT and gives it to a recipient address.
* [`get-metadata`](#fetching-mint-metadata): prints out all metadata associated with a candy machine mint. 

### Getting Machine State 
Returns info about currently available mints in Candy Machine, how many were already minted, how long is left for the auction, etc. 

```JS
➜ cli git:(main) ts-node src/index.ts get-state \
-k ~/.config/solana/devnet.json \
-cmid Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb

Loaded keypair with public key: 6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6.
Initialized a Wonka with candy machine ID: Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb.
Fetched state for candy machine: Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb:
{
  itemsAvailable: 100,
  itemsRedeemed: 13,
  itemsRemaining: 87,
  goLiveData: 1640390400,
  goLiveDateTimeString: 'Sat, 25 Dec 2021 00:00:00 GMT'
}
```

### Getting Existing Mints
Returns a list of all existing mints on the given candy machine. 

```JS
➜ cli git:(main) ts-node src/index.ts get-mints \
-k ~/.config/solana/devnet.json \
-cmid Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb

Loaded keypair with public key: 6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6.
Initialized a Wonka with candy machine ID: Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb.
Fetched all mints from candy machine: Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb:
[
  Metadata {
    pubkey: PublicKey {
      _bn: <BN: f8faa794ec5c29f904ce17249c0cd50640ff334c6f5aca165a589584c642ec26>
    },
    info: {
      data: <Buffer 04 59 1e 17 d5 47 f2 03 06 bb b2 9f c2 51 8b 94 1d 24 22 bb 17 ab 8b f1 c0 c0 d0 6f f1 e9 ba c2 ef 43 59 da cc 4a 86 c5 d0 bd 19 81 f3 9c 91 df 7a 9e ... 629 more bytes>,
      executable: false,
      lamports: 5616720,
      owner: PublicKey {
        _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
      },
      rentEpoch: 257
    },
    data: MetadataData {
      key: 4,
      updateAuthority: '6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6',
      mint: '5XunTKCtqVeTuD1XxLrorP2x55UaR62SMekdnmA2UP1z',
      data: MetadataDataData {
        name: 'Wagmify PFP 85',
        symbol: '',
        uri: 'https://arweave.net/bhFGrMCP-GTKQJ5jOY6QKuCRoL5RLeQfWJIXzxnr0AQ',
        sellerFeeBasisPoints: 0,
        creators: [
          Creator {
            address: '3CeEE1fnunVBtGLGkCfjxBnrfpE9UYJ7B1NRF8e7HKx6',
            verified: 1,
            share: 0
          },
          Creator {
            address: '6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6',
            verified: 0,
            share: 100
          }
        ]
      },
      primarySaleHappened: 1,
      isMutable: 1,
      editionNonce: 255,
      tokenStandard: undefined,
      collection: undefined,
      uses: undefined
    }
  },
  ...
]
```

### Minting a new NFT
Mints an NFT; you either get an error with a message or the ID of the mint in return. 

```JS
➜ cli git:(main) ✗ ts-node src/index.ts mint \
-k ~/.config/solana/devnet.json \
-cmid Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb \
-r 6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6

Loaded keypair with public key: 6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6.
Initialized a Wonka with candy machine ID: Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb.
About to send transaction with all the candy instructions!
Sent transaction with id: yw2a24eaqPjskRejqwZUGcL56xT8tJ7bjFajowNq7UvFX5w4HUkJDypU7HSR6z1i1WfUA5t3FNHYVpsMT8iwh3U for mint: 9iTKkg9JuzoNZePjgfd1XxXcKQL9e1c4Zkf2pbDTj7eW.
Got notification of type: status from txid: yw2a24eaqPjskRejqwZUGcL56xT8tJ7bjFajowNq7UvFX5w4HUkJDypU7HSR6z1i1WfUA5t3FNHYVpsMT8iwh3U.
Minted 9iTKkg9JuzoNZePjgfd1XxXcKQL9e1c4Zkf2pbDTj7eW; waiting 30 seconds to fetch metadata...
Loading metadata PDA FSZ4VEwFvZqwCEmMJ3215tMVBovkqCwyz2CSF9tZLo8T for token address: 9iTKkg9JuzoNZePjgfd1XxXcKQL9e1c4Zkf2pbDTj7eW.
Minted a new token: 9iTKkg9JuzoNZePjgfd1XxXcKQL9e1c4Zkf2pbDTj7eW:
MetadataDataData {
  name: 'Wagmify PFP 44',
  symbol: '',
  uri: 'https://arweave.net/mq_8uIkFJRB6JTt-nqkZPMYXz4I3n6uj68Twrx2FYtQ',
  sellerFeeBasisPoints: 0,
  creators: [
    Creator {
      address: '3CeEE1fnunVBtGLGkCfjxBnrfpE9UYJ7B1NRF8e7HKx6',
      verified: 1,
      share: 0
    },
    Creator {
      address: '6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6',
      verified: 0,
      share: 100
    }
  ]
}
```

### Fetching Mint Metadata
Sometimes you need to load one particular NFT's metadata, here is how you can do it:

```JS
➜ cli git:(main) ✗ ts-node src/index.ts get-metadata \
-k ~/.config/solana/devnet.json \
-cmid Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb \
-m 9iTKkg9JuzoNZePjgfd1XxXcKQL9e1c4Zkf2pbDTj7eW

Loaded keypair with public key: 6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6.
Initialized a Wonka with candy machine ID: Hkunn4hct84zSPNpyQygThUKn8RUBVf5b4r975NRaHPb.
Loading metadata PDA FSZ4VEwFvZqwCEmMJ3215tMVBovkqCwyz2CSF9tZLo8T for token address: 9iTKkg9JuzoNZePjgfd1XxXcKQL9e1c4Zkf2pbDTj7eW.
Fetched metadata for mint: 9iTKkg9JuzoNZePjgfd1XxXcKQL9e1c4Zkf2pbDTj7eW:
MetadataDataData {
  name: 'Wagmify PFP 44',
  symbol: '',
  uri: 'https://arweave.net/mq_8uIkFJRB6JTt-nqkZPMYXz4I3n6uj68Twrx2FYtQ',
  sellerFeeBasisPoints: 0,
  creators: [
    Creator {
      address: '3CeEE1fnunVBtGLGkCfjxBnrfpE9UYJ7B1NRF8e7HKx6',
      verified: 1,
      share: 0
    },
    Creator {
      address: '6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6',
      verified: 0,
      share: 100
    }
  ]
}
Fetched metadata URI data for mint: 9iTKkg9JuzoNZePjgfd1XxXcKQL9e1c4Zkf2pbDTj7eW:
{
  name: 'Wagmify PFP 44',
  collection: { name: 'Wagmify Season 1', family: 'Wagmify' },
  symbol: '',
  image: 'https://www.arweave.net/74ASD4jh5_frj3pNr2HSNwVEt_72Oz7jMeqm6R8KK_s?ext=png',
  properties: {
    files: [
      {
        uri: 'https://www.arweave.net/74ASD4jh5_frj3pNr2HSNwVEt_72Oz7jMeqm6R8KK_s?ext=png',
        type: 'image/png'
      }
    ],
    creators: [
      {
        address: '6zsuBDfuvtxK5FD9tf8u8LfrYBVnxDWRhj43snmC6Qx6',
        share: 100
      }
    ]
  }
}
```