import React, { useEffect } from 'react';
import { mintNft, checkHash } from '../lib/contractMethods';
import { useSigner } from './contexts/SignerContext';
import getTokensByOwner from '../lib/tokensByOwner';
import Button from './components/Button';
const nftAddress = '0x47A7Cd83471D9d8d4A856bBb641F14f985d6bACb';
const eventAddress = '0x1921a0CA21FC78FD988c767FCF93D7C54Acc6910';
const hashToCheck =
  '0x69ff9ff8359d962999914ea763fda5dd4bad255b9f9fb525d1d387022b3cc0f4';

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
