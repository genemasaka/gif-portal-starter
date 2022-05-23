
import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

const TEST_GIFS = [
  'https://media.giphy.com/media/r1n1vFIedRDrlaSeDp/giphy.gif',
  'https://media.giphy.com/media/s1so6tuVGpNlkORR5P/giphy.gif',
  'https://media.giphy.com/media/1lvoeZP7jMAHHickFz/giphy.gif',
  'https://media.giphy.com/media/cjQcufUOHx2nc2YgPQ/giphy.gif'
]
// Constants
const TWITTER_HANDLE = 'masakagene';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAdd, setWalletAdd] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);
  //check if user has phantom wallet 
  const checkWalletConnection = async ()=> {
    try {
      const {solana} = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet!!!');
          //connect to the user's wallet directly
          const response = await solana.connect({onlyIfTrusted: true});
          console.log(
            'connected with pub-key: ', 
            response.publicKey.toString()
          );

          //set users pub-key in state 
          setWalletAdd(response.publicKey.toString());
        }
      }else {
        alert ('Solana object not fount. Install Phantom wallet.')
      }
    } catch(error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const {solana} = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with pub-key: ', response.publicKey.toString())
      setWalletAdd(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link: ', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log("No input found. Please input value")
    }
  }

  const onInputChange = (event) => {
    const {value} = event.target;
    setInputValue(value);
  }

  const renderConnectedContainer = () => (
    <div className='connected-container'>
      <form onSubmit = {(event) => {
        event.preventDefault();
        sendGif();
      }}
      >
        <input type ="text" placeholder= "Enter gif link" value ={inputValue} onChange={onInputChange} />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>"
      </form>
      <div className='gif-grid'>
        {gifList.map(gif => (
          <div className='gif-item' key ={gif}>
            <img src={gif} alt={gif} />
            </div>
        ))}
      </div>
    </div>
);

  const renderNotConnectedContainer = () => (
    <button className = "cta-button connect-wallet-button"
            onClick={connectWallet}
    >
      Connect Wallet
    </button>
  )
  useEffect(()=>{
    const onLoad = async () => {
      await checkWalletConnection();
    };
    window.addEventListener('load', onLoad);
    return() => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(()=>{
    if (walletAdd) {
      console.log('Fetching GIF list...');

      setGifList(TEST_GIFS);
    }
  })
  return (
    <div className="App">

      <div className="{walletAdd ? 'authed-container' : 'container'}">
        <div className="header-container">
          <p className="header"> &#128330; Virgil Abloh GIF Portal</p>
          <p className="sub-text">
          View your Virgil GIF collection in the metaverse ✨
          </p>
          {!walletAdd && renderNotConnectedContainer()}
          {walletAdd && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
