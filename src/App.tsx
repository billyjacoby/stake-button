import React from 'react';
import './App.css';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getInitCreateDelegateTX } from './stake';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function App() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [solToStake, setSolToStake] = React.useState(1);

  const onSendClick = async () => {
    if (wallet?.publicKey && wallet?.signTransaction) {
      try {
        const { createTX, stakeAccount } = await getInitCreateDelegateTX({
          connection,
          ownerPubkey: wallet.publicKey,
          totalSol: solToStake,
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
      <WalletMultiButton></WalletMultiButton>
      <React.Fragment>
        <input
          type="number"
          className="stake-button-input"
          id="stake-button-input"
          disabled={!wallet.connected}
          onChange={(e) => setSolToStake(parseFloat(e.target.value || '0'))}
          value={solToStake}
        />
        <button
          className="stake-button"
          id="stake-button"
          onClick={onSendClick}
          disabled={!wallet.connected}
        >
          Stake Now
        </button>
      </React.Fragment>
    </div>
  );
}
