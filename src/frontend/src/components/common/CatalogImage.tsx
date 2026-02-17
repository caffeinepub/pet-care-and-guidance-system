import { useState } from 'react';

interface CatalogImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
}

export default function CatalogImage({ src, alt, fallbackSrc, className = '' }: CatalogImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}
