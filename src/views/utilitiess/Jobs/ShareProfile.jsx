import React from 'react';
import { useParams } from 'react-router-dom';

const ShareProfile = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Shared Profile Page</h1>
      <p>Profile ID: {id}</p>
    </div>
  );
};

export default ShareProfile;
