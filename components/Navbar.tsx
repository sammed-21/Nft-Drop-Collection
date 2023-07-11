import { ConnectWallet ,useAddress } from '@thirdweb-dev/react'
import styles from '../styles/Home.module.css'
import Link from "next/link"
const Navbar = () => {
    const address = useAddress();
    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
                <Link href={'/'}>
                    
                    <p>NFT collection</p>
                </Link>
                <div className={styles.navLinks}>
                    {address && (
                        <Link href={`/profile/${address}`}><p>My NFTS</p></Link>
)}
                </div>
                <ConnectWallet/>
            </div>
        </div>
    )
}

export default Navbar
