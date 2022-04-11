import React, { useState } from 'react';
import { AddressSelect } from '../components/AddressSelect';

export const SignerContext = React.createContext(undefined);

export default function SignerProvider({ children }) {
  const [signer, setSigner] = useState(undefined);
  return (
    <div className="relative">
      <AddressSelect onSignerObtained={setSigner} />
      <SignerContext.Provider value={signer}>{children}</SignerContext.Provider>
    </div>
  );
}
