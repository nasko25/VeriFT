import React, { useState } from 'react';
import { isValidAddress } from '../lib/utils';
import Link from 'next/link';

export default function UserFrontend() {
  const [evAddress, setEvAddress] = useState('');
  const [validAddress, setValidAddress] = useState(false);

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
      <input
        className="border-2 border-gray-500 p-2 rounded-lg mx-auto block"
        type="text"
        placeholder="Event contract"
        value={evAddress}
        onInput={handleChange}
      />
      {validAddress && (
        <Link href={`/event/${evAddress}`}>
          <a className="mx-auto w-fit my-2 px-3 py-2 rounded text-center font-bold bg-blue-600 text-white block">
            Get tickets
          </a>
        </Link>
      )}
    </div>
  );
}
