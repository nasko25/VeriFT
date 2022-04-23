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
