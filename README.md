# Wonka JS

`Wonka` is a JS/TS layer that simplifies the minting process on top of [MetaPlex's Candy Machine](https://docs.metaplex.com/candy-machine-v2/introduction). Once you have [followed the instructions to upload your NFTs](https://docs.metaplex.com/candy-machine-v2/preparing-assets), you can easily use the following three commands to build your mint flow:

* `mintCandyMachineToken(..)`
* `getCandyMachineMints(..)`
* `getCandyMachineState(...)` 

These commands are useful if you need to build a custom facing front end, and don't want to rely on the [Candy Machine Minting Site](https://docs.metaplex.com/candy-machine-v2/mint-frontend). 

## Installation
`npm install @triton-labs/wonka`

## APIs

### Getting Machine State 
Returns info about currently available mints in Candy Machine, how many were already minted, how long is left for the auction, etc. 

```JS
const getCandyMachineState = async () => {
  console.log("Getting candy machine state...")
  const provider = ...;
  const candyMachineId = ...;
  const candyMachineConfigId = ...;
  const wonka = new Wonka(provider, candyMachineId, candyMachineConfigId)
  const candyMachineState = await wonka.getCandyMachineState()
  console.log(candyMachineState.itemsAvailable)
}
```

### Getting Existing Mints
Returns a list of all existing mints on the given candy machine. 

```JS
const getCandyMachineMints = async() => {
  console.log("Getting candy machine mints...")
  const provider = ...;
  const candyMachineId = ...;
  const candyMachineConfigId = ...;
  const wonka = new Wonka(provider, candyMachineId, candyMachineConfigId)
  const candyMachineMints = await wonka.getCandyMachineMints()
  console.log(candyMachineMints)
}
```

### Minting! 
Mints an NFT; you either get an error with a message or the ID of the mint in return. 

```JS
const mintCandyMachineToken = async(recipientWallet: Keypair) => {
  console.log("Minting a new candy machine token...")
  const provider = getProvider();
  const candyMachineId = ...;
  const candyMachineConfigId = ...;
  const candyMachineTreasuryAddress = ...;
  const wonka = new Wonka(provider, candyMachineId, candyMachineConfigId)
  const candyMachineMintId = await wonka.mintCandyMachineToken(recipientWallet, candyMachineTreasuryAddress)
  console.log(candyMachineMintId)
}
```

### Storing Ids
The question is where to store information like candy machine ID or config ID, etc. If you're using React or Next.js, you can easily use the .env file so that the code above looks more like:

```Js
const candyMachineId = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!; // For Next.js
const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID!; // For React
```

Read more about these in the docs: [React .env](https://create-react-app.dev/docs/adding-custom-environment-variables/) and [Next.js .env](https://nextjs.org/docs/basic-features/environment-variables).
