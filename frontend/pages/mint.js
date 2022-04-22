import React, { useEffect, useState } from 'react';
import Button from './components/Button';
import ImageInput from './components/ImageInput';
import { hashImage, safeParseInt } from '../lib/utils';
import { upload } from '../lib/ipfs-utils';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getAllowance = async () => {
  await sleep(1000);
  return 3;
};

export default function Mint({ evAddress }) {
  const [allowance, setAllowance] = useState(undefined);
  const [rawId, setRawId] = useState(0);
  const [pictureHash, setPictureHash] = useState('');
  const [image, setImage] = useState(null);
  const [ipfsPath, setIpfsPath] = useState(undefined);

  useEffect(() => {
    getAllowance(evAddress).then(setAllowance);
  }, []);

  const handleImageSelected = (image) => {
    setImage(image);
    hashImage(image).then(setPictureHash);
    upload(image).then(({ path }) => setIpfsPath(path));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nftId = safeParseInt(rawId);
    console.log({ nftId, pictureHash });
    upload(JSON.stringify({ nftId, pictureHash })).then((address) =>
      console.log('data uploaded at https://ipfs.io/ipfs/' + address)
    );
  };

  return (
    <div>
      Mint
      <br />
      {allowance && 'You are allowed to mint ' + allowance + ' tickets.'}
      <br />
      {!image && <ImageInput onSelected={handleImageSelected} />}
      {pictureHash && 'Picture hash: ' + pictureHash}
      {ipfsPath && (
        <Button>
          <a href={'https://ipfs.io/ipfs/' + ipfsPath} target="_blank">
            View uploaded picture on IPFS
          </a>
        </Button>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="border-2 border-gray-500 p-2 rounded-lg my-2"
            type="text"
            id="id"
            placeholder="NFT id"
            value={rawId}
            onChange={(e) => setRawId(e.target.value)}
          />
        </div>
        {/* <div>
          <input
            className="border-2 border-gray-500 p-2 rounded-lg my-2"
            type="text"
            id="hash"
            placeholder="Picture hash"
            value={pHash}
            onChange={(e) => setPHash(e.target.value)}
          />
        </div> */}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
