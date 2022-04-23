import React, { useState } from 'react';

export default function ImageInput({ onSelected }) {
  const [imageUrl, setImageUrl] = useState(null);
  const handleChange = (event) => {
    setImageUrl(URL.createObjectURL(event.target.files[0]));
    onSelected(event.target.files[0]);
  };

  return (
    <div>
      <input type="file" onChange={handleChange} name="Submit" />
      {imageUrl && (
        <img src={imageUrl} alt="preview" className="object-contain h-48" />
      )}
    </div>
  );
}
