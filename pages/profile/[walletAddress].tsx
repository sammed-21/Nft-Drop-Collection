import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import styles from "../../styles/Profile.module.css";
import { CONTRACT_ADDRESS } from "../../const/addresses";
import { OnLoadingComplete } from "next/dist/shared/lib/get-img-props";
import { ClassNames } from "@emotion/react";

export default function Profile() {
  const address = useAddress();
  const truncatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: ownedNFTs, isLoading: isOwnedNFTsLoading } = useOwnedNFTs(
    contract,
    address
  );
  return (
    <div className={styles.container}>
      {address ? (
        <div className={styles.cards}>
          <div className={styles.middle}>
            <h1>Profile</h1>
            <p>Wallet Address :{truncatAddress(address || "")}</p>
          </div>
          <hr />
          <div>
            <h3 className={styles.middle}>My NFTs:</h3>
            <div className={styles.grid}>
              {!isOwnedNFTsLoading ? (
                ownedNFTs?.length ? (
                  ownedNFTs?.map((nft) => (
                    <div key={nft.metadata.id} className={styles.NFTCard}>
                      <ThirdwebNftMedia metadata={nft.metadata} />
                      <h3>{nft.metadata.name}</h3>
                    </div>
                  ))
                ) : (
                  <p>no NFTs Owned</p>
                )
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.main}>
          <p>please connect your wallet</p>
        </div>
      )}
    </div>
  );
}
