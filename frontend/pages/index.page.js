import React, { useState } from 'react';
import { isValidAddress } from '../lib/utils';
import Link from 'next/link';
import Button from './components/Button';
import { getAddressByName } from '../lib/contractMethods';
import { useSigner } from './contexts/SignerContext';

export default function UserFrontend() {
  const [evAddress, setEvAddress] = useState('');
  const [name, setName] = useState('');

  const signer = useSigner();

  const handleChange = (e) => {
    e.preventDefault();
    const newAddress = e.target.value;
    console.log({ newAddress });
    setEvAddress(newAddress);
    setValidAddress(isValidAddress(newAddress));
  };

  return (
    <div>
      <h1 className="text-2xl text-center">Find Your Event</h1>
      <p className="text-gray-600 text-center">Hint: try "Cool Event"</p>
      <div className="flex justify-center">
        <input
          className="border-2 border-gray-500 p-2 rounded-lg"
          type="text"
          placeholder="Event name"
          value={name}
          onInput={(e) => setName(e.target.value)}
        />
        <Button
          onClick={() => {
            getAddressByName(name, signer)
              .then(setEvAddress)
              .catch(() => setEvAddress(undefined));
          }}
          className="inline"
        >
          Find
        </Button>
      </div>
      Address: {evAddress}
      {evAddress && (
        <Link href={`/event/${evAddress}`}>
          <a className="mx-auto w-fit my-2 px-3 py-2 rounded text-center font-bold bg-blue-600 text-white block">
            Get tickets
          </a>
        </Link>
      )}
    </div>
  );
}
