import {
  ClaimEligibility,
  MediaRenderer,
  Web3Button,
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
  useTotalCount,
} from "@thirdweb-dev/react";

import styles from "../styles/Hero.module.css";
import Image from "next/image";
import { NextPage } from "next";
import { CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();
  const { contract } = useContract(CONTRACT_ADDRESS);

  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useContractMetadata(contract);
  const { data: activeClaimPhase, isLoading: isActiveClaimPhaseLoading } =
    useActiveClaimConditionForWallet(contract, address);
  const { data: totalSupply, isLoading: isTotalSupplyLoading } =
    useTotalCount(contract);
  const { data: totalClaimed, isLoading: isTotalClaimedLoading } =
    useTotalCirculatingSupply(contract);
  const maxClaimable = parseInt(activeClaimPhase?.maxClaimablePerWallet || "0");
  console.log(maxClaimable)
  const {
    data: claimIneligibility,
    isLoading: isClaimIneleigibilityLoading,
  } = useClaimIneligibilityReasons(contract, {
    walletAddress: address || "",
    quantity: 1,
  });

  const [claimQuantity, setClaimQuantity] = useState(1)
  const increment = () => {
    if (claimQuantity < maxClaimable) {
      setClaimQuantity(claimQuantity+1);
    }
  }
  const decrement = () => {
    if (claimQuantity < maxClaimable) {
      setClaimQuantity(claimQuantity-1);
    }
  }
  return (
    <main className={styles.container}>
      <div className={styles.main}>
        {!isContractMetadataLoading && (
          <div className={styles.heroSection}>
            <div className={styles.collectionImage}>
              <MediaRenderer src={contractMetadata?.image} />
            </div>
            <div className={styles.content}>
              <h1>{contractMetadata?.name}</h1>
              <p>{contractMetadata?.description}</p>
              {!isActiveClaimPhaseLoading ? (
                <div>
                  <p>Claim Phase : {activeClaimPhase?.metadata?.name}</p>
                  <p>
                    Price: {ethers.utils.formatUnits(activeClaimPhase?.price)}
                  </p>
                </div>
              ) : (
                <div>loading ...</div>
              )}
              {!isTotalSupplyLoading ? (
                <p>
                  Claimed : {totalClaimed?.toNumber()}/{" "}
                  {totalSupply?.toNumber()}
                </p>
              ) : (
                <div>Loading..</div>
              )}
              
              {address ? (
                  !isClaimIneleigibilityLoading ? (
                    claimIneligibility?.length! > 0 ? (
                      claimIneligibility?.map((reason,id)=>(
                        <p key={id}>{reason}</p>
                      ))
                    ):(
                      <div>
                        <p>
                          you are eligible to claim , {`Max claimable: ${maxClaimable}`}
                        </p>
                        <div className={styles.Container}>
                          <div className={styles.claimValue}>
                            <button className={styles.claimBtn} onClick={decrement}>
                               -
                            </button>
                            <input className={styles.inputtag} type="number" value={claimQuantity} />
                            <button className={styles.claimBtn} onClick={increment}>+</button>
                          </div>

                           <Web3Button
                  contractAddress={CONTRACT_ADDRESS}
                  action={(contract) => contract.erc721.claim(claimQuantity)}
                  >
                  Claim NFT
                </Web3Button>
                  </div>
                        </div>
                    )
                
                
             
              ) : (
                    <p>loading</p>
              )):(
                <p>Connect your wallet to claim</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
