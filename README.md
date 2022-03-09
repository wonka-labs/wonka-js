# Wonka JS

`Wonka JS` is the easiest way to mint from [Candy Machine](https://docs.metaplex.com/candy-machine-v2/introduction) and fetch NFTs through JS APIs. You can see an end to end example in [Next.js demo project](https://github.com/TritonLabs/wonka/tree/main/examples/next-js) as well as debug using the [command line testing tool](https://github.com/TritonLabs/wonka/tree/main/cli). 

![FI3xQ2FVcAQO3wK](https://user-images.githubusercontent.com/796815/153501801-7b3b5d27-a747-4df8-8cec-c5c7d2b233bb.jpeg)


Once you have [followed the instructions to upload your NFTs](https://docs.metaplex.com/candy-machine-v2/preparing-assets), you can use functions below to build your mint flow:

* `mintCandyMachineToken(..)`
* `getCandyMachineMints(..)`
* `getCandyMachineState(...)` 
* `getMintMetadata(...)`
* `updateMintImage(...)`

These commands are useful if you need to build a custom facing front end, and don't want to rely on the [Candy Machine Minting Site](https://docs.metaplex.com/candy-machine-v2/mint-frontend). 

## Installation
`npm install @triton-labs/wonka`

## Wonka APIs

### Getting Machine State 
Returns info about currently available mints in Candy Machine, how many were already minted, how long is left for the auction, etc. 

```JS
const getCandyMachineState = async () => {
  console.log("Getting candy machine state.")
  const provider = ...;
  const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID!;
  const wonka = new Wonka(provider, candyMachineId)
  const candyMachineState = await wonka.getCandyMachineState()
  console.log(candyMachineState)
}
```

### Getting Existing Mints
Returns a list of all existing mints on the given candy machine. 

```JS
const getCandyMachineMints = async() => {
  console.log("Getting candy machine mints...")
  const provider = ...;
  const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID!;
  const wonka = new Wonka(provider, candyMachineId)
  const candyMachineMints = await wonka.getCandyMachineMints()
  console.log(candyMachineMints)
}
```

### Minting a new NFT
Mints an NFT; you either get an error with a message or the ID of the mint in return. 

```JS
const mintCandyMachineToken = async(recipientWallet: PublicKey) => {
  const provider = ...;
  const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID!;
  const wonka = new Wonka(provider, candyMachineId)
  const candyMachineMintId = await wonka.mintCandyMachineToken(recipientWallet)
  console.log(candyMachineMintId)
}
```

### Fetching Mint Metadata
Sometimes you need to load one particular NFT's metadata, here is how you can do it:

```JS
const getMintMetadata = async(mintAddress: string) => {
  const provider = ...;
  const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID!;
  const wonka = new Wonka(provider, candyMachineId)
  const mintMetadata = await wonka.getMintMetadata(mintAddress)
  console.log(`Fetched mint metadata:`);
  console.log(mintMetadata);
  
  // Can also fetch the data stored inside the metadata:
  const metadataDataURIData = await fetch(mintMetadata.uri);
  const metadataDataURIDataJSON = await metadataDataURIData.json();
  console.log(`Fetched mint metadata's URI data:`);
  console.log(metadataDataURIDataJSON);
}
```

### Updating Mint Photo (Advanced)
This is a bit more advanced, but if you have a wallet with the update authority, you can actually update the NFT's png.
Since this requires access to arweave's private key, it's probably better to create a backend API that uses these functions. 
Here is what's happening at a high-level: 

1. You create an ArweaveUploader with a private key that has enough money in it for uploading files. 
2. You create a wonka with a provider that's attached to a wallet that has permission to update the NFT's metadata. 
3. You give Wonka a base64 encoded PNG and a mint address. That's it! 

```JS
const updateMintImage = async(mintAddress: PublicKey, b64image: string) => {
  console.log("Getting mint metadata...")
  const provider = ...;
  const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID!;
  const wonka = new Wonka(provider, candyMachineId)
  const arweaveUploader = new ArweaveUploader(process.env.ARWEAVE_KEY!);
  const txn = await wonka.updateMintImage(
      b64image,
      arweaveUploader,
      provider.wallet,
      mintAddress,
      { image_updated: true }
    );
  }
```

### Storing Ids & Keys
The question is where to store information like candy machine ID, etc. If you're using React or Next.js, you can easily use the .env file so that the code above looks more like:

```JS
const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!; // For Next.js
const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID!; // For React
```

Read more about these in the docs: [React .env](https://create-react-app.dev/docs/adding-custom-environment-variables/) and [Next.js .env](https://nextjs.org/docs/basic-features/environment-variables).

## Windex APIs

By default, fetching NFTs by Wallet, Collection, or ID requires fetching a series of Solana accounts and external JSON metadata, which can be slow and bandwidth intensive. The Wonka Index (windex) is a backend cache that enables blazing fast metadata fetches. You can use the following queries to easily fetch NFTs. For more details, visit [WINDEX.md](WINDEX.md).

### Fetching NFTs by Candy Machine or Collection ID

To display all NFTs in a collection, you can query Windex by Candy Machine ID or Collection ID (the collection id is the first verified creator in the NFT's metadata).

```JS
const fetchNFTsByCandyMachine = async(candyMachineId: PublicKey) => {
  const nfts = await Windex.fetchNFTsByCandyMachine(testCandyMachineId, 20, WINDEX_ENDPOINT.DEVNET);
  console.log(`Retrieved ${nfts.length} NFTs!`);
}
```

### Fetching NFTs in a Wallet Address

```JS
const fetchNFTsByWallet = async(walletAddress: PublicKey) => {
  const nfts = await Windex.fetchNFTsByWallet(walletAddress, 20, WINDEX_ENDPOINT.DEVNET);
  console.log(`Retrieved ${nfts.length} NFTs in ${walletAddress}'s wallet!`);
}
```

### Fetching an NFT by Mint Address

```JS
const fetchNFTsByMintAddress = async(mintAddress: PublicKey) => {
  const nft = await Windex.fetchNFTByMintAddress(mintAddress, WINDEX_ENDPOINT.DEVNET);
  if (!nft) {
    console.log("nft not found!");
  } else {
    console.log(`Fetched ${nft.address}: ${nft.name}`);
  }
}
```
