import React, { useEffect, useState } from 'react';
import Button from './Button';
import QRCode from 'qrcode.react';

export default function TicketInfo({ image, data }) {
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    setImageUrl(URL.createObjectURL(image));
  }, []);

  const downloadQRCode = () => {
    const qrCodeURL = document
      .getElementById('qrCodeEl')
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    console.log(qrCodeURL);
    let aEl = document.createElement('a');
    aEl.href = qrCodeURL;
    aEl.download = 'QR_Code.png';
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl text-center">Your ticket</h1>
        <Button primary className="mr-5" onClick={downloadQRCode}>
          Download Ticket
        </Button>
        <Button onClick={() => window.location.reload(false)}>
          Mint more tickets
        </Button>
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        <p>
          <strong>NFT ID:</strong> {data.nftId}
        </p>
        <p>
          <strong>IPFS Path:</strong> {data.ipfsPath}
        </p>
      </div>
      <div className="flex gap-6">
        <QRCode id="qrCodeEl" size={150} value={JSON.stringify(data)} />
        <img src={imageUrl} alt="preview" className="object-contain" />
      </div>
    </div>
  );
}
