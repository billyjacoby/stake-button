import React from 'react';
import styled from 'styled-components';
import './App.css';

import { Wallet } from './Wallet';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getInitCreateDelegateTX, SOLADEX_VOTE_ACCOUNT } from './stake';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Header } from './Header';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

require('@solana/wallet-adapter-react-ui/styles.css');

export function App() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [solToStake, setSolToStake] = React.useState('1.0');
  const [walletBalance, setWalletBalance] = React.useState('loading...');

  React.useEffect(() => {
    (async () => {
      if (wallet.publicKey) {
        let balance = await connection.getBalance(wallet.publicKey);
        console.log(balance);
        setWalletBalance(
          String(Math.floor((balance / LAMPORTS_PER_SOL) * 10000) / 10000) +
            ' sol'
        );
      } else {
        setWalletBalance('loading...');
      }
    })();
  }, [wallet?.publicKey, connection]);

  const onSendClick = async () => {
    if (wallet?.publicKey && wallet?.signTransaction && solToStake) {
      try {
        const { createTX, stakeAccount } = await getInitCreateDelegateTX({
          connection,
          ownerPubkey: wallet.publicKey,
          totalSol: parseFloat(solToStake),
        });
        const sig = await wallet.sendTransaction(createTX, connection, {
          signers: [stakeAccount],
        });
        console.log('sig', sig);
        const success = await connection.confirmTransaction(sig);
        console.log('success', success);
      } catch (e) {
        console.log('ERROR', e);
      }
    }
  };

  return (
    <div className="App">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 0,
        }}
      >
        <IntroContainer>
          <h2>Stake your Solana with Soladex!</h2>
          <p>
            The easiest way to stake your Solana on the Soladex validator.
            Connect your wallet, select the amount you want to stake, and
            confirm the transaction!
          </p>
        </IntroContainer>
        <InputContainer>
          {!wallet.connected ? (
            <h4 style={{ padding: 0, margin: 0, height: 0, paddingBottom: 8 }}>
              Connect your Solana wallet to continue!
            </h4>
          ) : (
            <h4 style={{ padding: 0, margin: 0, height: 0, paddingBottom: 8 }}>
              Wallet Balance: <WalletBalance>{walletBalance}</WalletBalance>
            </h4>
          )}
          <StakeInput
            type="number"
            maxLength={5}
            step="0.1"
            size={5}
            className="stake-button-input"
            id="stake-button-input"
            disabled={!wallet.connected}
            onChange={(e) => setSolToStake(e.target.value)}
            value={solToStake}
          />
          <StakeButton
            className="stake-button"
            id="stake-button"
            onClick={onSendClick}
            disabled={!wallet.connected || !solToStake}
          >
            Stake Now
          </StakeButton>
        </InputContainer>
      </div>
      <Footer>
        <p style={{ gap: 0, padding: 0, margin: 0, paddingTop: '2rem' }}>
          Delegating to vote account:
        </p>
        <p style={{ gap: 0, padding: 0, margin: 0 }}>
          <SoladexLink
            href="https://soladex.io"
            target="_blank"
            rel="noreferrer noopener"
          >
            Soladex.io
          </SoladexLink>
        </p>
        <p style={{ gap: 0, padding: 0, margin: 0, fontSize: '0.75rem' }}>
          ({SOLADEX_VOTE_ACCOUNT})
        </p>
      </Footer>
    </div>
  );
}

export default function WrappedApp() {
  const [network, setNetwork] = React.useState(WalletAdapterNetwork.Mainnet);
  return (
    <Wallet network={network}>
      <Header network={network} setNetwork={setNetwork} />
      <App />
    </Wallet>
  );
}

const Footer = styled.div`
  justify-self: flex-end;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
`;

const WalletBalance = styled.span`
  color: var(--soladex-purple);
  font-size: 1.5rem;
`;

const SoladexLink = styled.a`
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 800;

  color: var(--soladex-purple);
`;

const IntroContainer = styled.div`
  max-width: 600px;
  line-height: 1.5rem;
  text-align: center;
`;

const StakeInput = styled.input`
  font-size: 1.5rem;
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 1rem;

  :disabled {
    background: grey;
    cursor: not-allowed;
  }
`;

const StakeButton = styled.button`
  background: var(--wallet-button-color);
  color: var(--main-font-color);

  font-size: 1.25rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  :disabled {
    background: grey;
    cursor: not-allowed;
  }
`;
