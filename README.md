# Wonka JS

`Wonka JS` simplifies the minting process with [MetaPlex's Candy Machine](https://docs.metaplex.com/candy-machine-v2/introduction). Once you have [followed the instructions to upload your NFTs](https://docs.metaplex.com/candy-machine-v2/preparing-assets), you can easily use the following commands to build your mint flow:

* `mintCandyMachineToken(..)`
* `getCandyMachineMints(..)`
* `getCandyMachineState(...)` 
* `getMintMetadata(...)`
* `updateMintImage(...)`

These commands are useful if you need to build a custom facing front end, and don't want to rely on the [Candy Machine Minting Site](https://docs.metaplex.com/candy-machine-v2/mint-frontend). 

## Installation
`npm install @triton-labs/wonka`

## APIs

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
