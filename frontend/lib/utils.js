import { ethers } from 'ethers';

export const formatBalance = (number) => {
  const digits = Math.floor(number).toString().length;
  if (digits >= 6) return number.toPrecision(digits + 1);
  return number.toPrecision(6);
};

export const shortenAddress = (add) =>
  add.substring(0, 6) + '...' + add.substring(add.length - 4, add.length);

export const isValidAddress = (address) => {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch (e) {
    return false;
  }
};

export const safeParseInt = (value) => {
  try {
    return parseInt(value);
  } catch (e) {
    return 0;
  }
};

export const hashImage = async (image) => {
  const arrayBuffer = await (
    await fetch(URL.createObjectURL(image))
  ).arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const hash = ethers.utils.sha256(bytes);

  console.log({ image, arrayBuffer, bytes });
  return hash;
};
