import React, { useState } from 'react';
import Button from './Button';

export default function ImageInput({ onSelected }) {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const handleChange = (event) => {
    setImageUrl(URL.createObjectURL(event.target.files[0]));
    setImage(event.target.files[0]);
  };
  return (
    <div>
      <input type="file" onChange={handleChange} />
      {imageUrl && (
        <>
          <img src={imageUrl} alt="preview" />
          <Button onClick={() => onSelected(image)}>Accept</Button>
        </>
      )}
    </div>
  );
}
