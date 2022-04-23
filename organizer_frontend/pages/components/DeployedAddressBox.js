import React from 'react';

export default function DeployedAddressBar({ children, className, primary, ...props }) {
  return (
    <div className="box rounded-lg">
      <div className="padded-1 done"> Congratulations! </div> Your contract was deployed at {children}
    </div>
  );
}
