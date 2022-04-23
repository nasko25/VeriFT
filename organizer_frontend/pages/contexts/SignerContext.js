import React, { useState, useContext, useEffect } from 'react';
import AddressSelect from './AddressSelect';
import { ethers } from 'ethers';

const local = true;

const SignerContext = React.createContext(undefined);

export default function SignerProvider({ children }) {
  const [signer, setSigner] = useState(undefined);
  useEffect(() => {
    if (local) {
      const provider = new ethers.providers.JsonRpcProvider(
        'http://localhost:8545'
      );
      const signer = provider.getSigner(0);
      setSigner(signer);
    }
  }, []);
  return (
    <div className="relative">
      {!local && <AddressSelect onSignerObtained={setSigner} />}
      <SignerContext.Provider value={signer}>{children}</SignerContext.Provider>
    </div>
  );
}

export const useSigner = () => useContext(SignerContext);
