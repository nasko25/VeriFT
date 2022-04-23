import React, { useEffect, useState } from 'react';
import TicketInfo from '../components/TicketInfo';
import Button from '../components/Button';
import ImageInput from '../components/ImageInput';
import { useRouter } from 'next/router';
import { hashImage } from '../../lib/utils';
import { useSigner } from '../contexts/SignerContext';
import { upload } from '../../lib/ipfs-utils';
import {
  getAllowance,
  getMintedFromToken,
  getOwner,
  mintTicket,
} from '../../lib/contractMethods';
import getTokensByOwner from '../../lib/tokensByOwner';

const nftAddress = '0x47A7Cd83471D9d8d4A856bBb641F14f985d6bACb';

export default function Mint() {
  const signer = useSigner();

  const eventAddress = useRouter().query.address;
  const [allowance, setAllowance] = useState(undefined);

  const [ipfsPath, setIpfsPath] = useState(undefined);

  const [nfts, setNfts] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [nftId, setNftId] = useState('');
  const [minting, setMinting] = useState('no');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert('Please select an image');
      return;
    }
    const imageHash = await hashImage(image);
    console.log({ imageHash });
    const ipfsUri = await upload(image);
    const ipfsPath = 'https://ipfs.io/ipfs/' + ipfsUri;
    setIpfsPath(ipfsPath);
    console.log('data uploaded at ' + ipfsPath);
    const canMint = await verifyCanMint(nftId);

    if (!canMint) return;
    console.log('Minting');
    setMinting('minting');
    await mintTicket(eventAddress, nftId, imageHash, signer);
    setMinting('done');
  };

  const verifyCanMint = async (tokenId) => {
    try {
      const owner = await getOwner(nftAddress, tokenId, signer);
      if (owner !== (await signer.getAddress())) {
        alert('You are not the owner of this token');
        return false;
      }
    } catch (e) {
      alert('Token ID is not owned by you');
      return false;
    }
    const allowance = parseInt(await getAllowance(eventAddress, signer));
    const minted = parseInt(
      await getMintedFromToken(eventAddress, tokenId, signer)
    );
    console.log({ minted, allowance });
    if (minted >= allowance) {
      alert('You have already minted the maximum number of tickets');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!signer) return;
    getAllowance(eventAddress, signer).then((bnAllowance) =>
      setAllowance(parseInt(bnAllowance))
    );

    const getNfts = async () => {
      const userAddress = await signer.getAddress();
      console.log({ nftAddress, userAddress });
      const nftIds = await getTokensByOwner(nftAddress, userAddress);
      const mintCounts = await Promise.all(
        nftIds.map(async (id) => {
          const minted = await getMintedFromToken(eventAddress, id, signer);
          return [id, parseInt(minted)];
        })
      );
      setNfts(mintCounts);
    };
    getNfts();
  }, [signer]);

  if (minting === 'done') {
    return <TicketInfo image={image} data={{ ipfsPath, nftId, name }} />;
  }
  if (minting === 'minting')
    return 'Minting... This may take a few seconds. Do not navigate away...';

  const minted = nfts.map(([id, count]) => count).reduce((a, b) => a + b, 0);
  const totalAllowance = allowance * nfts.length;

  return (
    <div>
      You have minted {minted} / {totalAllowance} tickets.
      <div className="shadow-lg mx-5 border-2 border-slate-700 p-3 rounded-lg">
        <h2 className="text-xl text-blue-700 mb-2">Mint a ticket</h2>
        Select a picture for this ticket. It will be used to verify your ticket
        at entrance.
        <ImageInput onSelected={setImage} />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="border-2 border-gray-500 p-2 rounded-lg block my-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            placeholder="NFT ID"
            className="border-2 border-gray-500 p-2 rounded-lg block my-2"
            value={nftId}
            onChange={(e) => setNftId(e.target.value)}
          >
            {nfts.map(([nftId, count]) => {
              const color =
                count === allowance
                  ? 'bg-red-500'
                  : count === 0
                  ? 'bg-green-500'
                  : 'bg-yellow-500';
              return (
                <option key={nftId} value={nftId} className={color}>
                  NFT {nftId}: minted {count} / {allowance}
                </option>
              );
            })}
          </select>
          <Button primary type="submit">
            Mint ticket
          </Button>
        </form>
      </div>
    </div>
  );
}
