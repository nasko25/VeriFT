import React, { useState } from 'react';
import Button from './components/Button';
import Mint from './mint';
import { isValidAddress } from '../lib/utils';
import QRCode from 'react-qr-code';

export default function UserFrontend() {
  const [evAddress, setEvAddress] = useState('');
  const [validAddress, setValidAddress] = useState(undefined);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidAddress(evAddress)) {
      alert('Invalid address');
      return;
    }
    console.log({ evAddress });
    setValidAddress(evAddress);
  };

  if (validAddress) {
    return <Mint evAddress={validAddress} />;
  }
  return (
    <div>
      User Frontend
      <QRCode value="https://npmjs.com" />
      <form onSubmit={handleSubmit}>
        <input
          className="border-2 border-gray-500 p-2 rounded-lg"
          type="text"
          placeholder="Event contract"
          value={evAddress}
          onChange={(e) => setEvAddress(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
