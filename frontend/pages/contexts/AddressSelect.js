import React, { useEffect } from 'react';
import { useState } from 'react';
import { shortenAddress } from '../../lib/utils';
import { ethers } from 'ethers';

export default function AddressSelect({ onSignerObtained }) {
  const [address, setAddress] = useState(undefined);
  const getSigner = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await signer.getBalance();

    console.log({ balance: ethers.utils.formatEther(balance) });
    console.log({ address });

    setAddress(address);
    onSignerObtained(signer);
  };

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    provider.listAccounts().then((accounts) => {
      if (accounts.length) getSigner();
    });
  }, []);

  return (
    <button
      className="shadow-lg px-1 py-2 w-60 absolute right-4 top-0 rounded-full bg-gradient-to-br from-pink-200 to-purple-400"
      onClick={getSigner}
    >
      {address === undefined ? (
        'Connect wallet'
      ) : (
        <>
          {shortenAddress(address)}
          <br />
          {window.ethereum.networkVersion}
        </>
      )}
    </button>
  );
}
