import { ethers } from 'ethers';
import erc721 from '../public/ERC721.json';

const alchemyKey = 'aSh8_mugy_5o3_7ciKcye1kjzHuQgqXA';
const provider = new ethers.providers.AlchemyProvider('rinkeby', alchemyKey);

async function listTokensOfOwner(tokenAddress, account) {
  const token = new ethers.Contract(tokenAddress, erc721.abi, provider);

  const sentLogs = await token.queryFilter(
    token.filters.Transfer(account, null)
  );
  const receivedLogs = await token.queryFilter(
    token.filters.Transfer(null, account)
  );

  const logs = sentLogs
    .concat(receivedLogs)
    .sort(
      (a, b) =>
        a.blockNumber - b.blockNumber || a.transactionIndex - b.transactionIndex
    );

  const owned = new Set();

  for (const {
    args: { from, to, tokenId },
  } of logs) {
    if (addressEqual(to, account)) {
      owned.add(tokenId.toString());
    } else if (addressEqual(from, account)) {
      owned.delete(tokenId.toString());
    }
  }

  return owned;
}

function addressEqual(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

async function getTokenName(tokenAddress) {
  const token = new ethers.Contract(tokenAddress, erc721.abi, provider);
  return token.name();
}

export default async function (token, account) {
  console.log(token, 'tokens owned by', account);
  const owned = await listTokensOfOwner(token, account);
  return [...owned].map((id) => parseInt(id));
}
