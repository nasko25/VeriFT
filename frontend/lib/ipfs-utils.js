import * as Client from 'ipfs-http-client';

export const upload = async (file) => {
  const client = Client.create('https://ipfs.infura.io:5001/api/v0');
  const added = await client.add(file);
  return added.path;
};
