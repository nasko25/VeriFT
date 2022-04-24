import * as Client from 'ipfs-http-client';
import * as CryptoJS from 'crypto-js';

function toString(words) {
  return CryptoJS.enc.Utf8.stringify(words);
} function uintToString(uintArray) {
  var decodedStr = new TextDecoder("utf-8").decode(uintArray);
  return decodedStr;
} function wordArrayToByteArray(word, length) {
  var ba = [], i, xFF = 0xFF;
  if (length > 0)
    ba.push(word >>> 24);
  if (length > 1)
    ba.push((word >>> 16) & xFF);
  if (length > 2)
    ba.push((word >>> 8) & xFF);
  if (length > 3)
    ba.push(word & xFF); return ba;
}

export const upload = async (file) => {
  const client = Client.create('https://ipfs.infura.io:5001/api/v0');
  const added = await client.add(file);
  return added.path;
};

export const encryptImage = (image) => {
  const wordArray = CryptoJS.lib.WordArray.create(image);
  const str = CryptoJS.enc.Hex.stringify(wordArray);
  const ct = CryptoJS.AES.encrypt(str, 'test');
  const ctstr = ct.toString();
  console.log("enc", ctstr);

  return ctstr;
}

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = Buffer.from((b64Data), 'base64');
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}


export async function encodeImageFileAsURL(image) {
  var file = image;
  var reader = new FileReader();
  reader.onloadend = function () {
    console.log('RESULT', reader.result)
  }
  const base64 = await fetch(reader.result);
  console.log(reader.result);
  const blob = await base64.blob();
  const FileSaver = require('file-saver');
  FileSaver.saveAs(blob, "test.png");
  reader.readAsDataURL(file);
}

export const decryptAESImage = (data, key) => {
  console.log(data);
  var decrypted = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
  console.log("Decrypted: ", decrypted);

  // const wordArray = CryptoJS.enc.Hex.parse(decrypted);
  // const BaText = wordArrayToByteArray(wordArray, wordArray.length);

  // const FileSaver = require('file-saver');
  // var arrayBufferView = new Uint8Array(BaText);
  // var blob = new Blob([arrayBufferView], { type: "image/png" });
  // FileSaver.saveAs(blob, "test.png");
  return decrypted;
}
