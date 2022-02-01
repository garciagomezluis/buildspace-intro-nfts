/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { abi } from '../artifacts/contracts/MyEpicNFT.sol/MyEpicNFT.json';

import './App.css';

import twitterLogo from '/twitter-logo.svg';

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const CONTRACT_ADDRESS = '0xBFff4133609f3D26681E7Af13BEADc5F7830964e';

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
            setupEventListeners();
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
            setupEventListeners();
        } catch (error) {
            console.log(error);
        }
    };

    const askContractToMintNFT = async () => {
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

    const setupEventListeners = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log('Install MetaMask!');

            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(ethereum);

            const signer = provider.getSigner();

            const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

            connectedContract.on('NewEpicNFTMinted', (from, tokenId) => {
                console.log(from, tokenId.toNumber());

                alert(
                    `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`,
                );
            });

            console.log('Setup event listener!');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Install MetaMask!');

                return;
            }

            const chainId = await ethereum.request({ method: 'eth_chainId' });

            console.log(`Connected to chain ${chainId}`);

            // String, hex code of the chainId of the Rinkebey test network
            const rinkebyChainId = '0x4';

            if (chainId !== rinkebyChainId) {
                alert('You are not connected to the Rinkeby Test Network!');
            }
        })();

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
