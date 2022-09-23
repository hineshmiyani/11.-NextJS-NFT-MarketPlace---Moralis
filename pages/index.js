import Head from "next/head";
import Image from "next/image";
import { useMoralis, useMoralisQuery } from "react-moralis";
import NFTCard from "../components/NFTCard";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  const { data: listedNfts, isFetching: fetchingListNfts } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  ); //  useMoralisQuery( <tablename>, <query>)

  // console.log(listedNfts);

  return (
    <div className="px-28 py-12 mx-auto">
      <h1 className="pb-6 font-bold text-2xl">Recently Listed</h1>
      {isWeb3Enabled ? (
        <div className="flex flex-wrap gap-x-4 gap-y-4">
          {fetchingListNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.map((nft) => {
              const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                nft.attributes;
              return (
                <div key={nft?.id}>
                  <NFTCard
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    seller={seller}
                  />
                </div>
              );
            })
          )}
        </div>
      ) : (
        <p>Web3 currently not enabled.</p>
      )}
    </div>
  );
}

// Note:
// How do we show the recently listed NFTs?

// We will index the events off - chain and then read from our database.
// Setup a server to listen for those events to be fired , and we will add them to a database to query.

// TheGraph does this in a decentralized way
// Moralis does it in a centralized way and comes with a ton of other features.

// All our logic is still 100 % on chain .
// Speed & Development time .
// Its really hard to start a prod blockchain project 100 % decetralized .
// They are working on open sourcing their code .
// Feature richness
// We can create more features with a centralized back end to start
// As more decentralized tools are being created.
// Local development
