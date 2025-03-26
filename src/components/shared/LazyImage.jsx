import React, { useState } from 'react';
import { Skeleton } from '@mui/material';

const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <Skeleton variant="rectangular" {...props} />}
      <img
        src={src}
        alt={alt}
        style={{ display: isLoaded ? 'block' : 'none' }}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </>
  );
};

export default LazyImage; 