# Wonka JS — Next.js Example
The example gives you concrete code snippets for authenticating the user and using Wonka JS to mint tokens on Metaplex's Candy Machine.

![next](https://user-images.githubusercontent.com/796815/152266612-65372a86-adc1-4099-aa60-10c0ee5416c2.png)

## Getting Started

1. Git clone this repo, then `cd wonka/examples/next-example` 
2. Run `mv .env.template .env`, then vim `.env` to set your `NEXT_PUBLIC_CANDY_MACHINE_ID`.
3. Run `npm install` 
4. Run `npm run dev` 

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Included Examples

1. `state.tsx` — fetches state related to the candy machine.
2. `mint.tsx` — mints a new NFT.
3. `mints.tsx` — fetches all mints from candy machine. 
4. `metadata.tsx` — fetches all metadata from a particular mint.

## About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!`
