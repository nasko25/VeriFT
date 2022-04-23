import React from 'react';
import Button from './Button';

export default function ErrorDeployingBox({ className, primary, ...props }) {
  return (
    <div className="box rounded-lg">
      <div className="error"> Error </div> There was an error deploying your contract. <br/> Try again.
      <Button className="m-3 float-right btn-err" {...props}> Close </Button>
    </div>
  );
}
