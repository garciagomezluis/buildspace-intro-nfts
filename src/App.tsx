import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { abi } from '../artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json';

import './App.css';

// eslint-disable-next-line import/no-unresolved
import twitterLogo from './twitter-logo.svg';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

/* eslint-disable no-useless-return */

function App() {
    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log('Install MetaMask!');

            return;
        }
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];

            console.log('Found authorized account', account);
            setCurrentAccount(account);
        } else {
            console.log('No authorized account found');
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Install MetaMask!');

                return;
            }

            console.log('We have the ethereum object', ethereum);

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            console.log('Connected', accounts[0]);

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const askContractToMintNFT = async () => {
        const CONTRACT_ADDRESS = '0x64EEC29191480D27C6Ea3A9575AeB65bDC8C641E';

        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Install MetaMask!');

                return;
            }

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

            console.log('Going to pop wallet now to pay gas');

            const nftTxn = await connectedContract.makeAnEpicNFT();

            console.log('Mining... please wait.');

            await nftTxn.wait();

            console.log(`Mined. see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        } catch (error) {
            console.log(error);
        }
    };

    const renderNotConnectedContainer = () => {
        return (
            <button className="cta-button connect-wallet-button" onClick={connectWallet}>
                Connect to wallet
            </button>
        );
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">My NFT Collection</p>
                    <p className="sub-text">
                        Each unique. Each beautiful. Discover your NFT today.
                    </p>
                    {currentAccount === '' ? (
                        renderNotConnectedContainer()
                    ) : (
                        <button
                            className="cta-button connect-wallet-button"
                            onClick={askContractToMintNFT}
                        >
                            Mint NFT
                        </button>
                    )}
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        rel="nonreferrer noreferrer"
                        target="_blank"
                    >
                        built on @{TWITTER_HANDLE}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default App;
