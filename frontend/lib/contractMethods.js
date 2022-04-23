import { ethers } from 'ethers';
import eventJson from '../public/Event.json';
import nftJson from '../public/ERC721.json';

export const getTotalSupply = async (nftAddress, signer) => {
  const nftContract = new ethers.Contract(nftAddress, nftJson.abi, signer);
  return await nftContract.totalSupply();
};

export const getAllowance = async (eventAddress, signer) => {
  const eventContract = new ethers.Contract(
    eventAddress,
    eventJson.abi,
    signer
  );
  return await eventContract.maxTicketNumber();
};

export const getMintedFromToken = async (eventAddress, tokenId, signer) => {
  const contract = new ethers.Contract(eventAddress, eventJson.abi, signer);
  return await contract.mintedFromIndex(tokenId);
};

export const checkHash = async (eventAddress, hash, signer) => {
  const contract = new ethers.Contract(eventAddress, eventJson.abi, signer);
  return await contract.hashes(hash);
};

export const mintNft = async (nftAddress, signer, uri = 'xd') => {
  const contract = new ethers.Contract(nftAddress, nftJson.abi, signer);
  const tx = await contract.mint(uri);
  await tx.wait();
};

export const getOwner = async (nftAddress, tokenId, signer) => {
  const contract = new ethers.Contract(nftAddress, nftJson.abi, signer);
  return await contract.ownerOf(tokenId);
};

export const mintTicket = async (eventAddress, nftId, hash, price, signer) => {
  const contract = new ethers.Contract(eventAddress, eventJson.abi, signer);
  const tx = await contract.mintTicket(nftId, hash, { value: price });
  await tx.wait();
};

import mapping from '../public/EventToAddressStore.json';

export const getAddressByName = async (name, signer) => {
  const contract = new ethers.Contract(
    '0xd43aB058d44ae56BEffA005991FFA3E9a6C41B8A',
    mapping.abi,
    signer
  );
  return await contract.eventNameToAddress(name);
};

export const getEventPrice = async (eventAddress, signer) => {
  const contract = new ethers.Contract(eventAddress, eventJson.abi, signer);
  return await contract.price();
};
