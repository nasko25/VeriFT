import * as Client from 'ipfs-http-client';

export const upload = async (file) => {
  const client = Client.create('https://ipfs.infura.io:5001/api/v0');
  const added = await client.add(file);
  return added.path;
};

export const encryptImage = (image) => {
  const array = new Uint8Array(image);
  var encrypted = CryptoJS.AES.encrypt(String.fromCharCode.apply(null, uInt8Array), "test");
}
