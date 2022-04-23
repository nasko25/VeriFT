import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import ImageInput from '../components/ImageInput';
import TicketInfo from '../components/TicketInfo';
import { useRouter } from 'next/router';
import { hashImage } from '../../lib/utils';
import { upload } from '../../lib/ipfs-utils';
import { ethers } from 'ethers';
import { useSigner } from '../contexts/SignerContext';
import eventContract from '../../public/Event.json';

export default function Mint() {
  const address = useRouter().query.address;
  const [allowance, setAllowance] = useState(undefined);
  const [imageHash, setImageHash] = useState('');
  const [ipfsPath, setIpfsPath] = useState(undefined);
  const [nfts, setNfts] = useState({ 1: 0, 12: 0, 123: 0, 1234: 0 });
  const [nftId, setNftId] = useState(1);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [minted, setMinted] = useState(false);

  const signer = useSigner();

  const getAllowance = async () => {
    if (!address) return;
    const contract = new ethers.Contract(address, eventContract.abi, signer);
    const allowance = await contract.maxTicketNumber();
    setAllowance(allowance);
  };

  useEffect(() => {
    getAllowance();
  }, [address]);

  const handleImageSelected = (image) => {
    setImage(image);
    hashImage(image).then(setImageHash);
  };

  const handleMint = (e) => {
    e.preventDefault();
    console.log({ name, nftId, imageHash });
    upload(image).then((address) => {
      const ipfsPath = 'https://ipfs.io/ipfs/' + address;
      setIpfsPath(ipfsPath);
      console.log('data uploaded at ' + ipfsPath);
      setMinted(true);
    });
  };

  const mintedCount = Object.values(nfts).reduce((acc, cur) => acc + cur, 0);

  if (minted) {
    return <TicketInfo image={image} data={{ ipfsPath, nftId, name }} />;
  }

  return (
    <div>
      Mint
      <br />
      {allowance &&
        'You have minted ' +
          mintedCount +
          ' out of ' +
          allowance +
          ' tickets you are allowed.'}
      <br />
      <div className="shadow-lg mx-5 border-2 border-slate-700 p-3 rounded-lg">
        Mint ticket {mintedCount + 1}
        <ImageInput onSelected={handleImageSelected} />
        <form onSubmit={handleMint}>
          <input
            type="text"
            placeholder="Name"
            className="border-2 border-gray-500 p-2 rounded-lg block"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="border-2 border-gray-500 p-2 rounded-lg my-2 block"
            onChange={(e) => setNftId(parseInt(e.target.value))}
            value={nftId}
          >
            {Object.entries(nfts).map(([nftId, idMinted]) => (
              <option key={nftId} value={nftId}>
                {nftId} : {idMinted} / {allowance}
              </option>
            ))}
          </select>
          <Button primary type="submit">
            Mint ticket
          </Button>
        </form>
      </div>
    </div>
  );
}
