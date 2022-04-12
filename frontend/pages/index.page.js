import React from 'react';
import Button from './components/Button';
import { ethers } from 'ethers';
import { useSigner } from './contexts/SignerContext';

const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'approvals',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_proposalId',
        type: 'uint256',
      },
    ],
    name: 'handleProposalApproved',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export default function Home() {
  const signer = useSigner();
  const callContract = async () => {
    const contract = new ethers.Contract(address, abi, signer);
    const tx = await contract.handleProposalApproved(1);
    console.log({ tx });
    await tx.wait();
    const approved = await contract.approvals(1);
    console.log({ approved });
    const balance = await signer.getBalance();
    console.log({ balance: ethers.utils.formatEther(balance) });
  };
  return (
    <div>
      <Button primary className="m-3">
        Home
      </Button>
      <Button className="m-3" onClick={callContract}>
        Call contract
      </Button>
    </div>
  );
}
