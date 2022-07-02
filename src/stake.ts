import {
  Connection,
  Keypair,
  StakeProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Authorized,
  Transaction,
} from '@solana/web3.js';

export const SOLADEX_VOTE_ACCOUNT =
  'CwSZ17woioM2bqEbaswZJYvx5pemN6t3shBcU6zqPHyG';
//! DEV AND WRONG
// const SOLADEX_VOTE_ACCOUNT = 'Ddiy29vVeYVdU77qBQR4uKbFJfQRJsbyDQ84oMFLEbhB';

export async function getInitCreateDelegateTX({
  ownerPubkey,
  connection,
  totalSol,
}: {
  ownerPubkey: PublicKey;
  connection: Connection;
  totalSol: number;
}) {
  const soladexPubKey = new PublicKey(SOLADEX_VOTE_ACCOUNT);
  const stakeAccount = new Keypair();

  const totalLamports = totalSol * LAMPORTS_PER_SOL;

  let createStakeAccountIX = StakeProgram.createAccount({
    fromPubkey: ownerPubkey,
    stakePubkey: stakeAccount.publicKey,
    lamports: totalLamports,
    authorized: new Authorized(ownerPubkey, ownerPubkey),
  });

  let delegateStakeTX = StakeProgram.delegate({
    authorizedPubkey: ownerPubkey,
    stakePubkey: stakeAccount.publicKey,
    votePubkey: soladexPubKey,
  });

  let createTX = new Transaction()
    .add(createStakeAccountIX)
    .add(delegateStakeTX);

  const recentBlockhash = await (
    await connection.getLatestBlockhash()
  ).blockhash;

  createTX.recentBlockhash = recentBlockhash;

  return { createTX, stakeAccount };
}
