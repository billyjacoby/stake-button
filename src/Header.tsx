import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface HeaderProps {
  network: string;
  setNetwork: Dispatch<SetStateAction<WalletAdapterNetwork>>;
}

export const Header = ({ network, setNetwork }: HeaderProps) => {
  return (
    <OuterContainer>
      <Container>
        <p style={{ fontWeight: 600 }}>Stake with Soladex!</p>
        <ButtonsContainer>
          <StyledSelect
            defaultValue={network}
            onChange={(e) => setNetwork(e.target.value as WalletAdapterNetwork)}
          >
            <option value="mainnet-beta">Mainnet</option>
            <option value="testnet">Testnet</option>
          </StyledSelect>
          <WalletMultiButton />
        </ButtonsContainer>
      </Container>
    </OuterContainer>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StyledSelect = styled.select`
  color: var(--font-color);
  background-color: var(--wallet-button-color);
  border-color: var(--wallet-button-color);
  border-radius: 4px;
  font-size: 1rem;
  padding: 0.5rem 1rem;
`;

const Container = styled.div`
  margin: auto;
  height: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 1.5rem;
`;

const OuterContainer = styled.div`
  padding: 0.95rem;
  width: 100vw;
  height: 40px;
  margin-bottom: 12px;

  background: var(--secondary-bg-color);
`;
