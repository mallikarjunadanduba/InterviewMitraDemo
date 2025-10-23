// components/AuthImage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

const AuthImage = ({ filePath, alt = "image", style = {} }) => {
  const [src, setSrc] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (!filePath) return;

    const fetchImage = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(filePath)}`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`
          },
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);
        setSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
        setSrc('');
      }
    };

    fetchImage();

    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [filePath, user?.accessToken]);

  return src ? (
    <img src={src} alt={alt} style={style} />
  ) : (
    <div style={{ fontSize: 12, color: "#999" }}>Loading...</div>
  );
};

export default AuthImage;
