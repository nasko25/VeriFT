import { React, useState, useEffect } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import { Dialog } from './components/Dialog';
import DeployedAddressBox from './components/DeployedAddressBox';
import ErrorDeployingBox from './components/ErrorDeployingBox';
import { ethers, ContractFactory } from 'ethers';
import { useSigner } from './contexts/SignerContext';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const addressTest = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
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

const chain = "ropsten";

export default function Home() {
  // const signer = useSigner();
  // const callContract = async () => {
  //   const contract = new ethers.Contract(address, abi, signer);
  //   const tx = await contract.handleProposalApproved(1);
  //   console.log({ tx });
  //   await tx.wait();
  //   const approved = await contract.approvals(1);
  //   console.log({ approved });
  //   const balance = await signer.getBalance();
  //   console.log({ balance: ethers.utils.formatEther(balance) });
  // };

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // infuraId: `9aa3d95b3bc440fa88ea12eaa4456161`,
        // rpc: `https://api-eu1.tatum.io/v3/blockchain/node/ETH/${process.env.TATUM_API_KEY}`

        // web3modal needs better documentation  -.-
        rpc: { 1: `https://api-eu1.tatum.io/v3/blockchain/node/ETH/${process.env.TATUM_API_KEY}` }  // no clue why chain id needs to be 1...
        // rpc: { 1: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"}
      }
    }
  };

  let signer;
  useEffect(() => {
    // async function getToken() {
    //     const token = await fetchKey(props.auth);
    //     setToken(token);
    // }
    // getToken();
    async function runWeb3Modal() {
      const web3Modal = new Web3Modal({
        network: chain,
        cacheProvider: true,
        providerOptions
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      signer = provider.getSigner();
      // alert(await signer.getBalance());
    }
    runWeb3Modal()
  }, [])


  const [address, setAddress] = useState('');
  const [collecionName, setCollecionName] = useState('');
  const [maxTickets, setMaxTickets] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketImage, setTicketImage] = useState('');
  const [displayAddress, setDisplayAddress] = useState(false);

  // TODO set to ""
  let contract = { address: addressTest };
  // TODO some input verification would be nice
  const deployContract = async () => {
    if (isNaN(maxTickets))
      alert("Number of nfts to mint is not an integer. Try again.");
    else {
      // const factory = new ContractFactory(abi, contractByteCode, signer);
      // const contract = await factory.deploy({_NFTToHold: address,
      //                                        _maxTicketNumber: maxTickets,
      //                                        _price: ticketPrice,
      //                                        _eventName: collecionName,
      //                                        _eventSymbol: "eth",
      //                                        imageURI: ticketImage});

      setDisplayAddress(true);
      console.log("Contract deployed at: ", contract.address);
      // console.log(contract.deployTransaction);
    }
  }
  // TODO contract addr or choose from list

  const balance = await lensHub.balanceOf(user.address);
  let profiles = [];
  for (var i = 0; i < balance.toNumber(); ++i) {
    let profile = await lensHub.tokenOfOwnerByIndex(user.address, i);
    profiles.push(profile);
  }

  const [value, setValue] = React.useState('fruit');

  return (
    <div>
      <Input className="address" value={address} onInput={e => setAddress(e.target.value)}> Contract address: </Input>
      or
      <select value={0} onChange={onChange}>
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
      <Input className="name-of-collection" value={collecionName} onInput={e => setCollecionName(e.target.value)}> Collection Name: </Input>
      <Input className="num-to-mint" value={maxTickets} onInput={e => setMaxTickets(e.target.value)}> Max # of tickets: </Input>
      <Input value={ticketPrice} onInput={e => setTicketPrice(e.target.value)}> Ticket price: </Input>
      <Input value={ticketImage} onInput={e => setTicketImage(e.target.value)}> Ticket image URL: </Input>
      <Button className="m-3" onClick={deployContract}>
        Generate
      </Button>
      <Dialog open={displayAddress} onClose={() => setDisplayAddress(false)}>
        {contract.address != "" ? <DeployedAddressBox> {contract.address} </DeployedAddressBox> : <ErrorDeployingBox onClick={() => setDisplayAddress(false)} />}
      </Dialog>
    </div>
  );
}
