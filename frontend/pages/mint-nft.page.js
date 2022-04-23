import React from 'react';
import { mintNft } from '../lib/contractMethods';
import { useSigner } from './contexts/SignerContext';
import Button from './components/Button';

const nftAddress = '0x47A7Cd83471D9d8d4A856bBb641F14f985d6bACb';

export default function Data() {
  const signer = useSigner();

  const mint = async () => {
    mintNft(nftAddress, signer, 'xd').then(() => {
      console.log('Minted');
    });
  };

  return (
    <div className="flex">
      <Button primary onClick={mint} className="mx-auto content-center">
        Mint nft
      </Button>
    </div>
  );
}
