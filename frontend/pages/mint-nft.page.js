import React, { useEffect } from 'react';
import { mintNft, checkHash } from '../lib/contractMethods';
import { useSigner } from './contexts/SignerContext';
import getTokensByOwner from '../lib/tokensByOwner';

const nftAddress = '0x47A7Cd83471D9d8d4A856bBb641F14f985d6bACb';
const eventAddress = '0x1921a0CA21FC78FD988c767FCF93D7C54Acc6910';
const hashToCheck =
  '0x5a7c87a7dcabe6edac4fa0f1f2616ce42fda6cba7e32a398cd5ca92e2aa141fb';

export default function Data() {
  const signer = useSigner();

  useEffect(() => {
    if (!signer) return;
    // signer.getAddress().then((userAddress) => {
    //   console.log(nftAddress, userAddress);
    //   getTokensByOwner(nftAddress, userAddress).then(console.log);
    // });
    mintNft(nftAddress, signer, 'xd').then(() => {
      console.log('Minted');
    });
    // checkHash(eventAddress, hashToCheck, signer).then((check) =>
    //   console.log({ check })
    // );
  }, [signer]);

  return <div></div>;
}
